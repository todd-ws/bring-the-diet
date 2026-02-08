import { TabNav } from '../../components/TabNav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TabNav />
      <main style={{ padding: 16 }}>
        {children}
      </main>
    </>
  );
}
