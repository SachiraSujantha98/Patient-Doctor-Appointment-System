# Patient-Doctor Appointment System Frontend

A modern React application for managing patient-doctor appointments, built with React, TypeScript, and Vite.

## Features

- User authentication (JWT and Google OAuth)
- Role-based access control (Patient/Doctor)
- Appointment management
- Real-time notifications
- Responsive design
- Multi-language support
- Theme customization
- Comprehensive test coverage

## Tech Stack

- React 18+
- TypeScript
- Vite
- React Query for data fetching
- React Router for routing
- Material-UI for components
- i18next for internationalization
- Jest and React Testing Library for testing
- ESLint for code quality

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend service running (see backend README)

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the environment variables:
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
├── config/         # Configuration files
├── contexts/       # React contexts
├── features/       # Feature-specific code
├── hooks/          # Custom hooks
├── i18n/           # Internationalization
├── layouts/        # Layout components
├── pages/          # Page components
├── providers/      # Context providers
├── services/       # API services
├── store/          # Global state management
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Features in Detail

### Authentication
- JWT-based authentication
- Google OAuth integration
- Automatic token refresh
- Persistent sessions

### Appointment Management
- Create appointments
- View and manage appointments
- Filter by status and category
- Add prescriptions

### Doctor Features
- View patient appointments
- Accept/reject appointments
- Add prescriptions
- Manage availability

### Patient Features
- Search for doctors
- Book appointments
- View appointment history
- Receive notifications

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Code Quality

- ESLint configuration for TypeScript and React
- Prettier for consistent code formatting
- Husky for pre-commit hooks
- GitLab CI/CD integration

## Contributing

1. Create a feature branch from `dev`
2. Make your changes
3. Write/update tests
4. Create a merge request to `dev`
5. Get approval from code owners
6. Merge your changes

## Deployment

### Prerequisites
- AWS Account with configured S3 and CloudFront
- GitLab CI/CD variables configured:
  ```
  AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY
  AWS_DEFAULT_REGION
  AWS_S3_BUCKET_DEV
  AWS_S3_BUCKET_TEST
  AWS_S3_BUCKET_PROD
  AWS_CLOUDFRONT_ID_DEV
  AWS_CLOUDFRONT_ID_TEST
  AWS_CLOUDFRONT_ID_PROD
  MONITORING_WEBHOOK
  ```

### Environment Setup
1. Create S3 buckets for each environment:
   ```bash
   aws s3 mb s3://your-app-dev
   aws s3 mb s3://your-app-test
   aws s3 mb s3://your-app-prod
   ```

2. Configure S3 bucket for static website hosting:
   ```bash
   aws s3 website s3://your-app-dev --index-document index.html --error-document index.html
   ```

3. Create CloudFront distributions:
   - Origin: S3 bucket
   - Behaviors: Redirect HTTP to HTTPS
   - Custom SSL Certificate (recommended)
   - Default root object: index.html

4. Configure DNS with Route 53 (optional):
   - Create A records pointing to CloudFront distributions
   - Set up SSL certificates in ACM

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-app-dev --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### CI/CD Pipeline Stages

1. **Prepare**
   - Install dependencies
   - Cache node_modules

2. **Test**
   - Unit tests
   - Integration tests
   - E2E tests
   - Linting and type checking

3. **Security**
   - npm audit
   - Dependency scanning
   - SAST (Static Application Security Testing)

4. **Build**
   - Environment-specific builds
   - Asset optimization

5. **Deploy**
   - Automatic deployment to dev/test
   - Manual approval for production
   - CloudFront cache invalidation

6. **Monitor**
   - Deployment status notification
   - Performance monitoring

## Troubleshooting Guide

### Build Issues

1. **"Out of Memory" During Build**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

2. **Missing Dependencies**
   ```bash
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```

3. **Type Errors**
   ```bash
   # Check types
   npm run type-check
   
   # Update type definitions
   npm update @types/react @types/react-dom
   ```

### Runtime Issues

1. **API Connection Errors**
   - Check API URL in .env file
   - Verify CORS configuration
   - Check network tab for specific errors

2. **Authentication Issues**
   ```javascript
   // Clear stored tokens
   localStorage.clear();
   // Check token expiration
   const token = localStorage.getItem('token');
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log('Token expires:', new Date(payload.exp * 1000));
   ```

3. **Routing Problems**
   - Ensure CloudFront is configured to redirect to index.html
   - Check browser console for routing errors
   - Verify route definitions

### Deployment Issues

1. **S3 Upload Failures**
   ```bash
   # Check S3 bucket permissions
   aws s3api get-bucket-policy --bucket your-bucket
   
   # Verify AWS credentials
   aws sts get-caller-identity
   ```

2. **CloudFront Issues**
   ```bash
   # Check distribution status
   aws cloudfront get-distribution --id YOUR_DIST_ID
   
   # List invalidations
   aws cloudfront list-invalidations --distribution-id YOUR_DIST_ID
   ```

3. **CI/CD Pipeline Failures**
   - Check GitLab CI/CD variables
   - Verify pipeline permissions
   - Review job logs for specific errors

### Performance Issues

1. **Slow Loading Times**
   - Run Lighthouse audit
   - Check bundle size:
     ```bash
     npm run analyze
     ```
   - Implement code splitting
   - Optimize images and assets

2. **Memory Leaks**
   - Check for unmounted component updates
   - Verify useEffect cleanup functions
   - Monitor browser memory usage

### Common Solutions

1. **Clear Cache and Rebuild**
   ```bash
   # Clear all caches
   npm cache clean --force
   rm -rf node_modules
   rm -rf dist
   
   # Fresh install and build
   npm install
   npm run build
   ```

2. **Update Dependencies**
   ```bash
   # Check outdated packages
   npm outdated
   
   # Update packages
   npm update
   
   # Update to latest versions (careful!)
   npx npm-check-updates -u
   ```

3. **Development Environment Reset**
   ```bash
   # Reset environment
   git clean -fdx
   npm install
   
   # Clear browser data
   # Chrome: chrome://settings/clearBrowserData
   # Firefox: about:preferences#privacy
   ```

## Monitoring and Logging

1. **Error Tracking**
   - Sentry.io integration
   - Custom error boundary implementation
   - Error logging service

2. **Performance Monitoring**
   - Google Analytics
   - Custom performance metrics
   - User behavior tracking

3. **Health Checks**
   - API endpoint monitoring
   - Resource availability
   - Response time tracking

## Support and Resources

- [Frontend Documentation](./docs)
- [API Documentation](http://localhost:4000/api-docs)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Issue Tracker](./issues)
- [Change Log](./CHANGELOG.md)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
