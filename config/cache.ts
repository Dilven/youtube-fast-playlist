import { DefaultOptions } from "react-query";

const THIRTY_MINUTES = 1000 * 60 * 30;

export const defaultOptions: DefaultOptions = {
  queries: {
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: THIRTY_MINUTES,
  },
  mutations: {
    retry: 1,
  },
};
