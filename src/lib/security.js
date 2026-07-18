export function calcularFortaleza(password) {
  let score = 0
  if (!password) return { score: 0, label: '', color: '', nivel: 0 }

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  const niveles = [
    { label: 'Muy débil', color: 'bg-red-500', nivel: 0 },
    { label: 'Débil', color: 'bg-orange-500', nivel: 1 },
    { label: 'Regular', color: 'bg-yellow-500', nivel: 2 },
    { label: 'Fuerte', color: 'bg-lime-500', nivel: 3 },
    { label: 'Muy fuerte', color: 'bg-brand', nivel: 4 },
  ]

  return { score, ...niveles[Math.min(score, 4)] }
}

export function validarContrasena(password) {
  const errores = []
  if (!password || password.length < 8) {
    errores.push('Debe tener al menos 8 caracteres')
  }
  if (password && !/[a-z]/.test(password)) {
    errores.push('Debe incluir una minúscula')
  }
  if (password && !/[A-Z]/.test(password)) {
    errores.push('Debe incluir una mayúscula')
  }
  if (password && !/\d/.test(password)) {
    errores.push('Debe incluir un número')
  }
  if (password && !/[^a-zA-Z0-9]/.test(password)) {
    errores.push('Debe incluir un carácter especial (@, #, $, etc.)')
  }
  return errores
}

export function sanitizar(valor) {
  if (typeof valor !== 'string') return ''
  return valor
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validarRUT(rut) {
  if (!rut) return true
  const limpio = rut.replace(/[^0-9kK]/g, '')
  if (limpio.length < 7 || limpio.length > 9) return false
  return true
}
