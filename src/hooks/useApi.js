import { useCallback, useEffect, useState } from 'react';
import { isCancelled } from '../api/benefitsApi';

/**
 * Runs an API call on mount and exposes { data, loading, error, reload }.
 * `request` receives { signal } and must be a stable function (e.g. benefitsApi.getTopics).
 * The request is aborted if the component unmounts.
 */
export function useApi(request) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    request({ signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (!isCancelled(error)) setState({ data: null, loading: false, error });
      });
    return () => controller.abort();
  }, [request, attempt]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, reload };
}
