import { expect, it, vi } from 'vitest'
import { toValue } from 'vue'
import { createHead, setHeadInjectionHandler } from '@unhead/vue'
import { useGoogleTagManager } from './../../src/runtime/composables/googleTagManager'

vi.mock('#imports', () => ({ useStyles: () => vi.importActual('../../../../nuxt-script/src/runtime/composables/useStyles') }))

it('should add a Google Tag Manager entry in the head', () => {
  const head = createHead()
  setHeadInjectionHandler(() => head)

  const id = 'ga-xxxxxxxxx-x'
  useGoogleTagManager({ id })

  // since we're skipping early connection and using 'idle' trigger, the only thing appended to the head is the 'setup' script.
  expect(toValue(toValue(head.headEntries()[head.headEntries().length - 1].input).script)![0]).toEqual(expect.objectContaining({ key: 'setup' }))
  expect(head.headEntries().length).toEqual(3)
})

it('should throw an error if "id" is not passed in', () => {
  const head = createHead()
  setHeadInjectionHandler(() => head)

  expect(() => useGoogleTagManager({})).toThrowError('[Nuxt Scripts] google-tag-manager is missing required options: id')
})
