import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body
  const admin = supabaseAdmin()

  if (!admin) return res.status(500).json({ error: 'Configuración del servidor incompleta' })

  const { data, error } = await admin.auth.signInWithPassword({ email, password })
  if (error) return res.status(400).json({ error: 'Correo o contraseña incorrectos' })

  return res.status(200).json({ user: data.user })
}
