import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '~/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('should render with default props', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })

    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.find('button').attributes('type')).toBe('button')
    expect(wrapper.find('button').classes()).toContain('btn-primary')
  })

  it('should apply variant classes correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'secondary'
      },
      slots: {
        default: 'Secondary Button'
      }
    })

    expect(wrapper.find('button').classes()).toContain('btn-secondary')
  })

  it('should apply size classes correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        size: 'lg'
      },
      slots: {
        default: 'Large Button'
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('px-6')
    expect(button.classes()).toContain('py-3')
    expect(button.classes()).toContain('text-base')
  })

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled Button'
      }
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('should show loading state', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true,
        loadingText: 'Loading...'
      },
      slots: {
        default: 'Submit'
      }
    })

    expect(wrapper.text()).toBe('Loading...')
    expect(wrapper.find('svg').exists()).toBe(true) // Loading spinner
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should not emit click event when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled Button'
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('should not emit click event when loading', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Loading Button'
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('should apply full width when fullWidth is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        fullWidth: true
      },
      slots: {
        default: 'Full Width Button'
      }
    })

    expect(wrapper.find('button').classes()).toContain('w-full')
  })

  it('should set button type correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: 'submit'
      },
      slots: {
        default: 'Submit Button'
      }
    })

    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('should apply outline variant classes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'outline'
      },
      slots: {
        default: 'Outline Button'
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('border-2')
    expect(button.classes()).toContain('border-gray-300')
    expect(button.classes()).toContain('text-gray-700')
  })

  it('should apply ghost variant classes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'ghost'
      },
      slots: {
        default: 'Ghost Button'
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('text-gray-700')
    expect(button.classes()).toContain('bg-transparent')
  })

  it('should apply danger variant classes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'danger'
      },
      slots: {
        default: 'Danger Button'
      }
    })

    expect(wrapper.find('button').classes()).toContain('btn-danger')
  })
})
