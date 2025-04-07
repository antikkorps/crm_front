import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { apiRequest } from '../../../src/services/api.service'
import DashboardIndexView from '../../../src/views/Dashboard/DashboardIndexView.vue'

// Mock les dépendances
vi.mock('../../../src/services/api.service', () => ({
  apiRequest: vi.fn(),
}))
vi.mock('@iconify/vue', () => ({
  Icon: vi.fn(() => null),
}))

// Mock des composants enfants
vi.mock('../../../src/components/dashboard/cardSingle.vue', () => ({
  default: {
    name: 'CardComponent',
    render() {
      return h('div', { class: 'mock-card' })
    },
  },
}))
vi.mock('../../../src/components/dashboard/OpportunitiesChart.vue', () => ({
  default: {
    name: 'OpportunitiesChart',
    render() {
      return h('div', { class: 'mock-chart' })
    },
  },
}))

describe('DashboardIndexView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock des données pour l'API
    vi.mocked(apiRequest).mockResolvedValue({
      counts: {
        contacts: 5,
        companies: 3,
        notes: 10,
        reminders: {
          upcoming: 2,
          overdue: 1,
        },
      },
    })
  })

  it('renders the dashboard view', async () => {
    const wrapper = mount(DashboardIndexView, {
      global: {
        stubs: {
          CardComponent: true,
          OpportunitiesChart: true,
          Iconify: true,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').text()).toContain('Tableau de bord')
  })

  it('fetches stats data on mount', async () => {
    const wrapper = mount(DashboardIndexView, {
      global: {
        stubs: {
          CardComponent: true,
          OpportunitiesChart: true,
          Iconify: true,
        },
      },
    })
    // Attend que les promesses soient résolues
    await flushPromises()
    expect(apiRequest).toHaveBeenCalledWith('/v1/analytics/dashboard')

    // Utiliser une approche type-safe pour accéder aux données du composant
    type StatsType = {
      contacts: number
      companies: number
      notes: number
      reminders: {
        upcoming: number
        overdue: number
      }
    }

    // Accéder au VM avec une assertion de type plus sécurisée
    const vm = wrapper.vm as unknown as {
      stats: { value?: StatsType } | StatsType
    }

    // Vérification que le mock a correctement mis à jour les données
    // Utiliser une approche avec type guard personnalisé
    function isReactiveStats(
      stats: { value?: StatsType } | StatsType,
    ): stats is { value?: StatsType } {
      return (stats as { value?: StatsType }).value !== undefined
    }

    let statsData: StatsType
    if (isReactiveStats(vm.stats) && vm.stats.value) {
      statsData = vm.stats.value
    } else {
      statsData = vm.stats as StatsType
    }

    expect(statsData.contacts).toBe(5)
    expect(statsData.companies).toBe(3)
    expect(statsData.notes).toBe(10)
    expect(statsData.reminders.upcoming).toBe(2)
    expect(statsData.reminders.overdue).toBe(1)
  })
})
