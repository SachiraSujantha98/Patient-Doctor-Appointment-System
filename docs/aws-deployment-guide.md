# AWS Deployment Guide (Free Tier Compatible)

This guide provides detailed instructions for deploying the Patient-Doctor Appointment System frontend to AWS infrastructure, optimized for free tier usage.

## Free Tier Limits Overview
- S3: 5GB storage, 20,000 GET requests, 2,000 PUT requests per month
- CloudFront: 50GB data transfer out, 2,000,000 HTTP/HTTPS requests per month
- Route 53: Not included in free tier (optional, can use CloudFront URL)
- ACM: Free for public certificates
- CloudWatch: 10 metrics, 10 alarms, 1,000,000 API requests

## Table of Contents
- [Prerequisites](#prerequisites)
- [AWS Services Setup](#aws-services-setup)
- [Infrastructure Setup](#infrastructure-setup)
- [Security Configuration](#security-configuration)
- [Deployment Configuration](#deployment-configuration)
- [Monitoring Setup](#monitoring-setup)
- [Cost Optimization](#cost-optimization)
- [Troubleshooting](#troubleshooting)
- [Backup and Disaster Recovery (Free Tier Compatible)](#backup-and-disaster-recovery-free-tier-compatible)

## Prerequisites

### AWS Account Setup
1. Create a new AWS account (12-month free tier eligibility)
2. Enable MFA for root account (free security feature)
3. Create a limited IAM user (free):
   ```bash
   aws iam create-user --user-name deployment-user
   # Limit permissions to only required services
   aws iam attach-user-policy --user-name deployment-user --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
   aws iam put-user-policy --user-name deployment-user --policy-name "MinimalDeployAccess" --policy-document '{
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:DeleteObject",
           "cloudfront:CreateInvalidation"
         ],
         "Resource": [
           "arn:aws:s3:::your-app-dev/*",
           "arn:aws:cloudfront::*:distribution/*"
         ]
       }
     ]
   }'
   ```

## AWS Services Setup (Free Tier Optimized)

### S3 Configuration
1. **Create Single Bucket** (minimize storage usage)
   ```bash
   # Create only one bucket for development
   aws s3 mb s3://your-app-dev --region us-east-1
   ```

2. **Minimal Bucket Policy**
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::your-app-dev/*"
           }
       ]
   }
   ```

3. **Storage Optimization**
   ```bash
   # Enable compression for JS/CSS/HTML files
   aws s3 sync dist/ s3://your-app-dev/ \
     --delete \
     --exclude "*" \
     --include "*.js" --include "*.css" --include "*.html" \
     --content-encoding gzip \
     --content-type "application/javascript" \
     --metadata-directive REPLACE

   # Set aggressive caching for static assets
   aws s3 sync dist/ s3://your-app-dev/ \
     --exclude "*" \
     --include "*.jpg" --include "*.png" --include "*.svg" \
     --cache-control "public, max-age=31536000"
   ```

### CloudFront Setup (Free Tier Optimized)
```bash
# Create distribution with minimal settings
aws cloudfront create-distribution \
  --origin-domain-name your-app-dev.s3.amazonaws.com \
  --default-root-object index.html \
  --price-class PriceClass_100 \
  --enabled true \
  --default-cache-behavior "MinTTL=3600,DefaultTTL=86400,MaxTTL=31536000,ForwardedValues={QueryString=false,Cookies={Forward=none}},ViewerProtocolPolicy=redirect-to-https,AllowedMethods={Items=[GET,HEAD],Quantity=2}"
```

## Backup Strategy (Free Tier Optimized)

1. **Efficient Versioning**
   ```bash
   # Enable versioning but with lifecycle rules
   aws s3api put-bucket-versioning \
     --bucket your-app-dev \
     --versioning-configuration Status=Enabled

   # Add lifecycle rule to expire old versions after 7 days
   aws s3api put-bucket-lifecycle-configuration \
     --bucket your-app-dev \
     --lifecycle-configuration '{
       "Rules": [
         {
           "ID": "ExpireOldVersions",
           "Status": "Enabled",
           "NoncurrentVersionExpiration": {
             "NoncurrentDays": 7
           }
         }
       ]
     }'
   ```

2. **Minimal Backup Script**
   ```bash
   #!/bin/bash
   # minimal-backup.sh
   
   # Keep only the last 2 backups to stay well within free tier
   MAX_BACKUPS=2
   BUCKET_NAME="your-app-dev"
   TIMESTAMP=$(date +%Y%m%d)
   
   # Create backup of only essential files
   aws s3 sync s3://${BUCKET_NAME}/ s3://${BUCKET_NAME}/backup-${TIMESTAMP}/ \
     --exclude "*" \
     --include "index.html" \
     --include "assets/*" \
     --quiet

   # Remove old backups
   aws s3 ls s3://${BUCKET_NAME}/ | grep "backup-" | sort -r | tail -n +$((MAX_BACKUPS + 1)) | \
     while read -r line; do
       folder=$(echo "$line" | awk '{print $2}')
       aws s3 rm s3://${BUCKET_NAME}/${folder} --recursive
     done
   ```

## Monitoring (Free Tier Compatible)

1. **Basic Monitoring**
   ```bash
   # Set up basic CloudWatch alarm (within free tier limits)
   aws cloudwatch put-metric-alarm \
     --alarm-name "S3StorageLimit" \
     --metric-name "BucketSizeBytes" \
     --namespace "AWS/S3" \
     --statistic Average \
     --period 86400 \
     --threshold 4831838208 \  # 4.5GB - warning before hitting 5GB limit
     --comparison-operator GreaterThanThreshold \
     --evaluation-periods 1 \
     --dimensions Name=BucketName,Value=your-app-dev \
     --alarm-actions arn:aws:sns:region:account-id:topic-name
   ```

2. **Usage Monitoring Script**
   ```bash
   #!/bin/bash
   # check-usage.sh
   
   # Check S3 storage usage
   echo "S3 Storage Usage:"
   aws s3 ls s3://your-app-dev --recursive --human-readable --summarize | grep "Total Size"
   
   # Check CloudFront usage (last 24h)
   echo "CloudFront Requests (24h):"
   aws cloudwatch get-metric-statistics \
     --namespace AWS/CloudFront \
     --metric-name Requests \
     --dimensions Name=DistributionId,Value=YOUR_DIST_ID \
     --start-time $(date -d '24 hours ago' --iso-8601=seconds) \
     --end-time $(date --iso-8601=seconds) \
     --period 86400 \
     --statistics Sum
   ```

## Deployment Best Practices (Free Tier)

1. **Optimize Deployments**
   ```bash
   #!/bin/bash
   # efficient-deploy.sh
   
   # Build with optimization
   VITE_APP_ENV=production npm run build
   
   # Deploy only changed files
   aws s3 sync dist/ s3://your-app-dev/ \
     --delete \
     --size-only \
     --exclude "*.map" \
     --metadata-directive REPLACE
   
   # Selective cache invalidation
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/index.html" "/manifest.json"
   ```

2. **Resource Cleanup**
   ```bash
   #!/bin/bash
   # cleanup.sh
   
   # Remove old assets
   aws s3 rm s3://your-app-dev/ \
     --recursive \
     --exclude "*" \
     --include "*.map" \
     --include "*.tmp"
   
   # Remove old invalidations (they count towards free tier limits)
   aws cloudfront list-invalidations \
     --distribution-id YOUR_DISTRIBUTION_ID | \
     grep -B2 Completed | grep Id | cut -d'"' -f4 | \
     while read -r id; do
       aws cloudfront delete-invalidation \
         --distribution-id YOUR_DISTRIBUTION_ID \
         --id "$id"
     done
   ```

## Security Configuration

1. **Enable Bucket Encryption**
   ```bash
   aws s3api put-bucket-encryption \
     --bucket your-app-dev \
     --server-side-encryption-configuration '{
       "Rules": [
         {
           "ApplyServerSideEncryptionByDefault": {
             "SSEAlgorithm": "AES256"
           }
         }
       ]
     }'
   ```

2. **Enable Access Logging**
   ```bash
   # Create logging bucket
   aws s3 mb s3://your-app-logs

   # Enable logging
   aws s3api put-bucket-logging \
     --bucket your-app-dev \
     --bucket-logging-status '{
       "LoggingEnabled": {
         "TargetBucket": "your-app-logs",
         "TargetPrefix": "dev/"
       }
     }'
   ```

## Deployment Configuration

### Environment Variables

1. **AWS Credentials**
   ```bash
   # Set up AWS credentials
   aws configure set aws_access_key_id YOUR_ACCESS_KEY
   aws configure set aws_secret_access_key YOUR_SECRET_KEY
   aws configure set default.region us-east-1
   ```

2. **GitLab CI/CD Variables**
   ```bash
   # Set these in GitLab CI/CD settings
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_DEFAULT_REGION=us-east-1
   AWS_S3_BUCKET_DEV=your-app-dev
   AWS_S3_BUCKET_TEST=your-app-test
   AWS_S3_BUCKET_PROD=your-app-prod
   AWS_CLOUDFRONT_ID_DEV=your_dev_distribution_id
   AWS_CLOUDFRONT_ID_TEST=your_test_distribution_id
   AWS_CLOUDFRONT_ID_PROD=your_prod_distribution_id
   ```

### Deployment Scripts

1. **Manual Deployment**
   ```bash
   #!/bin/bash
   # deploy.sh
   
   ENVIRONMENT=$1
   BUCKET_NAME="your-app-${ENVIRONMENT}"
   DISTRIBUTION_ID="your_${ENVIRONMENT}_distribution_id"
   
   # Build application
   npm run build
   
   # Sync with S3
   aws s3 sync dist/ s3://${BUCKET_NAME} \
     --delete \
     --cache-control "max-age=31536000"
   
   # Invalidate CloudFront cache
   aws cloudfront create-invalidation \
     --distribution-id ${DISTRIBUTION_ID} \
     --paths "/*"
   ```

2. **Rollback Script**
   ```bash
   #!/bin/bash
   # rollback.sh
   
   ENVIRONMENT=$1
   VERSION=$2
   BUCKET_NAME="your-app-${ENVIRONMENT}"
   DISTRIBUTION_ID="your_${ENVIRONMENT}_distribution_id"
   
   # Restore previous version
   aws s3 sync s3://${BUCKET_NAME}-backup-${VERSION}/ s3://${BUCKET_NAME} \
     --delete
   
   # Invalidate CloudFront cache
   aws cloudfront create-invalidation \
     --distribution-id ${DISTRIBUTION_ID} \
     --paths "/*"
   ```

## Monitoring Setup

### CloudWatch Alarms

1. **S3 Metrics**
   ```bash
   # Create alarm for 4XX errors
   aws cloudwatch put-metric-alarm \
     --alarm-name "S3-4XX-Errors" \
     --metric-name "4xxError" \
     --namespace "AWS/S3" \
     --statistic "Sum" \
     --period 300 \
     --threshold 10 \
     --comparison-operator "GreaterThanThreshold" \
     --evaluation-periods 1 \
     --alarm-actions "arn:aws:sns:region:account-id:topic-name"
   ```

2. **CloudFront Metrics**
   ```bash
   # Create alarm for error rate
   aws cloudwatch put-metric-alarm \
     --alarm-name "CloudFront-Error-Rate" \
     --metric-name "TotalErrorRate" \
     --namespace "AWS/CloudFront" \
     --statistic "Average" \
     --period 300 \
     --threshold 5 \
     --comparison-operator "GreaterThanThreshold" \
     --evaluation-periods 1 \
     --alarm-actions "arn:aws:sns:region:account-id:topic-name"
   ```

### Logging

1. **Enable CloudFront Logging**
   ```bash
   # Update distribution config to enable logging
   aws cloudfront update-distribution \
     --id YOUR_DISTRIBUTION_ID \
     --distribution-config file://cloudfront-config.json
   ```

2. **Log Analysis**
   ```bash
   # Parse CloudFront logs
   aws s3 sync s3://your-app-logs/cloudfront/ ./logs/
   ```

## Cost Optimization

1. **S3 Lifecycle Rules**
   ```bash
   # Configure lifecycle rules
   aws s3api put-bucket-lifecycle-configuration \
     --bucket your-app-logs \
     --lifecycle-configuration file://lifecycle.json
   ```

2. **CloudFront Price Class**
   ```bash
   # Update price class
   aws cloudfront update-distribution \
     --id YOUR_DISTRIBUTION_ID \
     --price-class PriceClass_100
   ```

## Troubleshooting

### Common Issues

1. **S3 Access Denied**
   ```bash
   # Check bucket policy
   aws s3api get-bucket-policy --bucket your-app-dev
   
   # Check bucket ACL
   aws s3api get-bucket-acl --bucket your-app-dev
   ```

2. **CloudFront Cache**
   ```bash
   # List invalidations
   aws cloudfront list-invalidations \
     --distribution-id YOUR_DISTRIBUTION_ID
   
   # Check distribution status
   aws cloudfront get-distribution \
     --id YOUR_DISTRIBUTION_ID
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   aws acm describe-certificate \
     --certificate-arn YOUR_CERTIFICATE_ARN
   ```

### Debugging Tools

1. **CloudWatch Logs Insights**
   ```bash
   # Query logs
   aws logs start-query \
     --log-group-name "your-log-group" \
     --start-time $(date -d '1 hour ago' +%s) \
     --end-time $(date +%s) \
     --query-string 'fields @timestamp, @message | filter @message like /error/'
   ```

2. **CloudFront Functions**
   ```bash
   # Test function
   aws cloudfront test-function \
     --name your-function-name \
     --if-match ETAG \
     --event-object file://test-event.json
   ```

### Health Checks

1. **Configure Health Check**
   ```bash
   # Create Route 53 health check
   aws route53 create-health-check \
     --caller-reference $(date +%s) \
     --health-check-config file://health-check.json
   ```

2. **Monitor Health Check**
   ```bash
   # Get health check status
   aws route53 get-health-check-status \
     --health-check-id YOUR_HEALTH_CHECK_ID
   ```

## Backup and Disaster Recovery (Free Tier Compatible)

### Backup Strategy

1. **S3 Versioning (Free)**
   ```bash
   # Enable versioning on your bucket
   aws s3api put-bucket-versioning \
     --bucket your-app-dev \
     --versioning-configuration Status=Enabled
   ```

2. **Deployment Backups (Free)**
   ```bash
   #!/bin/bash
   # backup-before-deploy.sh
   
   ENVIRONMENT=$1
   TIMESTAMP=$(date +%Y%m%d_%H%M%S)
   BUCKET_NAME="your-app-${ENVIRONMENT}"
   
   # Create backup before deployment
   aws s3 sync s3://${BUCKET_NAME}/ s3://${BUCKET_NAME}/backups/${TIMESTAMP}/ \
     --quiet
   
   # Keep only last 5 backups (to stay within free tier limits)
   aws s3 ls s3://${BUCKET_NAME}/backups/ | sort -r | tail -n +6 | \
     while read -r line; do
       folder=$(echo "$line" | awk '{print $2}')
       aws s3 rm s3://${BUCKET_NAME}/backups/${folder} --recursive
     done
   ```

### Disaster Recovery Plan

1. **Configuration Backup (Free)**
   ```bash
   #!/bin/bash
   # backup-config.sh
   
   # Backup CloudFront configuration
   aws cloudfront get-distribution-config \
     --id YOUR_DISTRIBUTION_ID > cloudfront-config-backup.json
   
   # Backup bucket policies
   aws s3api get-bucket-policy \
     --bucket your-app-dev > bucket-policy-backup.json
   
   # Backup CORS configuration
   aws s3api get-bucket-cors \
     --bucket your-app-dev > cors-config-backup.json
   ```

2. **Recovery Procedures**

   a. **Application Recovery (Free)**
   ```bash
   #!/bin/bash
   # recover-app.sh
   
   ENVIRONMENT=$1
   BACKUP_TIMESTAMP=$2
   BUCKET_NAME="your-app-${ENVIRONMENT}"
   
   # Restore from backup
   aws s3 sync s3://${BUCKET_NAME}/backups/${BACKUP_TIMESTAMP}/ s3://${BUCKET_NAME}/ \
     --delete
   
   # Invalidate CloudFront cache
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

   b. **Infrastructure Recovery (Free)**
   ```bash
   #!/bin/bash
   # recover-infrastructure.sh
   
   # Recreate bucket if lost
   aws s3 mb s3://your-app-dev
   
   # Restore bucket policy
   aws s3api put-bucket-policy \
     --bucket your-app-dev \
     --policy file://bucket-policy-backup.json
   
   # Restore CORS configuration
   aws s3api put-bucket-cors \
     --bucket your-app-dev \
     --cors-configuration file://cors-config-backup.json
   ```

### Free Tier Considerations

1. **Storage Management**
   ```bash
   # Monitor S3 usage (stay within free tier - 5GB)
   aws s3 ls s3://your-app-dev --recursive --human-readable --summarize
   
   # Clean up old backups
   aws s3 rm s3://your-app-dev/backups/ \
     --recursive \
     --exclude "*" \
     --include "*/2023*/*" # Adjust date as needed
   ```

2. **Cost Prevention**
   ```bash
   # Set up billing alarm (free)
   aws cloudwatch put-metric-alarm \
     --alarm-name "BillingAlert" \
     --alarm-description "Billing amount exceeded" \
     --metric-name "EstimatedCharges" \
     --namespace "AWS/Billing" \
     --statistic Maximum \
     --period 21600 \
     --threshold 1 \
     --comparison-operator GreaterThanThreshold \
     --evaluation-periods 1 \
     --alarm-actions "arn:aws:sns:region:account-id:topic-name" \
     --dimensions Name=Currency,Value=USD
   ```

### Emergency Response Plan

1. **Quick Response Actions (Free)**
   ```bash
   # Block all public access in case of security incident
   aws s3api put-public-access-block \
     --bucket your-app-dev \
     --public-access-block-configuration \
       "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
   
   # Disable CloudFront distribution temporarily
   aws cloudfront get-distribution-config --id YOUR_DISTRIBUTION_ID > temp.json
   # Edit temp.json to set Enabled: false
   aws cloudfront update-distribution --id YOUR_DISTRIBUTION_ID --distribution-config file://temp.json
   ```

2. **Recovery Checklist**
   - [ ] Assess incident impact
   - [ ] Restore from last known good backup
   - [ ] Verify application functionality
   - [ ] Review security configurations
   - [ ] Update DNS if needed (Route 53)
   - [ ] Test application endpoints
   - [ ] Monitor for any issues

### Regular Testing (Free)

1. **Monthly Tests**
   ```bash
   #!/bin/bash
   # test-recovery.sh
   
   # Test backup restoration
   TEST_TIMESTAMP=$(aws s3 ls s3://your-app-dev/backups/ | sort -r | head -n 1 | awk '{print $2}' | tr -d /)
   
   # Create test bucket
   aws s3 mb s3://your-app-dev-test
   
   # Restore backup to test bucket
   aws s3 sync s3://your-app-dev/backups/${TEST_TIMESTAMP}/ s3://your-app-dev-test/
   
   # Verify files
   aws s3 ls s3://your-app-dev-test --recursive --summarize
   
   # Clean up test bucket
   aws s3 rb s3://your-app-dev-test --force
   ```

2. **Documentation**
   - Keep recovery procedures updated
   - Document all configuration changes
   - Maintain contact list for emergencies
   - Record recovery test results 