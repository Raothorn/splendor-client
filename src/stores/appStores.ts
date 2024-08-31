import { Game, newGame, TokenColor } from '@/types/gamestate'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const game = ref(newGame())

  const getNumTokens = computed(() => {
    return (color: TokenColor) => game.value.tokenPiles.get(color) ?? 0
  })

  return { getNumTokens  }
})

export const useUiStore = defineStore('ui', () => {
  const selectedTokens: Ref<Set<TokenColor> | null> = ref(null)
  const selectType: Ref<number> = ref(0)

  return { selectedTokens, selectType }
})