import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import RouteLayout from "./components/RouteLayout";
import ThemeProvider from "./components/common/ThemeProvider";
import ToastProvider from "./components/ToastProvider";

const themeScript = `
(function() {
  try {
    var storedTheme = window.localStorage.getItem('warehouse-theme');
    var theme = storedTheme === 'dark' || storedTheme === 'light'
      ? storedTheme
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (error) {}
})();
`;

export const metadata: Metadata = {
  title: "Warehouse OS",
  description: "Warehouse OS for small-team inventory operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider />
            <RouteLayout>{children}</RouteLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
