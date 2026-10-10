import { useState, useEffect } from 'react';

export interface RemotePaymentConfig {
  is_payment_enabled: boolean;
  mode: 'REVIEW_MODE' | 'LIVE';
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom React Hook for fetching the Remote Payment Feature Flag (Kill Switch).
 * - Fallback Default = false (Review Mode)
 * - Safe error handling: If network or backend fails, defaults to Review Mode (is_payment_enabled = false).
 */
export function usePaymentConfig(): RemotePaymentConfig {
  const [config, setConfig] = useState<RemotePaymentConfig>({
    is_payment_enabled: false, // Default fallback: payments hidden / Review Mode
    mode: 'REVIEW_MODE',
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchRemoteConfig() {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          // Strictly evaluate boolean flag; default to false if absent
          const isEnabled = data && data.is_payment_enabled === true;
          setConfig({
            is_payment_enabled: isEnabled,
            mode: isEnabled ? 'LIVE' : 'REVIEW_MODE',
            isLoading: false,
            error: null,
          });
        }
      } catch (err: any) {
        console.warn('Failed to fetch remote payment config. Falling back to false (Review Mode):', err);
        if (isMounted) {
          setConfig({
            is_payment_enabled: false, // Fallback default = false
            mode: 'REVIEW_MODE',
            isLoading: false,
            error: err?.message || 'Network error',
          });
        }
      }
    }

    fetchRemoteConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return config;
}
