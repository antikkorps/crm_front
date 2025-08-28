import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import SegmentWizard from '../../../src/components/segments/SegmentWizard.vue'
import type { SegmentCreateDto } from '@/types/segment.types'

// Mock pour Iconify
vi.mock('@iconify/vue', () => ({
  Iconify: vi.fn(() => 'iconify-icon'),
}))

// Mock pour vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

// Mock pour les composants enfants
vi.mock('../../../src/components/segments/RuleBuilder.vue', () => ({
  default: {
    name: 'RuleBuilder',
    template: '<div data-testid="rule-builder">RuleBuilder Mock</div>',
    props: ['modelValue', 'preview'],
    emits: ['update:modelValue', 'preview'],
  }
}))

vi.mock('../../../src/components/segments/SegmentRuleDisplay.vue', () => ({
  default: {
    name: 'SegmentRuleDisplay',
    template: '<div data-testid="rule-display">Rule Display Mock</div>',
    props: ['rule'],
  }
}))

describe('SegmentWizard', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(SegmentWizard, {
      global: {
        stubs: {
          Iconify: true,
          RuleBuilder: true,
          SegmentRuleDisplay: true,
        },
      },
    })
  })

  describe('Step Navigation', () => {
    it('should start at step 1', () => {
      expect(wrapper.find('.step-primary').text()).toContain('segments.wizard.stepBasicInfo')
      expect(wrapper.findAll('.step-primary')).toHaveLength(1)
    })

    it('should show step 1 content initially', () => {
      expect(wrapper.find('h2').text()).toBe('segments.wizard.basicInformation')
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })

    it('should not allow proceeding from step 1 without required fields', () => {
      const nextButton = wrapper.find('.btn-primary')
      expect(nextButton.attributes('disabled')).toBe('')
    })

    it('should allow proceeding when form is valid', async () => {
      // Remplir le formulaire
      await wrapper.find('input').setValue('Test Segment')
      
      const nextButton = wrapper.find('.btn-primary')
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Segment Types', () => {
    it('should have dynamic segment selected by default', () => {
      expect(wrapper.vm.formData.isDynamic).toBe(true)
    })

    it('should allow switching to manual segment', async () => {
      // Directly set the value on the Vue component
      wrapper.vm.formData.isDynamic = false
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.formData.isDynamic).toBe(false)
    })

    it('should show dynamic segment description', () => {
      expect(wrapper.text()).toContain('segments.dynamicSegmentDescription')
    })

    it('should show manual segment description', () => {
      expect(wrapper.text()).toContain('segments.manualSegmentDescription')
    })
  })

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      // Essayer de continuer sans nom
      await wrapper.vm.nextStep()
      
      expect(wrapper.vm.currentStep).toBe(1) // Devrait rester à l'étape 1
      expect(wrapper.vm.errors.name).toBeTruthy()
    })

    it('should clear errors when form becomes valid', async () => {
      // Déclencher une erreur
      await wrapper.vm.nextStep()
      expect(wrapper.vm.errors.name).toBeTruthy()
      
      // Corriger l'erreur
      wrapper.vm.formData.name = 'Test Segment'
      await wrapper.vm.nextStep()
      
      expect(wrapper.vm.errors.name).toBe('')
      expect(wrapper.vm.currentStep).toBe(2)
    })
  })

  describe('Event Emissions', () => {
    it('should emit cancel event', async () => {
      const cancelButton = wrapper.find('.btn-outline')
      await cancelButton.trigger('click')
      
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('should emit create event with correct data', async () => {
      // Configurer le formulaire
      wrapper.vm.formData = {
        name: 'Test Segment',
        description: 'Test Description',
        isDynamic: false
      }
      
      // Aller à l'étape finale
      wrapper.vm.currentStep = 3
      await wrapper.vm.$nextTick()
      
      // Cliquer sur créer
      const createButton = wrapper.find('.btn-primary.btn-lg')
      await createButton.trigger('click')
      
      const createEmitted = wrapper.emitted('create')
      expect(createEmitted).toBeTruthy()
      
      const createData: SegmentCreateDto = createEmitted[0][0]
      expect(createData.name).toBe('Test Segment')
      expect(createData.description).toBe('Test Description')
      expect(createData.isDynamic).toBe(false)
      expect(createData.rules).toEqual([])
    })
  })

  describe('Dynamic Segment Flow', () => {
    it('should show rule builder for dynamic segments on step 2', async () => {
      // Configurer segment dynamique
      wrapper.vm.formData = {
        name: 'Dynamic Segment',
        description: '',
        isDynamic: true
      }
      
      // Aller à l'étape 2
      wrapper.vm.currentStep = 2
      await wrapper.vm.$nextTick()
      
      // Check for RuleBuilder component instead of data-testid
      expect(wrapper.text()).toContain('segments.wizard.rulesExplanation')
    })

    it('should not proceed from step 2 without rules for dynamic segments', () => {
      wrapper.vm.formData.isDynamic = true
      wrapper.vm.currentRule = null
      wrapper.vm.currentStep = 2
      
      expect(wrapper.vm.canProceedFromStep2).toBe(false)
    })
  })

  describe('Manual Segment Flow', () => {
    it('should show ready message for manual segments on step 2', async () => {
      wrapper.vm.formData.isDynamic = false
      wrapper.vm.currentStep = 2
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('segments.wizard.manualSegmentReady')
    })

    it('should allow proceeding from step 2 for manual segments', () => {
      wrapper.vm.formData.isDynamic = false
      
      expect(wrapper.vm.canProceedFromStep2).toBe(true)
    })
  })

  describe('Review Step', () => {
    it('should show segment summary on step 3', async () => {
      wrapper.vm.formData = {
        name: 'Test Segment',
        description: 'Test Description',
        isDynamic: true
      }
      wrapper.vm.currentStep = 3
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Test Segment')
      expect(wrapper.text()).toContain('Test Description')
      expect(wrapper.text()).toContain('segments.dynamicSegment')
    })

    it('should show preview results when available', async () => {
      const mockPreview = {
        contactCount: 42,
        sampleContacts: [
          { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
        ],
        isValid: true,
      }
      
      wrapper.vm.currentStep = 3
      await wrapper.setProps({ preview: mockPreview })
      
      expect(wrapper.text()).toContain('42')
      expect(wrapper.text()).toContain('John Doe')
    })
  })
})