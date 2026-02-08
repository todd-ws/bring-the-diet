export const diets = [
  { id: '1', name: 'Keto', icon: '🔥', recipeCount: 124, color: '#78350f' },
  { id: '2', name: 'Vegan', icon: '🌿', recipeCount: 98, color: '#065f46' },
  { id: '3', name: 'Paleo', icon: '🍎', recipeCount: 76, color: '#7f1d1d' },
  { id: '4', name: 'Mediterranean', icon: '🫒', recipeCount: 89, color: '#1e40af' },
  { id: '5', name: 'Low Carb', icon: '🥗', recipeCount: 112, color: '#166534' },
  { id: '6', name: 'Gluten Free', icon: '🌾', recipeCount: 67, color: '#a16207' },
];

export const featuredRecipes = [
  {
    id: '1',
    title: 'Crispy Chicken Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    diet: 'Mediterranean',
    prepTime: 25,
    calories: 450,
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Avocado Toast with Eggs',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop',
    diet: 'Keto',
    prepTime: 15,
    calories: 320,
    isFavorite: false,
  },
  {
    id: '3',
    title: 'Grilled Salmon Bowl',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
    diet: 'Paleo',
    prepTime: 30,
    calories: 380,
    isFavorite: true,
  },
  {
    id: '4',
    title: 'Veggie Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    diet: 'Vegan',
    prepTime: 20,
    calories: 290,
    isFavorite: false,
  },
];
