import Link from 'next/link';

export default function MealPlansPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
          </svg>
        </div>
        <span style={styles.badge}>Coming Soon</span>
        <h1 style={styles.title}>Meal Plans</h1>
        <p style={styles.description}>
          Create and manage personalized weekly meal plans. Organize your breakfast, lunch,
          and dinner around your chosen diet with automatic grocery lists.
        </p>
        <div style={styles.featureList}>
          <div style={styles.featureItem}>
            <span style={styles.featureDot} />
            Weekly calendar with drag-and-drop meals
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureDot} />
            Auto-generated shopping lists
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureDot} />
            Calorie & macro tracking per day
          </div>
        </div>
        <Link href="/" style={styles.backLink}>Back to Home</Link>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: 'calc(100vh - 100px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    margin: -16,
    padding: 20,
  },
  card: {
    maxWidth: 480,
    width: '100%',
    textAlign: 'center',
    padding: '48px 32px',
    backgroundColor: '#1f2937',
    borderRadius: 24,
    border: '1px solid #374151',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: '50%',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: '#f59e0b',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
  },
  title: {
    margin: '0 0 12px',
    fontSize: 28,
    fontWeight: 700,
    color: 'white',
  },
  description: {
    margin: '0 0 24px',
    fontSize: 15,
    lineHeight: 1.6,
    color: '#9ca3af',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 32,
    textAlign: 'left',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 14,
    color: '#d1d5db',
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#f59e0b',
    flexShrink: 0,
  },
  backLink: {
    display: 'inline-block',
    padding: '12px 32px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    borderRadius: 12,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  },
};
