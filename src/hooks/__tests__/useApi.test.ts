import { renderHook, act } from '@testing-library/react';
import { useApi } from '../useApi';

describe('useApi', () => {
  const mockData1 = { id: 1, name: 'Test 1' };
  const mockData2 = { id: 2, name: 'Test 2' };
  const mockApi = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should cache successful responses', async () => {
    mockApi.mockResolvedValueOnce(mockData1);
    mockApi.mockResolvedValueOnce(mockData2);

    const { result } = renderHook(() => useApi());

    let response;
    await act(async () => {
      response = await result.current.request(mockApi, { cacheKey: 'test' });
    });

    expect(response).toEqual(mockData1);
    expect(mockApi).toHaveBeenCalledTimes(1);

    // Second call should return cached response
    await act(async () => {
      response = await result.current.request(mockApi, { cacheKey: 'test' });
    });

    expect(response).toEqual(mockData1);
    expect(mockApi).toHaveBeenCalledTimes(1);
  });

  it('should deduplicate concurrent requests', async () => {
    // Reset mock and set up a single resolved value
    mockApi.mockReset();
    mockApi.mockResolvedValue(mockData1);

    const { result } = renderHook(() => useApi());

    let response1, response2;
    await act(async () => {
      [response1, response2] = await Promise.all([
        result.current.request(mockApi, { cacheKey: 'test' }),
        result.current.request(mockApi, { cacheKey: 'test' })
      ]);
    });

    expect(response1).toEqual(mockData1);
    expect(response2).toEqual(mockData1);
    expect(mockApi).toHaveBeenCalledTimes(1);
  }, 10000);

  it('should invalidate cache when specified', async () => {
    mockApi.mockReset();
    mockApi.mockResolvedValueOnce(mockData1);
    mockApi.mockResolvedValueOnce(mockData2);

    const { result } = renderHook(() => useApi());

    let response;
    await act(async () => {
      response = await result.current.request(mockApi, { 
        cacheKey: 'test',
        invalidateCache: true 
      });
    });

    expect(response).toEqual(mockData1);
    expect(mockApi).toHaveBeenCalledTimes(1);

    await act(async () => {
      response = await result.current.request(mockApi, { 
        cacheKey: 'test',
        invalidateCache: true 
      });
    });

    expect(response).toEqual(mockData2);
    expect(mockApi).toHaveBeenCalledTimes(2);
  });

  it('should clear cache when clearCache is called', async () => {
    mockApi.mockReset();
    mockApi.mockResolvedValueOnce(mockData1);
    mockApi.mockResolvedValueOnce(mockData2);

    const { result } = renderHook(() => useApi());

    let response;
    await act(async () => {
      response = await result.current.request(mockApi, { cacheKey: 'test' });
    });

    expect(response).toEqual(mockData1);
    expect(mockApi).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.clearCache();
    });

    await act(async () => {
      response = await result.current.request(mockApi, { cacheKey: 'test' });
    });

    expect(response).toEqual(mockData2);
    expect(mockApi).toHaveBeenCalledTimes(2);
  });

  it('should expire cache after specified time', async () => {
    mockApi.mockReset();
    mockApi.mockResolvedValueOnce(mockData1);
    mockApi.mockResolvedValueOnce(mockData2);

    const { result } = renderHook(() => useApi());

    let response;
    await act(async () => {
      response = await result.current.request(mockApi, { 
        cacheKey: 'test',
        cacheTime: 1000 // 1 second
      });
    });

    expect(response).toEqual(mockData1);
    expect(mockApi).toHaveBeenCalledTimes(1);

    // Advance time by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await act(async () => {
      response = await result.current.request(mockApi, { 
        cacheKey: 'test',
        cacheTime: 1000
      });
    });

    expect(response).toEqual(mockData2);
    expect(mockApi).toHaveBeenCalledTimes(2);
  });
}); 