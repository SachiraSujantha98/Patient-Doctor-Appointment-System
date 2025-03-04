import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Card,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useAuth } from '../../hooks/useAuth';
import { withAnalytics } from '../../hocs/withAnalytics';
import { useProfileForm } from '../../hooks/useProfileForm';
import { profileStyles } from './styles/Profile.styles';
import { formFields } from './config/formFields';

const ProfilePageComponent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { formik, isLoading } = useProfileForm(user);

  if (!user) return null;

  return (
    <Container maxWidth="md">
      <LoadingOverlay open={isLoading} />
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('profile.title')}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={profileStyles.profileCard}>
              <Avatar sx={profileStyles.avatar}>
                {user.firstName[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="h6">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {user.email}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={profileStyles.formCard}>
              <form onSubmit={formik.handleSubmit}>
                <Typography variant="h6" gutterBottom>
                  {t('profile.personalInfo')}
                </Typography>
                <Grid container spacing={2}>
                  {formFields.map((field) => {
                    if (field.showWhen && !field.showWhen(user.role)) {
                      return null;
                    }
                    
                    return (
                      <Grid key={field.id} item {...field.gridProps}>
                        <TextField
                          fullWidth
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          label={t(field.translationKey)}
                          value={formik.values[field.name]}
                          onChange={formik.handleChange}
                          error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                          helperText={formik.touched[field.name] && formik.errors[field.name]}
                        />
                      </Grid>
                    );
                  })}
                </Grid>

                <Divider sx={profileStyles.divider} />

                <Typography variant="h6" gutterBottom>
                  {t('profile.preferences')}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={formik.values.emailNotifications}
                      onChange={formik.handleChange}
                    />
                  }
                  label={t('profile.emailNotifications')}
                />

                <Box sx={profileStyles.submitButton}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isLoading}
                  >
                    {t('profile.form.submit')}
                  </LoadingButton>
                </Box>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export const ProfilePage = withAnalytics(ProfilePageComponent, 'Profile'); 