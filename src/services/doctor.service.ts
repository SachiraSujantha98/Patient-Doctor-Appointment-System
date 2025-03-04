import { AxiosResponse } from 'axios';
import api from './api';
import { config } from '../config/env.config';
import { Doctor, PaginatedResponse } from '../types';

class DoctorService {
  async getDoctors(page = 1, limit = 10): Promise<PaginatedResponse<Doctor>> {
    const response: AxiosResponse<PaginatedResponse<Doctor>> = await api.get(
      config.apiEndpoints.doctors.list,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  async getAvailableDoctors(): Promise<Doctor[]> {
    const response: AxiosResponse<Doctor[]> = await api.get(
      `${config.apiEndpoints.doctors.list}/available`
    );
    return response.data;
  }
}

export const doctorService = new DoctorService(); 