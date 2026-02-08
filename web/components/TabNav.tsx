'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS: Array<{ label: string; href: string }> = [
  { label: 'Home', href: '/' },
  { label: 'Recipes', href: '/recipes' },
  { label: 'Meal Plans', href: '/meal-plans' },
  { label: 'Diets', href: '/diets' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Profile', href: '/profile' },
];

export function TabNav() {
  const pathname = usePathname();

  return (
    <div style={{ borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', gap: 12, padding: '12px 16px', flexWrap: 'wrap' }}>
        {TABS.map((t) => {
          const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              style={{
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: 999,
                border: active ? '1px solid #111827' : '1px solid #e5e7eb',
                color: active ? '#111827' : '#374151',
                fontWeight: active ? 600 : 500,
                fontSize: 13,
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
