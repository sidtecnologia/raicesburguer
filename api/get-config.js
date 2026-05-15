export default (req, res) => {
  const SB_URL = process.env.VITE_SB_URL;
  const SB_ANON_KEY = process.env.VITE_SB_ANON_KEY;

  if (!SB_URL || !SB_ANON_KEY) {
    return res.status(500).json({ error: 'Variables de entorno de Supabase no configuradas.' });
  }

  // Devuelve las claves públicas como JSON
  res.status(200).json({
    url: SB_URL,
    anonKey: SB_ANON_KEY
  });
};