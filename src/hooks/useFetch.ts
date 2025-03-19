import { useEffect, useState } from "react";
import tryCatch from "../helpers/tryCatch";

type UseFetchResult<T> = {
  isFetching: boolean;
  data: T;
  error: Error | null;
  setData: React.Dispatch<React.SetStateAction<T>>;
};

export default function useFetch<T>(
  fetchFn: () => Promise<T>,
  initialValue: T
): UseFetchResult<T> {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<T>(initialValue);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const fetchData = async () => {
      setIsFetching(true);
      setError(null); // Reset error state before a new request

      const { data: fetchedData, error } = await tryCatch(fetchFn());

      if (!isMounted) return; // Avoid updating state if unmounted

      if (error) setError(error);
      else setData(fetchedData);

      setIsFetching(false);
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to prevent race conditions
    };
  }, [fetchFn]);

  return { isFetching, data, error, setData };
}
