type Success<T> = {
  data: T;
  error: null;
};

type Failure<E extends Error> = {
  data: null;
  error: E;
};

type Result<T, E extends Error = Error> = Success<T> | Failure<E>;

export default async function tryCatch<T, E extends Error = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: (error instanceof Error ? error : new Error(String(error))) as E,
    };
  }
}
