import React from "react";
import type { AppProps } from "next/app";
import StaticProvider from "../data/StaticProvider";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StaticProvider>
      <Component {...pageProps} />
    </StaticProvider>
  );
}

export default MyApp;
