// Resolves a path inside /public/assets relative to the configured Vite `base`.
// Using import.meta.env.BASE_URL keeps assets working whether you deploy to
// "/" (Vercel/Netlify) or "/repo/" (GitHub project pages).
export const asset = (p) => {
  const base = import.meta.env.BASE_URL || "/";
  const clean = String(p).replace(/^\/+/, "");
  return `${base}${clean}`;
};
