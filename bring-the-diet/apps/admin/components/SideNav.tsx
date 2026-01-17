'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV: Array<{ label: string; href: string }> = [
  { label: 'Dashboard', href: '/' },
  { label: 'Recipes', href: '/recipes' },
  { label: 'Foods', href: '/foods' },
  { label: 'Nutrition Facts', href: '/nutrition-facts' },
  { label: 'Diets', href: '/diets' },
  { label: 'Blog Posts', href: '/blog-posts' },
  { label: 'Comments', href: '/comments' },
  { label: 'Users', href: '/users' },
  { label: 'Roles', href: '/roles' }
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside style={{ width: 240, borderRight: '1px solid #e5e7eb', padding: 12 }}>
      <div style={{ fontWeight: 700, padding: '8px 10px', marginBottom: 8 }}>Admin Console</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: 'none',
                padding: '8px 10px',
                borderRadius: 8,
                background: active ? '#111827' : 'transparent',
                color: active ? 'white' : '#111827',
                fontSize: 13,
                fontWeight: active ? 600 : 500
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
