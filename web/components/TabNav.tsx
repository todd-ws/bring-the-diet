'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/useAuth';

const TABS: Array<{ label: string; href: string }> = [
  { label: 'Home', href: '/' },
  { label: 'Recipes', href: '/recipes' },
  { label: 'Meal Plans', href: '/meal-plans' },
  { label: 'Diets', href: '/diets' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export function TabNav() {
  const pathname = usePathname();
  const { isAuthenticated, user, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ borderBottom: '1px solid #e5e7eb' }}>
      <style>{`
        .tabnav-links { display: flex; gap: 8px; align-items: center; }
        .tabnav-hamburger { display: none; }
        @media (max-width: 768px) {
          .tabnav-links {
            display: ${menuOpen ? 'flex' : 'none'};
            flex-direction: column;
            width: 100%;
            padding: 8px 0;
            gap: 4px;
          }
          .tabnav-links a {
            width: 100%;
            box-sizing: border-box;
            text-align: center;
          }
          .tabnav-hamburger { display: flex; }
        }
      `}</style>

      {/* Top bar: hamburger + brand + sign in */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 12 }}>
        <button
          type="button"
          className="tabnav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>

        <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>BringThe</span>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAuthenticated && user ? (
            <>
              <Link
                href="/profile"
                style={{
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: pathname === '/profile' ? '1px solid #111827' : '1px solid #e5e7eb',
                  color: pathname === '/profile' ? '#111827' : '#374151',
                  fontWeight: pathname === '/profile' ? 600 : 500,
                  fontSize: 13,
                }}
              >
                {user.name}
              </Link>
              <button
                type="button"
                onClick={logout}
                style={{
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: '1px solid #e5e7eb',
                  background: 'none',
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={login}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                border: '1px solid #2563eb',
                background: '#2563eb',
                color: 'white',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Nav links — horizontal on desktop, dropdown on mobile */}
      <div className="tabnav-links" style={{ padding: '0 16px 10px' }}>
        {TABS.map((t) => {
          const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              onClick={() => setMenuOpen(false)}
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
    </nav>
  );
}
