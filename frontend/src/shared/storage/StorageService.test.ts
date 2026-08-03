import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StorageService } from './StorageService'

describe('StorageService', () => {
  const service = new StorageService()

  beforeEach(() => {
    localStorage.clear()
  })

  describe('get', () => {
    it('returns null for nonexistent key', () => {
      expect(service.get('nonexistent')).toBeNull()
    })

    it('returns parsed data for valid key', () => {
      const data = [{ id: '1', title: 'Test' }]
      localStorage.setItem('lifeboard:test', JSON.stringify(data))

      expect(service.get('test')).toEqual(data)
    })

    it('returns null for corrupted JSON', () => {
      localStorage.setItem('lifeboard:corrupted', 'not json at all')

      expect(service.get('corrupted')).toBeNull()
    })

    it('returns null when localStorage throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })

      expect(service.get('test')).toBeNull()

      vi.restoreAllMocks()
    })
  })

  describe('set', () => {
    it('saves data that can be retrieved', () => {
      service.set('boards', [{ id: '1', title: 'Board 1' }])

      const stored = localStorage.getItem('lifeboard:boards')
      expect(stored).toBe('[{"id":"1","title":"Board 1"}]')
    })

    it('overwrites existing data', () => {
      service.set('key', 'first')
      service.set('key', 'second')

      expect(service.get('key')).toBe('second')
    })

    it('does not throw when localStorage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })

      expect(() => service.set('key', 'value')).not.toThrow()

      vi.restoreAllMocks()
    })
  })

  describe('remove', () => {
    it('removes a key', () => {
      service.set('to-remove', 'data')
      service.remove('to-remove')

      expect(service.get('to-remove')).toBeNull()
    })
  })

  describe('clear', () => {
    it('removes all lifeboard: keys', () => {
      localStorage.setItem('lifeboard:a', '1')
      localStorage.setItem('lifeboard:b', '2')
      localStorage.setItem('other:c', '3')

      service.clear()

      expect(localStorage.getItem('lifeboard:a')).toBeNull()
      expect(localStorage.getItem('lifeboard:b')).toBeNull()
      expect(localStorage.getItem('other:c')).toBe('3')
    })
  })

  describe('key prefix', () => {
    it('uses lifeboard: prefix', () => {
      service.set('boards', [])

      expect(localStorage.getItem('lifeboard:boards')).toBe('[]')
    })
  })
})
