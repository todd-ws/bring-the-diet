import { Pill, Shell } from '@nutri/ui';

export default function HomePage() {
  return (
    <Shell title="Home">
      <p style={{ maxWidth: 840 }}>
        This is the foundation shell. Wire the Web experience to the API for real data (featured diets, trending recipes, etc.).
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Pill label="OIDC Login" />
        <Pill label="Recipes" />
        <Pill label="Meal Plans" />
        <Pill label="Diets" />
        <Pill label="Blog" />
      </div>
    </Shell>
  );
}
