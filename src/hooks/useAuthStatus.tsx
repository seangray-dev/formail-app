import { useConvexAuth } from "convex/react";

function useAuthStatus() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return {
    isAuthLoading: isLoading,
    isUserAuthenticated: isAuthenticated,
  };
}

export default useAuthStatus;
