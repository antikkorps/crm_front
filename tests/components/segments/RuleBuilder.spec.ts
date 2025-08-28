import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import RuleBuilder from '../../../src/components/segments/RuleBuilder.vue'
import type { SegmentCondition, SegmentConditionGroup } from '@/types/segment.types'

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

describe('RuleBuilder', () => {
  const mockPreview = {
    contactCount: 5,
    sampleContacts: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: { name: 'Test Company' },
      },
    ],
    isValid: true,
  }

  let wrapper: any

  beforeEach(() => {
    wrapper = mount(RuleBuilder, {
      props: {
        modelValue: null,
        preview: mockPreview,
      },
      global: {
        stubs: {
          Iconify: true,
        },
      },
    })
  })

  describe('Initial State', () => {
    it('should render correctly when no rules are defined', () => {
      expect(wrapper.find('.text-center').exists()).toBe(true)
      expect(wrapper.text()).toContain('segments.noRulesDefined')
    })

    it('should show add condition and add group buttons when no rules exist', () => {
      const buttons = wrapper.findAll('button')
      const addConditionButton = buttons.find((btn: any) =>
        btn.text().includes('segments.addCondition')
      )
      const addGroupButton = buttons.find((btn: any) => btn.text().includes('segments.addGroup'))

      expect(addConditionButton.exists()).toBe(true)
      expect(addGroupButton.exists()).toBe(true)
    })
  })

  describe('Rule Creation', () => {
    it('should create a condition when add condition button is clicked', async () => {
      const addConditionButton = wrapper
        .findAll('button')
        .find((btn: any) => btn.text().includes('segments.addCondition'))

      await addConditionButton.trigger('click')

      // Should emit update:modelValue with new condition
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toEqual({
        field: 'email',
        operator: 'contains',
        value: '',
      })
    })

    it('should create a condition group when add group button is clicked', async () => {
      const addGroupButton = wrapper
        .findAll('button')
        .find((btn: any) => btn.text().includes('segments.addGroup'))

      await addGroupButton.trigger('click')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toEqual({
        operator: 'AND',
        conditions: [],
      })
    })
  })

  describe('Preview Behavior - The Main Issue', () => {
    it('should NOT emit preview event immediately when adding a condition', async () => {
      const addConditionButton = wrapper
        .findAll('button')
        .find((btn: any) => btn.text().includes('segments.addCondition'))

      await addConditionButton.trigger('click')

      const previewEmitted = wrapper.emitted('preview')
      // ✅ Fixed: Preview should NOT be emitted automatically
      expect(previewEmitted).toBeFalsy()
    })

    it('should only emit preview when user explicitly triggers it', async () => {
      wrapper = mount(RuleBuilder, {
        props: {
          modelValue: {
            field: 'email',
            operator: 'contains',
            value: 'test',
          } as SegmentCondition,
          preview: mockPreview,
        },
        global: {
          stubs: {
            Iconify: true,
          },
        },
      })

      // Change a field value through the select
      const fieldSelect = wrapper.find('select')
      await fieldSelect.setValue('firstName')

      // Should NOT automatically trigger preview for field changes
      const previewEmitted = wrapper.emitted('preview')
      expect(previewEmitted).toBeFalsy()

      // But should emit when clicking the preview button
      const previewButton = wrapper.find('button[class*="btn-primary"]')
      await previewButton.trigger('click')
      
      const previewEmittedAfterClick = wrapper.emitted('preview')
      expect(previewEmittedAfterClick).toBeTruthy()
      expect(previewEmittedAfterClick).toHaveLength(1)
    })

    it('should debounce preview requests when user is typing', async () => {
      vi.useFakeTimers()
      
      wrapper = mount(RuleBuilder, {
        props: {
          modelValue: {
            field: 'email',
            operator: 'contains',
            value: '',
          } as SegmentCondition,
        },
        global: {
          stubs: {
            Iconify: true,
          },
        },
      })

      const input = wrapper.find('input')
      
      // Simulate rapid typing
      await input.setValue('t')
      await input.setValue('te')
      await input.setValue('tes')
      await input.setValue('test@example.com')

      // No immediate preview should be emitted
      let previewEmitted = wrapper.emitted('preview')
      expect(previewEmitted).toBeFalsy()

      // Fast-forward time to trigger debounced function (1200ms)
      vi.advanceTimersByTime(1300)

      previewEmitted = wrapper.emitted('preview')
      // Should emit once after debounce for valid rule
      expect(previewEmitted).toBeTruthy()
      expect(previewEmitted).toHaveLength(1)

      vi.useRealTimers()
    })
  })

  describe('Rule Editing', () => {
    it('should render condition form when modelValue is a condition', async () => {
      const condition: SegmentCondition = {
        field: 'email',
        operator: 'contains',
        value: 'test@example.com',
      }

      await wrapper.setProps({ modelValue: condition })

      expect(wrapper.find('.grid-cols-3').exists()).toBe(true)
      expect(wrapper.find('select').element.value).toBe('email')
      expect(wrapper.find('input').element.value).toBe('test@example.com')
    })

    it('should render condition group form when modelValue is a condition group', async () => {
      const conditionGroup: SegmentConditionGroup = {
        operator: 'AND',
        conditions: [
          {
            field: 'firstName',
            operator: 'equals',
            value: 'John',
          },
        ],
      }

      await wrapper.setProps({ modelValue: conditionGroup })

      expect(wrapper.find('.ml-4').exists()).toBe(true)
      expect(wrapper.text()).toContain('segments.and')
    })
  })

  describe('Rule Removal', () => {
    it('should emit null when removing a rule', async () => {
      const condition: SegmentCondition = {
        field: 'email',
        operator: 'contains',
        value: 'test',
      }

      await wrapper.setProps({ modelValue: condition })

      const removeButton = wrapper
        .findAll('button')
        .find((btn: any) => btn.classes().includes('text-error'))

      await removeButton.trigger('click')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted[emitted.length - 1][0]).toBeNull()
    })
  })

  describe('Available Fields and Operators', () => {
    it('should filter operators based on selected field', () => {
      const vm = wrapper.vm

      // Test string fields
      const stringOperators = vm.getOperatorsForField('email')
      const stringOperatorValues = stringOperators.map((op: any) => op.value)
      expect(stringOperatorValues).toContain('contains')
      expect(stringOperatorValues).toContain('startsWith')
      expect(stringOperatorValues).not.toContain('greaterThan')

      // Test ID fields
      const idOperators = vm.getOperatorsForField('statusId')
      const idOperatorValues = idOperators.map((op: any) => op.value)
      expect(idOperatorValues).toContain('equals')
      expect(idOperatorValues).toContain('notEquals')
      expect(idOperatorValues).not.toContain('contains')
    })

    it('should provide appropriate placeholders for different field types', () => {
      const vm = wrapper.vm

      expect(vm.getValuePlaceholder('email')).toBe('exemple@email.com')
      expect(vm.getValuePlaceholder('firstName')).toBe('Prénom')
      expect(vm.getValuePlaceholder('phone')).toBe('+33 6 12 34 56 78')
    })
  })
})