import { AxiosResponse } from 'axios';
import api from './api';
import { config } from '../config/env.config';
import { User } from '../types';

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
  emailNotifications: boolean;
}

class UserService {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response: AxiosResponse<User> = await api.patch(
      `${config.apiEndpoints.users.update}`,
      data
    );
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await api.get(
      `${config.apiEndpoints.users.profile}`
    );
    return response.data;
  }
}

export const userService = new UserService(); 