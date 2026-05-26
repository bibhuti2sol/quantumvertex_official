export default function Head() {
  return (
    <>
      <title>Quantum Vertex</title>
      <meta name="description" content="Quantum Vertex — NextGen Task Manager" />

      {/* Favicons (SVG primary; browsers may fallback to PNG/ICO if present) */}
      <link rel="icon" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </>
  );
}
