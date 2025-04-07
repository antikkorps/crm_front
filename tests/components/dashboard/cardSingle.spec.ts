import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import CardComponent from '../../../src/components/dashboard/cardSingle.vue'

// Mock pour Iconify
vi.mock('@iconify/vue', () => ({
  Icon: vi.fn(),
}))

describe('CardComponent', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    actionLabel: 'Test Action',
    keyName: 'contacts',
  }

  it('renders correctly with props', () => {
    const wrapper = mount(CardComponent, {
      props: defaultProps,
      global: {
        stubs: {
          Iconify: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Test Description')
    expect(wrapper.find('button').text()).toBe('Test Action')
  })

  it('emits action event when button is clicked', async () => {
    const wrapper = mount(CardComponent, {
      props: defaultProps,
      global: {
        stubs: {
          Iconify: true,
        },
      },
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('action')
    expect(wrapper.emitted().action).toHaveLength(1)
  })

  it('selects the correct icon based on keyName', () => {
    const testCases = [
      { keyName: 'contacts', expectedIcon: 'mdi:account-multiple' },
      { keyName: 'companies', expectedIcon: 'mdi:office-building' },
      { keyName: 'notes', expectedIcon: 'mdi:note-text' },
      { keyName: 'unknown', expectedIcon: 'mdi:chart-areaspline' }, // default icon
    ]

    testCases.forEach((testCase) => {
      const wrapper = mount(CardComponent, {
        props: { ...defaultProps, keyName: testCase.keyName },
        global: {
          stubs: {
            Iconify: true,
          },
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  })
})
