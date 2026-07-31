import { describe, it, expect, vi, beforeEach } from 'vitest'
import { debounce } from './utils'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  it('delays function execution', async () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('resets timer on subsequent calls', async () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    await vi.advanceTimersByTimeAsync(50)
    debounced()
    await vi.advanceTimersByTimeAsync(50)
    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('passes arguments to the function', async () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('a', 'b')
    await vi.advanceTimersByTimeAsync(100)

    expect(fn).toHaveBeenCalledWith('a', 'b')
  })

  it('cancel prevents execution', async () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced.cancel()
    await vi.advanceTimersByTimeAsync(100)

    expect(fn).not.toHaveBeenCalled()
  })

  it('cancel is safe to call multiple times', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced.cancel()
    debounced.cancel()
    expect(fn).not.toHaveBeenCalled()
  })
})
