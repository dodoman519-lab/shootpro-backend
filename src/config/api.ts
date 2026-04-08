// URL de l'API backend — définie via variable d'environnement Vite
// En dev : http://localhost:4000
// En prod : l'URL de votre backend Render (ex: https://shootpro-api.onrender.com)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default API_URL;
