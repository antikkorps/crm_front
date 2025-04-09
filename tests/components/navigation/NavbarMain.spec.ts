import NavbarMain from '@/components/NavbarMain.vue'
import { AuthService } from '@/services/auth.service'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

// Mock des dépendances
vi.mock('@/services/auth.service', () => ({
  AuthService: {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
  },
}))

// Mock du composant ThemeToggle
vi.mock('@/components/ThemeToggle.vue', () => ({
  default: {
    name: 'ThemeToggle',
    template: '<button>Toggle Theme</button>',
  },
}))

// Mock des icônes Iconify
vi.mock('@iconify/vue', () => ({
  Icon: {
    name: 'Iconify',
    template: '<div class="mock-icon" :data-icon="icon"></div>',
    props: ['icon'],
  },
}))

// Configuration du router pour les tests
const routes = [
  { path: '/', component: { template: '<div>Home page</div>' } },
  { path: '/login', component: { template: '<div>Login page</div>' } },
  { path: '/profile', component: { template: '<div>Profile page</div>' } },
  { path: '/settings', component: { template: '<div>Settings page</div>' } },
  { path: '/dashboard', component: { template: '<div>Dashboard page</div>' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Configuration globale pour les tests
const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  tenantId: '1',
  avatarUrl: null,
}

describe('NavbarMain Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Créer et définir une instance Pinia active pour les tests
    setActivePinia(createPinia())
  })

  it('affiche une version simplifiée pour les utilisateurs non connectés', async () => {
    // Configuration du mock pour un utilisateur non connecté
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(false)

    const wrapper = mount(NavbarMain, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: true,
          RouterLink: true,
          Iconify: true,
        },
      },
    })

    // Attendre que les promesses soient résolues
    await flushPromises()

    // Vérifier que la version non connectée est affichée
    expect(wrapper.find('.btn-primary').text()).toBe('Login')
    expect(wrapper.find('.drawer-toggle').exists()).toBe(false)
    expect(wrapper.find('.dropdown-end').exists()).toBe(false)
  })

  it('affiche la version complète avec sidebar pour les utilisateurs connectés', async () => {
    // Configuration du mock pour un utilisateur connecté
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(true)
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(mockUser)

    const wrapper = mount(NavbarMain, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: true,
          RouterLink: true,
          Iconify: true,
          'label[for="my-drawer-3"]': true, // Stub le label qui pourrait contenir .btn-primary
          button: {
            // Stub plus précis pour les boutons qui pourraient avoir la classe .btn-primary
            render() {
              return h('button', { class: this.$attrs.class })
            },
          },
        },
      },
    })

    // Attendre que les promesses soient résolues
    await flushPromises()

    // Vérifier que la version connectée est affichée
    expect(wrapper.find('.drawer-toggle').exists()).toBe(true)
    expect(wrapper.find('.dropdown-end').exists()).toBe(true)

    // Utiliser une sélection plus précise pour trouver le bouton login spécifiquement
    const loginButton = wrapper.find('button.btn-primary[text="Login"]')
    expect(loginButton.exists()).toBe(false)
  })

  it("affiche les initiales de l'utilisateur quand aucun avatar n'est disponible", async () => {
    // Configuration du mock pour un utilisateur connecté sans avatar
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(true)
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(mockUser)

    const wrapper = mount(NavbarMain, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: true,
          RouterLink: true,
          Iconify: true,
        },
      },
    })

    // Attendre que les promesses soient résolues
    await flushPromises()

    // Vérifier que les initiales sont affichées
    const avatarInitials = wrapper.find('.bg-primary.text-primary-content')
    expect(avatarInitials.exists()).toBe(true)
    expect(avatarInitials.text()).toBe('JD')
  })

  it("affiche l'image de l'avatar quand elle est disponible", async () => {
    // Configuration du mock pour un utilisateur avec avatar
    const userWithAvatar = { ...mockUser, avatarUrl: 'https://example.com/avatar.jpg' }
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(true)
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(userWithAvatar)

    const wrapper = mount(NavbarMain, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: true,
          RouterLink: true,
          Iconify: true,
        },
      },
    })

    // Attendre que les promesses soient résolues
    await flushPromises()

    // Vérifier que l'image de l'avatar est affichée
    const avatarImg = wrapper.find('.avatar img')
    expect(avatarImg.exists()).toBe(true)
    expect(avatarImg.attributes('src')).toBe('https://example.com/avatar.jpg')
  })

  it('déclenche la déconnexion lorsque le bouton de déconnexion est cliqué', async () => {
    // Configuration du mock pour un utilisateur connecté
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(true)
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(mockUser)

    const wrapper = mount(NavbarMain, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: true,
          RouterLink: true,
          Iconify: true,
        },
      },
    })

    // Attendre que les promesses soient résolues
    await flushPromises()

    // Cliquer sur le bouton de déconnexion
    const logoutButton = wrapper.findAll('a').filter((w) => w.text().includes('Logout'))[0]
    await logoutButton.trigger('click')

    // Vérifier que la fonction de déconnexion a été appelée
    expect(AuthService.logout).toHaveBeenCalled()
  })

  it('affiche le bouton de retour en haut lorsque la page défile', async () => {
    // Configuration du mock pour un utilisateur connecté
    vi.mocked(AuthService.isAuthenticated).mockReturnValue(true)
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(mockUser)

    const wrapper = mount(NavbarMain, {
      global: {
        plugins: [router],
        stubs: {
          ThemeToggle: true,
          RouterLink: true,
          Iconify: true,
        },
      },
    })

    // Attendre que les promesses soient résolues
    await flushPromises()

    // Vérifier que le bouton n'est pas visible initialement
    expect(wrapper.find('[aria-label="Retour en haut"]').exists()).toBe(false)

    // Simuler le défilement
    Object.defineProperty(window, 'scrollY', { value: 350, configurable: true })
    window.dispatchEvent(new Event('scroll'))

    // Attendre la mise à jour
    await wrapper.vm.$nextTick()

    // Vérifier que le bouton est maintenant visible
    expect(wrapper.find('[aria-label="Retour en haut"]').exists()).toBe(true)
  })
})
