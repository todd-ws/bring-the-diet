'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  category: string;
  author: string;
  readTime: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${API_URL}/api/blogposts/slug/${slug}`, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('Not found');
        setPost(await res.json());
      } catch {
        // Fallback placeholder
        const displayTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        setPost({
          id: slug,
          title: displayTitle,
          slug,
          category: 'Nutrition',
          author: 'BringTheDiet Team',
          readTime: 5,
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          content: `This article is coming soon. Check back later for the full content of "${displayTitle}".`,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.stickyHeader}>
          <Link href="/blog" style={styles.backArrow}>←</Link>
          <div style={styles.skeletonTitle} />
        </div>
        <div style={styles.content}>
          <div style={styles.skeletonImage} />
          <div style={styles.skeletonBlock} />
          <div style={styles.skeletonBlock} />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={styles.page}>
        <div style={styles.content}>
          <p style={{ color: '#9ca3af' }}>Article not found.</p>
          <Link href="/blog" style={styles.linkGreen}>Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Sticky header */}
      <div style={styles.stickyHeader}>
        <Link href="/blog" style={styles.backArrow}>←</Link>
        <h1 style={styles.headerTitle}>Article</h1>
      </div>

      {/* Hero image */}
      {post.image ? (
        <div style={styles.heroImageWrap}>
          <img src={post.image} alt={post.title} style={styles.heroImage} />
        </div>
      ) : (
        <div style={styles.heroPlaceholder}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      )}

      <div style={styles.content}>
        {/* Meta */}
        <div style={styles.metaRow}>
          <span style={styles.categoryBadge}>{post.category}</span>
          <span style={styles.readTime}>{post.readTime} min read</span>
        </div>

        {/* Title */}
        <h1 style={styles.articleTitle}>{post.title}</h1>

        {/* Author & Date */}
        <div style={styles.authorRow}>
          <div style={styles.authorAvatar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p style={styles.authorName}>{post.author}</p>
            <p style={styles.authorDate}>
              Published {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Article content */}
        <div style={styles.articleBody}>
          {post.content ? (
            post.content.split('\n').map((para, i) => (
              para.trim() ? <p key={i} style={styles.paragraph}>{para}</p> : null
            ))
          ) : post.excerpt ? (
            <p style={styles.paragraph}>{post.excerpt}</p>
          ) : (
            <p style={styles.paragraph}>Full article content coming soon.</p>
          )}
        </div>

        {/* Share / Back */}
        <div style={styles.divider} />
        <div style={styles.footer}>
          <Link href="/blog" style={styles.backLink}>
            ← Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#111827',
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151',
  },
  backArrow: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 20,
    lineHeight: 1,
    padding: '4px 8px',
  },
  headerTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: 'white',
  },
  heroImageWrap: {
    width: '100%',
    height: 240,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heroPlaceholder: {
    width: '100%',
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151',
  },
  content: {
    padding: '20px 16px 100px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#374151',
    color: '#d1d5db',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
  },
  readTime: {
    fontSize: 13,
    color: '#6b7280',
  },
  articleTitle: {
    margin: '0 0 16px',
    fontSize: 26,
    fontWeight: 700,
    color: 'white',
    lineHeight: 1.3,
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  authorName: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    color: 'white',
  },
  authorDate: {
    margin: '2px 0 0',
    fontSize: 13,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    margin: '24px 0',
  },
  articleBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  paragraph: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.8,
    color: '#d1d5db',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
  },
  backLink: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#1f2937',
    color: '#9ca3af',
    borderRadius: 12,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    border: '1px solid #374151',
  },
  linkGreen: {
    color: '#6ee7b7',
    textDecoration: 'none',
  },
  skeletonTitle: {
    width: 120,
    height: 20,
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    marginBottom: 20,
  },
  skeletonBlock: {
    width: '100%',
    height: 80,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    marginBottom: 16,
  },
};
