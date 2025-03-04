import { GridProps } from '@mui/material';
import { UserRole, ProfileFormData } from '../../../types';

export interface FormFieldConfig {
  id: string;
  name: string;
  type: 'text' | 'email' | 'select';
  translationKey: string;
  gridProps: Partial<GridProps>;
  showWhen?: (values: ProfileFormData) => boolean;
}

export const formFields: FormFieldConfig[] = [
  {
    id: 'firstName',
    name: 'firstName',
    type: 'text',
    translationKey: 'profile.form.firstName',
    gridProps: { xs: 12, sm: 6 },
  },
  {
    id: 'lastName',
    name: 'lastName',
    type: 'text',
    translationKey: 'profile.form.lastName',
    gridProps: { xs: 12, sm: 6 },
  },
  {
    id: 'email',
    name: 'email',
    type: 'email',
    translationKey: 'profile.form.email',
    gridProps: { xs: 12 },
  },
  {
    id: 'specialization',
    name: 'specialization',
    type: 'text',
    translationKey: 'profile.form.specialization',
    gridProps: { xs: 12 },
    showWhen: (values) => values.role === UserRole.DOCTOR,
  },
]; 