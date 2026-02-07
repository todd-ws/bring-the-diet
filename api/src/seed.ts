import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });

import { MongoClient } from "mongodb";

const diets = [
  // Lifestyle diets
  { id: "1", name: "Keto", icon: "🔥", recipeCount: 124, color: "#78350f", slug: "keto", description: "Low-carb, high-fat diet", category: "lifestyle" },
  { id: "2", name: "Vegan", icon: "🌿", recipeCount: 98, color: "#065f46", slug: "vegan", description: "Plant-based diet", category: "lifestyle" },
  { id: "3", name: "Paleo", icon: "🍎", recipeCount: 76, color: "#7f1d1d", slug: "paleo", description: "Whole foods diet", category: "lifestyle" },
  { id: "4", name: "Mediterranean", icon: "🫒", recipeCount: 89, color: "#1e40af", slug: "mediterranean", description: "Heart-healthy diet", category: "lifestyle" },
  { id: "5", name: "Low Carb", icon: "🥗", recipeCount: 112, color: "#166534", slug: "low-carb", description: "Reduced carbohydrate diet", category: "lifestyle" },
  { id: "6", name: "Gluten Free", icon: "🌾", recipeCount: 67, color: "#a16207", slug: "gluten-free", description: "No gluten diet", category: "lifestyle" },
  { id: "7", name: "Whole30", icon: "🍳", recipeCount: 54, color: "#7c3aed", slug: "whole30", description: "30-day clean eating reset", category: "lifestyle" },
  { id: "8", name: "Pescatarian", icon: "🐟", recipeCount: 71, color: "#0891b2", slug: "pescatarian", description: "Plant-based with seafood", category: "lifestyle" },
  { id: "9", name: "Flexitarian", icon: "🥦", recipeCount: 93, color: "#15803d", slug: "flexitarian", description: "Flexible vegetarian diet", category: "lifestyle" },
  // Medical diets
  { id: "10", name: "Diabetic", icon: "💉", recipeCount: 156, color: "#0369a1", slug: "diabetic", description: "Blood sugar management diet", category: "medical" },
  { id: "11", name: "Heart Healthy", icon: "❤️", recipeCount: 134, color: "#dc2626", slug: "heart-healthy", description: "Cardiovascular health diet", category: "medical" },
  { id: "12", name: "DASH", icon: "🩺", recipeCount: 82, color: "#7c3aed", slug: "dash", description: "Dietary approach to stop hypertension", category: "medical" },
  { id: "13", name: "Renal", icon: "🫘", recipeCount: 45, color: "#b45309", slug: "renal", description: "Kidney-friendly diet", category: "medical" },
  { id: "14", name: "Low Sodium", icon: "🧂", recipeCount: 98, color: "#64748b", slug: "low-sodium", description: "Reduced salt intake diet", category: "medical" },
  { id: "15", name: "Anti-Inflammatory", icon: "🍇", recipeCount: 48, color: "#6d28d9", slug: "anti-inflammatory", description: "Reduces chronic inflammation", category: "medical" },
  { id: "16", name: "Low FODMAP", icon: "🥬", recipeCount: 67, color: "#059669", slug: "low-fodmap", description: "Digestive health diet", category: "medical" },
  { id: "17", name: "Celiac", icon: "🌾", recipeCount: 89, color: "#ca8a04", slug: "celiac", description: "Strict gluten-free for celiac disease", category: "medical" },
  { id: "18", name: "Cardiac Rehab", icon: "💓", recipeCount: 56, color: "#e11d48", slug: "cardiac-rehab", description: "Post-cardiac event recovery diet", category: "medical" },
  { id: "19", name: "Cancer Support", icon: "🎗️", recipeCount: 72, color: "#ec4899", slug: "cancer-support", description: "Nutrition during cancer treatment", category: "medical" },
];

const recipes = [
  {
    id: "1",
    title: "Crispy Chicken Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    diet: "Mediterranean",
    dietSlug: "mediterranean",
    prepTime: 25,
    calories: 450,
    isFavorite: true,
    featured: true,
    description: "A delicious crispy chicken burger with fresh vegetables",
    ingredients: ["chicken breast", "lettuce", "tomato", "burger bun", "mayo"],
    instructions: ["Season chicken", "Grill until crispy", "Assemble burger"],
  },
  {
    id: "2",
    title: "Avocado Toast with Eggs",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop",
    diet: "Keto",
    dietSlug: "keto",
    prepTime: 15,
    calories: 320,
    isFavorite: false,
    featured: true,
    description: "Creamy avocado on toast topped with perfectly cooked eggs",
    ingredients: ["avocado", "eggs", "bread", "salt", "pepper"],
    instructions: ["Toast bread", "Mash avocado", "Cook eggs", "Assemble"],
  },
  {
    id: "3",
    title: "Grilled Salmon Bowl",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
    diet: "Paleo",
    dietSlug: "paleo",
    prepTime: 30,
    calories: 380,
    isFavorite: true,
    featured: true,
    description: "Fresh grilled salmon served over a bed of greens",
    ingredients: ["salmon fillet", "mixed greens", "quinoa", "lemon", "olive oil"],
    instructions: ["Season salmon", "Grill for 4-5 min per side", "Serve over greens"],
  },
  {
    id: "4",
    title: "Veggie Buddha Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    diet: "Vegan",
    dietSlug: "vegan",
    prepTime: 20,
    calories: 290,
    isFavorite: false,
    featured: true,
    description: "A nourishing bowl packed with colorful vegetables",
    ingredients: ["chickpeas", "sweet potato", "kale", "tahini", "quinoa"],
    instructions: ["Roast vegetables", "Cook quinoa", "Assemble bowl", "Drizzle tahini"],
  },
  {
    id: "5",
    title: "Keto Cauliflower Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    diet: "Keto",
    dietSlug: "keto",
    prepTime: 45,
    calories: 280,
    isFavorite: false,
    featured: false,
    description: "Low-carb pizza with a cauliflower crust",
    ingredients: ["cauliflower", "mozzarella", "tomato sauce", "pepperoni"],
    instructions: ["Make cauliflower crust", "Add toppings", "Bake at 425F"],
  },
  {
    id: "6",
    title: "Mediterranean Salad",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
    diet: "Mediterranean",
    dietSlug: "mediterranean",
    prepTime: 10,
    calories: 220,
    isFavorite: true,
    featured: false,
    description: "Fresh salad with feta, olives, and olive oil dressing",
    ingredients: ["cucumber", "tomatoes", "feta cheese", "olives", "olive oil"],
    instructions: ["Chop vegetables", "Add feta and olives", "Dress with olive oil"],
  },
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || "foods-test");

    // Clear and seed diets (using diettypes collection from .env)
    const dietsCollection = db.collection(process.env.DB_DIETS_COLLECTION || "diettypes");
    await dietsCollection.deleteMany({});
    await dietsCollection.insertMany(diets.map(d => ({
      ...d,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));
    console.log(`✓ Inserted ${diets.length} diets`);

    // Clear and seed recipes
    const recipesCollection = db.collection(process.env.DB_RECIPES_COLLECTION || "recipes");
    await recipesCollection.deleteMany({});
    await recipesCollection.insertMany(recipes.map(r => ({
      ...r,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));
    console.log(`✓ Inserted ${recipes.length} recipes`);

    console.log("\n✓ Seed complete!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
