import "tailwindcss/tailwind.css";
import Head from "next/head";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <div className="App">
        <Head>
          <title>Kythi</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Made with ❤️ by Neko" />
        </Head>

        <Component {...pageProps} />
      </div>
  );
}

export default MyApp;
