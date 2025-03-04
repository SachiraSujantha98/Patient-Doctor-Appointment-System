import { AxiosResponse } from 'axios';
import api from './api';
import { config } from '../config/env.config';
import { Appointment, PaginatedResponse } from '../types';

interface CreateAppointmentDto {
  doctorId: string;
  categoryId: string;
}

interface UpdateAppointmentDto {
  appointmentDate: string;
  status: 'accepted' | 'completed' | 'cancelled';
}

interface AddPrescriptionDto {
  prescription: string;
}

class AppointmentService {
  async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await api.post(
      config.apiEndpoints.appointments.create,
      data
    );
    return response.data;
  }

  async getAppointments(page = 1, limit = 10): Promise<PaginatedResponse<Appointment>> {
    const response: AxiosResponse<PaginatedResponse<Appointment>> = await api.get(
      config.apiEndpoints.appointments.list,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  async updateAppointment(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await api.patch(
      config.apiEndpoints.appointments.update(id),
      data
    );
    return response.data;
  }

  async addPrescription(id: string, data: AddPrescriptionDto): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await api.post(
      config.apiEndpoints.appointments.addPrescription(id),
      data
    );
    return response.data;
  }
}

export const appointmentService = new AppointmentService(); 