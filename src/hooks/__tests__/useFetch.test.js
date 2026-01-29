import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from '../useFetch';

// Mock fetch
global.fetch = jest.fn();

describe('useFetch Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('returns initial state', () => {
    const { result } = renderHook(() => useFetch(''));
    expect(result.current).toEqual({
      data: null,
      loading: true,
      error: null,
    });
  });

  test('fetches data successfully', async () => {
    const mockData = { message: 'success' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const { result } = renderHook(() => useFetch('https://api.example.com/data'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  test('handles fetch error', async () => {
    const errorMessage = 'Network error';
    fetch.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useFetch('https://api.example.com/data'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(errorMessage);
  });

  test('handles HTTP error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useFetch('https://api.example.com/data'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('HTTP error! status: 404');
  });
});
