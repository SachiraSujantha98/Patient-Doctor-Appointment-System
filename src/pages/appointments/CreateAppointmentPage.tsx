import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useForm } from '../../hooks/useForm';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useApi } from '../../hooks/useApi';
import { useAppointments } from '../../hooks/useAppointments';
import { Doctor, Category } from '../../types';
import { doctorService } from '../../services/doctor.service';
import { categoryService } from '../../services/category.service';

interface CreateAppointmentFormData {
  doctorId: string;
  categoryId: string;
}

export const CreateAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { appointmentSchema } = useFormValidation();
  const { createAppointment } = useAppointments();
  const { request } = useApi();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, categoriesData] = await Promise.all([
          request(() => doctorService.getAvailableDoctors()),
          request(() => categoryService.getCategories()),
        ]);
        setDoctors(doctorsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [request]);

  const { formik, isLoading } = useForm<CreateAppointmentFormData>({
    initialValues: {
      doctorId: '',
      categoryId: '',
    },
    validationSchema: appointmentSchema,
    onSubmit: async (values) => {
      const success = await createAppointment(values);
      if (success) {
        navigate('/appointments');
      }
    },
  });

  return (
    <Container maxWidth="md">
      <LoadingOverlay open={isLoading} />
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Book New Appointment
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="categoryId"
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}>
                <InputLabel id="doctor-label">Doctor</InputLabel>
                <Select
                  labelId="doctor-label"
                  id="doctorId"
                  name="doctorId"
                  value={formik.values.doctorId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Doctor"
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.lastName} - {doctor.specialization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => navigate(-1)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              Book Appointment
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}; 