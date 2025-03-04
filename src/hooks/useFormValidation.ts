import { useCallback } from 'react';
import * as yup from 'yup';

export const useFormValidation = () => {
  const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const registerSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    role: yup.string().oneOf(['patient', 'doctor']).required('Role is required'),
    specialization: yup.string().when('role', {
      is: 'doctor',
      then: (schema) => schema.required('Specialization is required for doctors'),
      otherwise: (schema) => schema.optional(),
    }),
  });

  const appointmentSchema = yup.object().shape({
    doctorId: yup.string().required('Doctor is required'),
    categoryId: yup.string().required('Category is required'),
  });

  const prescriptionSchema = yup.object().shape({
    prescription: yup.string().required('Prescription is required'),
  });

  const validateForm = useCallback(async <T extends object>(
    schema: yup.ObjectSchema<T>,
    data: T
  ): Promise<{ isValid: boolean; errors?: Record<string, string> }> => {
    try {
      await schema.validate(data, { abortEarly: false });
      return { isValid: true };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: 'Validation failed' } };
    }
  }, []);

  return {
    loginSchema,
    registerSchema,
    appointmentSchema,
    prescriptionSchema,
    validateForm,
  };
}; 