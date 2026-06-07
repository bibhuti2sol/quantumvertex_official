export default function Head() {
  return (
    <>
      <title>qvs</title>
      <meta name="description" content="qvs" />

      {/* Favicons (SVG primary; browsers may fallback to PNG/ICO if present) */}
      <link rel="icon" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </>
  );
}
