import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNotification } from './useNotification';
import { userService } from '../services/user.service';
import { User } from '../types';
import { useMemo } from 'react';
import { useLoading } from './useLoading';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
  emailNotifications: boolean;
}

export const useProfileForm = (user: User | null) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const { withLoading, isLoading } = useLoading();

  const validationSchema = useMemo(() => 
    yup.object({
      firstName: yup.string().required(t('validation.required')),
      lastName: yup.string().required(t('validation.required')),
      email: yup.string().email(t('validation.email')).required(t('validation.required')),
      specialization: yup.string().when('role', {
        is: 'doctor',
        then: (schema) => schema.required(t('validation.required')),
      }),
      emailNotifications: yup.boolean(),
    }),
    [t]
  );

  const formik = useFormik<ProfileFormData>({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      specialization: user?.specialization,
      emailNotifications: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await withLoading(async () => {
          await userService.updateProfile(values);
          showNotification(t('profile.updateSuccess'), 'success');
        });
      } catch (error) {
        showNotification(t('profile.updateError'), 'error');
      }
    },
  });

  return {
    ...formik,
    isLoading,
  };
}; 