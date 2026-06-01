import "./globals.css";

export const metadata = {
  title: "Notely - Modern Notes App",
  description:
    "A minimal, blazing-fast notes app. Capture ideas, organize your thoughts, and never lose an important thought again.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}