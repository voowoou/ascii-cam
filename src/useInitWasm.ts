import { useEffect, useState } from "preact/hooks";
import init from "src-rust";

export const useInitWasm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    init()
      .then(() => setIsLoading(false))
      .catch((error) => setError(error));
  }, []);

  return { isLoading, error };
};
