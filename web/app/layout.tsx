import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bring the Diet',
  description: 'Food nutrition and diet platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
