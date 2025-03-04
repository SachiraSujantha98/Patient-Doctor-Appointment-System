import { useCallback } from 'react';
import { useFormik, FormikConfig } from 'formik';
import { useLoading } from './useLoading';
import { useNotification } from './useNotification';

interface UseFormProps<T> extends Omit<FormikConfig<T>, 'onSubmit'> {
  onSubmit: (values: T) => Promise<boolean>;
  successMessage?: string;
}

export const useForm = <T extends object>({
  onSubmit,
  successMessage = 'Operation completed successfully',
  ...formikConfig
}: UseFormProps<T>) => {
  const { isLoading, withLoading } = useLoading();
  const { showNotification } = useNotification();

  const handleSubmit = useCallback(
    async (values: T) => {
      try {
        const success = await withLoading(async () => onSubmit(values));
        if (success) {
          showNotification(successMessage);
        }
      } catch (error) {
        showNotification(
          error instanceof Error ? error.message : 'An error occurred',
          'error'
        );
      }
    },
    [onSubmit, successMessage, withLoading, showNotification]
  );

  const formik = useFormik({
    ...formikConfig,
    onSubmit: handleSubmit,
  });

  return {
    formik,
    isLoading,
  };
}; 