import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Student Management Dashboard</title>
        <meta
          name="description"
          content="A simple and efficient student management dashboard built with Next.js and Firebase. Includes login authentication, student management, and data storage in Firestore."
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
