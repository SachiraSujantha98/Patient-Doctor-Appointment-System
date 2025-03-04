import { authService } from '../auth.service';
import api from '../api';
import { storage } from '../../utils/storage';

jest.mock('../api');
jest.mock('../../utils/storage');

describe('AuthService', () => {
  const mockToken = 'mock-token';
  const mockRefreshToken = 'mock-refresh-token';
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'patient' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (storage.get as jest.Mock).mockImplementation((key) => {
      switch (key) {
        case 'auth_token':
          return mockToken;
        case 'refresh_token':
          return mockRefreshToken;
        case 'auth_token_expiry':
          return Date.now() + 3600000; // 1 hour from now
        default:
          return null;
      }
    });
  });

  describe('login', () => {
    it('should store tokens and return auth response', async () => {
      const mockResponse = {
        data: {
          token: mockToken,
          refreshToken: mockRefreshToken,
          expiresIn: 3600,
          user: mockUser,
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual(mockResponse.data);
      expect(storage.set).toHaveBeenCalledWith('auth_token', mockToken);
      expect(storage.set).toHaveBeenCalledWith('refresh_token', mockRefreshToken);
      expect(storage.set).toHaveBeenCalledWith(expect.any(String), expect.any(Number));
    });
  });

  describe('refreshToken', () => {
    it('should refresh token when current token is about to expire', async () => {
      const newToken = 'new-token';
      const newRefreshToken = 'new-refresh-token';
      
      (storage.get as jest.Mock).mockImplementationOnce(() => mockToken)
        .mockImplementationOnce(() => Date.now() - 30000); // Token expired 30 seconds ago

      (api.post as jest.Mock).mockResolvedValueOnce({
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
          expiresIn: 3600,
        },
      });

      const result = await authService.getValidToken();

      expect(result).toBe(newToken);
      expect(storage.set).toHaveBeenCalledWith('auth_token', newToken);
      expect(storage.set).toHaveBeenCalledWith('refresh_token', newRefreshToken);
    });

    it('should handle refresh token failure', async () => {
      (storage.get as jest.Mock).mockImplementationOnce(() => mockToken)
        .mockImplementationOnce(() => Date.now() - 30000); // Token expired 30 seconds ago

      (api.post as jest.Mock).mockRejectedValueOnce(new Error('Refresh failed'));

      const result = await authService.getValidToken();

      expect(result).toBeNull();
      expect(storage.remove).toHaveBeenCalledWith('auth_token');
      expect(storage.remove).toHaveBeenCalledWith('refresh_token');
      expect(storage.remove).toHaveBeenCalledWith('auth_token_expiry');
    });

    it('should deduplicate concurrent refresh token requests', async () => {
      const newToken = 'new-token';
      (storage.get as jest.Mock).mockImplementation(() => Date.now() - 30000); // Token always expired

      (api.post as jest.Mock).mockResolvedValueOnce({
        data: {
          token: newToken,
          refreshToken: 'new-refresh-token',
          expiresIn: 3600,
        },
      });

      const [result1, result2] = await Promise.all([
        authService.getValidToken(),
        authService.getValidToken(),
      ]);

      expect(result1).toBe(newToken);
      expect(result2).toBe(newToken);
      expect(api.post).toHaveBeenCalledTimes(1); // Only one refresh request
    });
  });

  describe('logout', () => {
    it('should remove all auth data from storage', () => {
      authService.logout();

      expect(storage.remove).toHaveBeenCalledWith('auth_token');
      expect(storage.remove).toHaveBeenCalledWith('refresh_token');
      expect(storage.remove).toHaveBeenCalledWith('auth_token_expiry');
    });
  });
}); 