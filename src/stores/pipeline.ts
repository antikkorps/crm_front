import type {
  OpportunitiesByMonth,
  OpportunityStatusDistribution,
} from '@/services/pipeline.service'
import { PipelineService } from '@/services/pipeline.service'
import { defineStore } from 'pinia'

export interface PipelineSummary {
  totalCount: number
  totalValue: number
  weightedValue: number
  averageValue: number
}

export const usePipelineStore = defineStore('pipeline', {
  state: () => ({
    pipelineData: [] as OpportunityStatusDistribution[],
    monthlyData: null as OpportunitiesByMonth | null,
    summary: null as PipelineSummary | null,
    isLoading: false,
    activeChartType: 'monthly' as 'monthly' | 'status',
    chartMetric: 'value' as 'value' | 'count',
    statusValueData: [] as string[],
    statusCountData: [] as number[],
  }),

  getters: {
    // Données de séries pour le graphique mensuel en NOMBRE d'opportunités
    monthlyCountSeries(state) {
      if (!state.monthlyData?.series || state.monthlyData.series.length === 0) {
        return [{ name: 'Aucune donnée', data: [0] }]
      }

      // L'API renvoie déjà le nombre d'opportunités par mois
      return state.monthlyData.series
    },

    // Données de séries pour le graphique mensuel en VALEUR
    monthlyValueSeries(state) {
      if (!state.monthlyData?.series || state.monthlyData.series.length === 0) {
        return [{ name: 'Aucune donnée', data: [0] }]
      }

      // Si l'API fournit déjà les données de valeur
      if (state.monthlyData.valueSeries && state.monthlyData.valueSeries.length > 0) {
        return state.monthlyData.valueSeries
      }

      // Sinon, on estime les valeurs à partir des données de pipeline
      if (state.pipelineData.length > 0) {
        // Créer une cartographie des valeurs moyennes par statut
        const valueFactor: Record<string, number> = {}
        state.pipelineData.forEach((item) => {
          if (item.count > 0) {
            valueFactor[item.name] = item.value / item.count
          } else {
            valueFactor[item.name] = state.summary?.averageValue || 50000 // Valeur moyenne du pipeline ou valeur par défaut
          }
        })

        // Appliquer ces facteurs aux séries mensuelles pour estimer les valeurs
        return state.monthlyData.series.map((serie) => {
          const factor = valueFactor[serie.name] || state.summary?.averageValue || 50000 // Facteur par défaut
          return {
            name: serie.name,
            data: serie.data.map((count) => count * factor),
          }
        })
      }

      // Fallback: générer des valeurs simulées basées sur la moyenne du pipeline si disponible
      const avgValue = state.summary?.averageValue || 50000
      return state.monthlyData.series.map((serie) => {
        return {
          name: serie.name,
          data: serie.data.map((count) => count * (avgValue * (0.8 + Math.random() * 0.4))), // Variation aléatoire autour de la moyenne
        }
      })
    },

    // Le getter qui décide quelle série utiliser en fonction de la métrique sélectionnée
    monthlyChartSeries(state) {
      if (state.chartMetric === 'value') {
        if (!state.monthlyData?.series || state.monthlyData.series.length === 0) {
          return [{ name: 'Aucune donnée', data: [0] }]
        }

        // Si l'API fournit déjà les données de valeur
        if (state.monthlyData.valueSeries && state.monthlyData.valueSeries.length > 0) {
          return state.monthlyData.valueSeries
        }

        // Logique de monthlyValueSeries
        if (state.pipelineData.length > 0) {
          const valueFactor: Record<string, number> = {}
          state.pipelineData.forEach((item) => {
            if (item.count > 0) {
              valueFactor[item.name] = item.value / item.count
            } else {
              valueFactor[item.name] = state.summary?.averageValue || 50000
            }
          })

          return state.monthlyData.series.map((serie) => {
            const factor = valueFactor[serie.name] || state.summary?.averageValue || 50000
            return {
              name: serie.name,
              data: serie.data.map((count) => count * factor),
            }
          })
        }

        const avgValue = state.summary?.averageValue || 50000
        return state.monthlyData.series.map((serie) => {
          return {
            name: serie.name,
            data: serie.data.map((count) => count * (avgValue * (0.8 + Math.random() * 0.4))),
          }
        })
      } else {
        // Use monthlyCountSeries logic
        if (!state.monthlyData?.series || state.monthlyData.series.length === 0) {
          return [{ name: 'Aucune donnée', data: [0] }]
        }
        return state.monthlyData.series
      }
    },

    // Données pour le graphique par statut en mode valeur
    statusValueData(state) {
      if (!state.pipelineData || state.pipelineData.length === 0) {
        return [
          {
            name: 'Aucune donnée',
            data: [0],
          },
        ]
      }

      // Format pour les graphiques à barres horizontales
      return [
        {
          name: 'Valeur',
          data: state.pipelineData.map((status) => status.value || 0),
        },
      ]
    },

    // Données pour le graphique par statut en mode nombre
    statusCountData(state) {
      if (!state.pipelineData || state.pipelineData.length === 0) {
        return [
          {
            name: 'Aucune donnée',
            data: [0],
          },
        ]
      }

      // Format pour les graphiques à barres horizontales
      return [
        {
          name: 'Nombre',
          data: state.pipelineData.map((status) => status.count || 0),
        },
      ]
    },

    // Labels pour le graphique par statut
    statusLabels(state) {
      if (!state.pipelineData || state.pipelineData.length === 0) {
        return ['Aucune donnée']
      }
      return state.pipelineData.map((status) => status.name)
    },

    // Couleurs pour le graphique par statut
    statusColors(state) {
      if (!state.pipelineData || state.pipelineData.length === 0) {
        return ['#808080']
      }
      return state.pipelineData.map((status) => status.color || '#808080')
    },

    // Catégories pour le graphique mensuel
    monthlyCategories(state) {
      return state.monthlyData?.categories || ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
    },
  },

  actions: {
    // Changer le type de graphique (mensuel ou par statut)
    setChartType(type: 'monthly' | 'status') {
      this.activeChartType = type
    },

    // Changer la métrique (valeur ou nombre)
    setChartMetric(metric: 'value' | 'count') {
      this.chartMetric = metric
    },

    // Charger les données depuis l'API
    async fetchPipelineData() {
      try {
        this.isLoading = true

        // Récupérer les données du pipeline d'opportunités par statut
        const statusData = await PipelineService.getOpportunitiesPipeline()
        this.pipelineData = statusData || []

        // Récupérer les données mensuelles
        const byMonthData = await PipelineService.getOpportunitiesByMonth()
        this.monthlyData = byMonthData || { categories: [], series: [] }

        // Récupérer les données de résumé de pipeline
        const summaryData = await PipelineService.getOpportunitiesValueSummary()
        if (summaryData && summaryData.summary) {
          this.summary = summaryData.summary
        }

        console.log('Données mensuelles chargées:', this.monthlyData)
        console.log('Données par statut chargées:', this.pipelineData)
        console.log('Résumé du pipeline chargé:', this.summary)
      } catch (error) {
        console.error('Erreur lors du chargement des données du pipeline:', error)
        this.pipelineData = []
        this.monthlyData = null
        this.summary = null
      } finally {
        this.isLoading = false
      }
    },
  },
})
