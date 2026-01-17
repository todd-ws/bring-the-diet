import type { Metadata } from 'next';
import { SideNav } from '../components/SideNav';

export const metadata: Metadata = {
  title: 'Nutri Admin',
  description: 'Admin console for Bring the Diet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <SideNav />
          <main style={{ flex: 1, padding: 16 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
