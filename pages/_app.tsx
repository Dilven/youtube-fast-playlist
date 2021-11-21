import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { defaultOptions } from "config/cache";
import { ReactQueryDevtools } from "react-query/devtools";
import { MantineProvider } from "@mantine/styles";

const queryClient = new QueryClient({ defaultOptions });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={{ loader: "bars" }}>
        <Component {...pageProps} />;
        <ReactQueryDevtools initialIsOpen={false} />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
