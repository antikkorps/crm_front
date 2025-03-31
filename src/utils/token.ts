const TOKEN_KEY = 'auth_token'

interface CookieOptions {
  expires?: Date | number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}
// Fonction pour définir un cookie
function setCookie(name: string, value: string, options: CookieOptions = {}) {
  // Options par défaut
  const defaultOptions: CookieOptions = {
    path: '/',
    // Ajouter secure: true en production
    secure: window.location.protocol === 'https:',
    sameSite: 'strict',
  }

  const opts = { ...defaultOptions, ...options }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (opts.expires) {
    if (typeof opts.expires === 'number') {
      // Expiration en jours
      const days = opts.expires
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      opts.expires = date
    }
    cookieString += `;expires=${opts.expires.toUTCString()}`
  }

  if (opts.path) cookieString += `;path=${opts.path}`
  if (opts.domain) cookieString += `;domain=${opts.domain}`
  if (opts.secure) cookieString += `;secure`
  if (opts.sameSite) cookieString += `;samesite=${opts.sameSite}`

  document.cookie = cookieString
}

// Fonction pour récupérer un cookie
function getCookie(name: string): string | null {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)'),
  )
  return matches ? decodeURIComponent(matches[1]) : null
}

// Fonction pour supprimer un cookie
function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1 })
}

// Exporter les fonctions pour gérer le token
export function setToken(token: string): void {
  setCookie(TOKEN_KEY, token, { expires: 7 }) // Expire dans 7 jours
}

export function getToken(): string | null {
  return getCookie(TOKEN_KEY)
}

export function removeToken(): void {
  deleteCookie(TOKEN_KEY)
}
