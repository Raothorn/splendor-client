import $socket from "@/socket"
import { GameState, lookupTokens, Player } from "@/types/gamestate"
import { defineStore } from "pinia"

export const useGameStore = defineStore("game", () => {
  const game: Ref<GameState | null> = ref(null)

  //Helpers

  // Actions

  // Getters
  const isGameStarted = computed(() => {
    return game.value != null
  })

  const isGameOver = computed(() => {
    return gameOverSummary.value != null
  })

  const gameOverSummary = computed(() => {
    return game.value?.gameOverSummary ?? null
  })

  const messageLog = computed((): string[] => {
    return game.value?.messageLog ?? []
  })

  const getPlayers = computed(() => {
    let playersMap = game.value?.players ?? {}
    let players = Object.values(playersMap) as Player[]

    players.sort((a, b) => a.turnOrder - b.turnOrder)

    return players
  })

  // Gets the actual player of the user
  const getUserPlayer = computed(() => {
    let players = game.value?.players ?? {}
    let playersMap: Map<string, Player> = new Map(Object.entries(players))
    return playersMap.get($socket.getGuid()) ?? null
  })

  const getCurrentTurnPlayer = computed(() => {
    return game.value?.currentPlayer ?? ""
  })

  const getBankTokens = computed(() => {
    return (color: string) => {
      let tokens = game.value?.tokenBank ?? []
      return lookupTokens(tokens, color)
    }
  })

  // TODO remove 'get' from getters
  const getShownDevelopments = computed(() => {
    return (deckIx: number) => {
      return game.value?.decks[deckIx][1] ?? []
    }
  })

  const nobles = computed(() => {
    return game.value?.nobles ?? []
  })
  // Event hooks
  onMounted(() => {
    $socket.onStateUpdate((update) => {
      // If this is the first state update the client is recieving, send an ack.
      if (game.value == null) {
        $socket.sendReady()
      }

      game.value = update
    })
  })

  return {
    // Exporting game for debugging reasons
    game,

    messageLog,
    // Actions
    //Getters
    isGameStarted,
    isGameOver,
    gameOverSummary,
    getUserPlayer,
    getCurrentTurnPlayer,
    getPlayers,
    getBankTokens,
    getShownDevelopments,
    nobles,
  }
})
