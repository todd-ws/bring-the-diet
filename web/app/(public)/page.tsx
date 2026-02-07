'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Diet {
  _id: string;
  id: string;
  name: string;
  icon: string;
  recipeCount: number;
  color: string;
  slug: string;
  category: 'lifestyle' | 'medical';
}

interface Recipe {
  _id: string;
  id: string;
  title: string;
  image: string;
  diet: string;
  prepTime: number;
  calories: number;
  isFavorite: boolean;
  featured: boolean;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [diets, setDiets] = useState<Diet[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dietSliderRef = useRef<HTMLDivElement>(null);
  const medicalSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollMedicalLeft, setCanScrollMedicalLeft] = useState(false);
  const [canScrollMedicalRight, setCanScrollMedicalRight] = useState(true);

  const lifestyleDiets = diets.filter(d => d.category === 'lifestyle');
  const medicalDiets = diets.filter(d => d.category === 'medical');

  const updateScrollButtons = () => {
    if (dietSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = dietSliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const updateMedicalScrollButtons = () => {
    if (medicalSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = medicalSliderRef.current;
      setCanScrollMedicalLeft(scrollLeft > 0);
      setCanScrollMedicalRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const slider = dietSliderRef.current;
    const medicalSlider = medicalSliderRef.current;

    // Delay to ensure DOM has rendered with new content
    const timer = setTimeout(() => {
      updateScrollButtons();
      updateMedicalScrollButtons();
    }, 100);

    if (slider) {
      slider.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
    }
    if (medicalSlider) {
      medicalSlider.addEventListener('scroll', updateMedicalScrollButtons);
      window.addEventListener('resize', updateMedicalScrollButtons);
    }
    return () => {
      clearTimeout(timer);
      slider?.removeEventListener('scroll', updateScrollButtons);
      medicalSlider?.removeEventListener('scroll', updateMedicalScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
      window.removeEventListener('resize', updateMedicalScrollButtons);
    };
  }, [diets]);

  const scrollDiets = (direction: 'left' | 'right') => {
    if (dietSliderRef.current) {
      const scrollAmount = 300;
      dietSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollMedical = (direction: 'left' | 'right') => {
    if (medicalSliderRef.current) {
      const scrollAmount = 300;
      medicalSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const headers = { 'X-Dev-User': 'web-client' };

        const [dietsRes, recipesRes] = await Promise.all([
          fetch(`${API_URL}/api/diets`, { headers }),
          fetch(`${API_URL}/api/recipes`, { headers }),
        ]);

        if (!dietsRes.ok || !recipesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const dietsData = await dietsRes.json();
        const recipesData = await recipesRes.json();

        setDiets(dietsData.data || []);
        setRecipes((recipesData.data || []).filter((r: Recipe) => r.featured));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: '#ef4444' }}>Error: {error}</p>
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Make sure the API is running on {API_URL}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        .diet-slider-container {
          position: relative;
          padding: 0 20px;
        }
        .diet-slider {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 0;
        }
        .diet-slider::-webkit-scrollbar {
          display: none;
        }
        .diet-slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
        }
        .diet-slider-arrow:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .diet-slider-arrow.left {
          left: 8px;
        }
        .diet-slider-arrow.right {
          right: 8px;
        }
        @media (max-width: 640px) {
          .diet-slider-arrow {
            display: none;
          }
        }
        .recipe-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 0 20px;
        }
        @media (min-width: 640px) {
          .recipe-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1200px) {
          .recipe-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .quick-access-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 0 20px;
        }
        @media (min-width: 640px) {
          .quick-access-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1200px) {
          .quick-access-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <p style={styles.welcomeText}>Welcome to</p>
          <h1 style={styles.appName}>BringThe... Diet</h1>
        </div>
        <button style={styles.themeToggle} type="button" aria-label="Toggle theme">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </header>

      {/* Hero Banner */}
      <div style={styles.heroBanner}>
        <h2 style={styles.heroTitle}>Discover Healthy Recipes for You</h2>
        <p style={styles.heroSubtitle}>Personalized nutrition plans for every diet</p>
        <Link href="/recipes" style={styles.heroButton}>
          Explore Recipes
        </Link>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <svg style={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search recipes, diets, foods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Browse by Diet */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Browse by Diet</h3>
          <Link href="/diets" style={styles.seeAllLink}>See All</Link>
        </div>
        <div className="diet-slider-container">
          {canScrollLeft && (
            <button
              type="button"
              className="diet-slider-arrow left"
              onClick={() => scrollDiets('left')}
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div className="diet-slider" ref={dietSliderRef}>
            {lifestyleDiets.map((diet) => (
              <Link key={diet._id} href={`/diets/${diet.slug}`} style={{ textDecoration: 'none', flex: '1 0 140px', minWidth: 140 }}>
                <div style={styles.dietCard}>
                  <div style={{ ...styles.dietIcon, backgroundColor: diet.color }}>
                    <span style={{ fontSize: 18 }}>{diet.icon}</span>
                  </div>
                  <p style={styles.dietName}>{diet.name}</p>
                  <p style={styles.dietCount}>{diet.recipeCount} recipes</p>
                </div>
              </Link>
            ))}
          </div>
          {canScrollRight && (
            <button
              type="button"
              className="diet-slider-arrow right"
              onClick={() => scrollDiets('right')}
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Medical Diets */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Medical & Health Diets</h3>
          <Link href="/diets?category=medical" style={styles.seeAllLink}>See All</Link>
        </div>
        <div className="diet-slider-container">
          {canScrollMedicalLeft && (
            <button
              type="button"
              className="diet-slider-arrow left"
              onClick={() => scrollMedical('left')}
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div className="diet-slider" ref={medicalSliderRef}>
            {medicalDiets.map((diet) => (
              <Link key={diet._id} href={`/diets/${diet.slug}`} style={{ textDecoration: 'none', flex: '1 0 140px', minWidth: 140 }}>
                <div style={styles.dietCard}>
                  <div style={{ ...styles.dietIcon, backgroundColor: diet.color }}>
                    <span style={{ fontSize: 18 }}>{diet.icon}</span>
                  </div>
                  <p style={styles.dietName}>{diet.name}</p>
                  <p style={styles.dietCount}>{diet.recipeCount} recipes</p>
                </div>
              </Link>
            ))}
          </div>
          {canScrollMedicalRight && (
            <button
              type="button"
              className="diet-slider-arrow right"
              onClick={() => scrollMedical('right')}
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Featured Recipes */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Featured Recipes</h3>
          <Link href="/recipes" style={styles.seeAllLink}>View All</Link>
        </div>
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <Link key={recipe._id} href={`/recipes/${recipe._id}`} style={{ textDecoration: 'none' }}>
              <div style={styles.recipeCard}>
                <div style={styles.recipeImageContainer}>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    style={styles.recipeImage}
                  />
                  <button
                    type="button"
                    aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    style={{
                      ...styles.favoriteButton,
                      backgroundColor: recipe.isFavorite ? '#dc2626' : 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={recipe.isFavorite ? 'white' : 'none'} stroke="white" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <span style={styles.dietTag}>{recipe.diet}</span>
                </div>
                <div style={styles.recipeInfo}>
                  <h4 style={styles.recipeTitle}>{recipe.title}</h4>
                  <div style={styles.recipeMeta}>
                    <span style={styles.recipeMetaItem}>🕐 {recipe.prepTime} min</span>
                    <span style={styles.recipeMetaItem}>🔥 {recipe.calories} cal</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section style={styles.section}>
        <h3 style={{ ...styles.sectionTitle, padding: '0 20px', marginBottom: 16 }}>Quick Access</h3>
        <div className="quick-access-grid">
          <Link href="/meal-plans" style={{ textDecoration: 'none' }}>
            <div style={styles.quickAccessCard}>
              <div style={{ ...styles.quickAccessIcon, backgroundColor: 'rgba(156, 163, 175, 0.2)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <path d="M3 3h18v18H3zM12 8v8M8 12h8" />
                </svg>
              </div>
              <div style={styles.quickAccessText}>
                <p style={styles.quickAccessTitle}>My Meal Plans</p>
                <p style={styles.quickAccessSubtitle}>Plan your weekly meals</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
          <Link href="/foods" style={{ textDecoration: 'none' }}>
            <div style={styles.quickAccessCard}>
              <div style={{ ...styles.quickAccessIcon, backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div style={styles.quickAccessText}>
                <p style={styles.quickAccessTitle}>Food Database</p>
                <p style={styles.quickAccessSubtitle}>Browse nutrition info</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
          <Link href="/favorites" style={{ textDecoration: 'none' }}>
            <div style={styles.quickAccessCard}>
              <div style={{ ...styles.quickAccessIcon, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div style={styles.quickAccessText}>
                <p style={styles.quickAccessTitle}>Saved Recipes</p>
                <p style={styles.quickAccessSubtitle}>Your favorite recipes</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
          <Link href="/progress" style={{ textDecoration: 'none' }}>
            <div style={styles.quickAccessCard}>
              <div style={{ ...styles.quickAccessIcon, backgroundColor: 'rgba(168, 85, 247, 0.2)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div style={styles.quickAccessText}>
                <p style={styles.quickAccessTitle}>My Progress</p>
                <p style={styles.quickAccessSubtitle}>Track your journey</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#111827',
    color: 'white',
    padding: 0,
    margin: -16,
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px 20px',
  },
  welcomeText: {
    margin: 0,
    fontSize: 14,
    color: '#9ca3af',
  },
  appName: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
  },
  themeToggle: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: 8,
  },
  heroBanner: {
    margin: '0 20px 24px',
    padding: '32px 24px',
    borderRadius: 20,
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  },
  heroTitle: {
    margin: '0 0 8px',
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  heroSubtitle: {
    margin: '0 0 20px',
    fontSize: 14,
    opacity: 0.9,
  },
  heroButton: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#059669',
    borderRadius: 25,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
  },
  searchContainer: {
    position: 'relative',
    margin: '0 20px 24px',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    padding: '16px 16px 16px 48px',
    backgroundColor: '#1f2937',
    border: 'none',
    borderRadius: 16,
    color: 'white',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    marginBottom: 16,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
  },
  seeAllLink: {
    color: '#10b981',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  },
  dietGrid: {
    display: 'flex',
    gap: 12,
    padding: '0 20px',
    overflowX: 'auto',
  },
  dietCard: {
    flex: '1 1 auto',
    minWidth: 140,
    padding: '14px 20px',
    backgroundColor: '#1f2937',
    borderRadius: 16,
    textAlign: 'center',
  },
  dietIcon: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 8px',
  },
  dietName: {
    margin: '0 0 2px',
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
  },
  dietCount: {
    margin: 0,
    fontSize: 12,
    color: '#9ca3af',
  },
  recipeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '0 20px',
  },
  recipeCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    overflow: 'hidden',
  },
  recipeImageContainer: {
    position: 'relative',
    height: 200,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  dietTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    padding: '6px 12px',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    margin: '0 0 8px',
    fontSize: 18,
    fontWeight: 600,
    color: 'white',
  },
  recipeMeta: {
    display: 'flex',
    gap: 16,
  },
  recipeMetaItem: {
    fontSize: 13,
    color: '#9ca3af',
  },
  quickAccessCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px 20px',
    backgroundColor: '#1f2937',
    borderRadius: 16,
    border: '1px solid #374151',
  },
  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickAccessText: {
    flex: 1,
  },
  quickAccessTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
  },
  quickAccessSubtitle: {
    margin: '4px 0 0',
    fontSize: 13,
    color: '#9ca3af',
  },
};
