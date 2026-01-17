import * as React from 'react';

export function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

export function Pill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 999,
        border: '1px solid #e5e7eb',
        fontSize: 12,
      }}
    >
      {label}
    </span>
  );
}
