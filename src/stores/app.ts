import { Game, newGame, TokenColor } from '@/types/gamestate'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
  }),
})

export const useGameStore = defineStore('game', () => {
  const game: Ref<Game> = ref(newGame())

  function tokenStash(color: TokenColor): number {
    return game.value.tokenPiles.get(color) ?? 0
  }

  return { }
})
