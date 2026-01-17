import type { Metadata } from 'next';
import { TabNav } from '../components/TabNav';

export const metadata: Metadata = {
  title: 'Bring the Diet',
  description: 'Food nutrition and diet platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <TabNav />
        <main style={{ padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
