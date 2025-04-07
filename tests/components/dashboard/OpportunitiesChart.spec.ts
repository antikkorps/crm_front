import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ComponentPublicInstance, h } from 'vue'
import OpportunitiesChart from '../../../src/components/dashboard/OpportunitiesChart.vue'

// Mock pour ApexCharts
vi.mock('vue3-apexcharts', () => ({
  default: {
    name: 'apexchart',
    render() {
      return h('div', { class: 'mock-apexchart' })
    },
  },
}))

// Mock pour l'API request
vi.mock('../../../src/services/api.service', () => ({
  apiRequest: vi.fn(() =>
    Promise.resolve({
      data: [{ name: 'Test Series', data: [10, 20, 30] }],
    }),
  ),
}))

// Définir les types pour le composant
type SeriesType = Array<{
  name: string
  data: number[]
}>

// Utiliser Record<string, unknown> au lieu de [key: string]: any
type ChartOptionsType = {
  chart: {
    type: string
    stacked: boolean
    height?: number | string
    toolbar?: Record<string, unknown>
    fontFamily?: string
    foreColor?: string
  }
  colors: string[]
  plotOptions?: Record<string, unknown>
  xaxis?: Record<string, unknown>
  yaxis?: Record<string, unknown>
  dataLabels?: Record<string, unknown>
  legend?: Record<string, unknown>
  tooltip?: Record<string, unknown>
  grid?: Record<string, unknown>
  stroke?: Record<string, unknown>
  theme?: Record<string, unknown>
  title?: Record<string, unknown>
  responsive?: unknown[]
}

// Type pour le composant
interface ChartComponentVM extends ComponentPublicInstance {
  series: SeriesType | { value: SeriesType }
  chartOptions: ChartOptionsType | { value: ChartOptionsType }
}

describe('OpportunitiesChart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the chart component', async () => {
    const wrapper = mount(OpportunitiesChart, {
      global: {
        stubs: {
          apexchart: true,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.h-full').exists()).toBe(true)
  })

  it('initializes with default data series', () => {
    const wrapper = mount(OpportunitiesChart, {
      global: {
        stubs: {
          apexchart: true,
        },
      },
    })

    // Utiliser le type personnalisé
    const vm = wrapper.vm as unknown as ChartComponentVM

    // Fonction helper pour extraire la série de données
    function getSeriesData(data: SeriesType | { value: SeriesType }): SeriesType {
      return 'value' in data ? data.value : data
    }

    const seriesData = getSeriesData(vm.series)

    expect(seriesData).toBeDefined()
    expect(Array.isArray(seriesData)).toBe(true)
    expect(seriesData.length).toBeGreaterThan(0)
    expect(seriesData[0].name).toBe('Prospection')
  })

  it('has correctly configured chart options', () => {
    const wrapper = mount(OpportunitiesChart, {
      global: {
        stubs: {
          apexchart: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as ChartComponentVM

    // Fonction helper pour extraire les options
    function getOptions(data: ChartOptionsType | { value: ChartOptionsType }): ChartOptionsType {
      return 'value' in data ? data.value : data
    }

    const options = getOptions(vm.chartOptions)

    expect(options).toBeDefined()
    expect(options.chart).toBeDefined()
    expect(options.chart.type).toBe('bar')
    expect(options.chart.stacked).toBe(true)
    expect(options.colors).toBeInstanceOf(Array)
  })
})
