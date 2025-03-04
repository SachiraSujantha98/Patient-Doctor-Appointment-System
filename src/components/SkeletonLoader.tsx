import React from 'react';
import { Skeleton, Box, Card, CardContent, Grid } from '@mui/material';

interface SkeletonLoaderProps {
  type: 'table' | 'card' | 'profile' | 'form';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  const renderTableSkeleton = () => (
    <Box sx={{ width: '100%' }}>
      <Skeleton height={52} data-testid="skeleton" /> {/* Header */}
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} height={52} data-testid="skeleton" />
      ))}
    </Box>
  );

  const renderCardSkeleton = () => (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Skeleton variant="rectangular" height={140} data-testid="skeleton" />
              <Skeleton height={32} sx={{ mt: 2 }} data-testid="skeleton" />
              <Skeleton height={20} width="60%" data-testid="skeleton" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderProfileSkeleton = () => (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="circular" width={100} height={100} sx={{ mr: 2 }} data-testid="skeleton" />
        <Box sx={{ width: '100%' }}>
          <Skeleton height={32} width="40%" data-testid="skeleton" />
          <Skeleton height={20} width="30%" data-testid="skeleton" />
        </Box>
      </Box>
      <Skeleton height={60} data-testid="skeleton" />
      <Skeleton height={60} data-testid="skeleton" />
      <Skeleton height={60} data-testid="skeleton" />
    </Box>
  );

  const renderFormSkeleton = () => (
    <Box sx={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} height={68} sx={{ mb: 2 }} data-testid="skeleton" />
      ))}
    </Box>
  );

  switch (type) {
    case 'table':
      return renderTableSkeleton();
    case 'card':
      return renderCardSkeleton();
    case 'profile':
      return renderProfileSkeleton();
    case 'form':
      return renderFormSkeleton();
    default:
      return null;
  }
}; 