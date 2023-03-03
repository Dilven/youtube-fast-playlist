import { Context, useContext } from "react";

export const useNonNullableContext = <T>(
  providedContext: Context<T | null>
) => {
  const context = useContext(providedContext);
  if (context === null) {
    throw new Error("context must be used within a Provider");
  }
  return context;
};
