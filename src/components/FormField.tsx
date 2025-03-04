import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useFormikContext } from 'formik';

type FormFieldProps = {
  name: string;
} & Omit<TextFieldProps, 'name'>;

export const FormField: React.FC<FormFieldProps> = ({ name, ...props }) => {
  const { getFieldProps, getFieldMeta } = useFormikContext();
  const { touched, error } = getFieldMeta(name);
  const fieldProps = getFieldProps(name);

  return (
    <TextField
      {...fieldProps}
      {...props}
      fullWidth
      variant="outlined"
      error={touched && Boolean(error)}
      helperText={touched && error}
    />
  );
}; 