import { DefaultOptions } from "react-query";

export const defaultOptions: DefaultOptions = {
  queries: {
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  },
  mutations: {
    retry: 1,
  },
};
