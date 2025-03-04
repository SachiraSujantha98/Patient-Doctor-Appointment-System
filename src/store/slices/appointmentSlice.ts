import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Appointment, PaginatedResponse, ApiError } from '../../types';
import { appointmentService } from '../../services/appointment.service';

interface AppointmentState {
  appointments: Appointment[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  total: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointments(page, limit);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (data: { doctorId: string; categoryId: string }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.createAppointment(data);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create appointment');
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async (
    data: {
      id: string;
      appointmentDate: string;
      status: 'accepted' | 'completed' | 'cancelled';
    },
    { rejectWithValue }
  ) => {
    try {
      const { id, ...updateData } = data;
      const response = await appointmentService.updateAppointment(id, updateData);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update appointment');
    }
  }
);

export const addPrescription = createAsyncThunk(
  'appointments/addPrescription',
  async (data: { id: string; prescription: string }, { rejectWithValue }) => {
    try {
      const { id, prescription } = data;
      const response = await appointmentService.addPrescription(id, { prescription });
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to add prescription');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAppointments.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Appointment>>) => {
          state.loading = false;
          state.appointments = action.payload.data;
          state.total = action.payload.total;
          state.currentPage = action.payload.page;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        state.appointments.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        const index = state.appointments.findIndex((app) => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Prescription
      .addCase(addPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPrescription.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        const index = state.appointments.findIndex((app) => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(addPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer; 