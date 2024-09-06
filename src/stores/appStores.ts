import $socket from "@/socket";
import { GameState, lookupTokens, Player } from "@/types/gamestate";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  // Properties
  const lobbyPlayers: Ref<string[]> = ref([])
  const username: Ref<string | null> = ref(null)

  // Actions
  function attemptJoinLobby(_username: string) {
    $socket.attemptJoinLobby(_username)
  }

  function startGame() {
    $socket.startGame()
  }

  // Getters
  const isJoined = computed(() => {
    return username.value != null
  })


  onMounted(() => {
    $socket.onLobbyJoinSuccess((_username) => {
      username.value = _username
    })

    $socket.onLobbyUpdate((players) => {
      lobbyPlayers.value = players
    })

    $socket.connect()
  })

  onBeforeUnmount(() => {
    console.log("Disconnecting socket before unmounting store")
    $socket.disconnect()
  })

  return {
    lobbyPlayers,
    username,
    attemptJoinLobby,
    startGame,
    isJoined,
  };
});

export const useGameStore = defineStore("game", () => {
  const game: Ref<GameState | null> = ref(null)

  //Helpers

  // Actions

  // Getters
  const isGameStarted = computed(() => {
    return game.value != null
  })

  const getPlayers = computed(()  => {
    let playersMap = game.value?.players ?? {}
    let players =  Object.values(playersMap) as Player[]

    players.sort((a, b) => a.turnOrder - b.turnOrder)

    return players
  })

  const getCurrentPlayer = computed(() => {
    return game.value?.currentPlayer ?? ""
  })

  const getBankTokens = computed(() => {
    return (color: string) => {
      let tokens = game.value?.tokenBank ?? []
      return lookupTokens(tokens, color)
    }
  })

  const getShownDevelopments = computed(() => {
    return (deckIx: number) => {
      return game.value?.decks[deckIx][1] ?? [];
    }
  })

  // Event hooks
  onMounted(() => {
    $socket.onStateUpdate((update) => {
      // If this is the first state update the client is recieving, send an ack.
      if (game.value == null) {
        $socket.sendReady()
      }

      game.value = update;
    })
  })

  return {
    // Exporting game for debugging reasons
    game,

    // Actions
    //Getters
    isGameStarted,

    getCurrentPlayer,
    getPlayers,
    getBankTokens,
    getShownDevelopments
  }
})

export const useUiStore = defineStore("ui", () => {
  const selectedTokens: Ref<Set<String> | null> = ref(null);
  const selectAmount: Ref<number> = ref(0);

  // (deckIndex, developmentId)
  const selectedDevelopment: Ref<[number, number] | null> = ref(null);

  //Getters
  const isSelectingTokens = computed(() => {
    return selectedTokens.value != null;
  })

  const getSelectedTokens = computed(() => {
    let tokens = selectedTokens.value ?? new Set()
    return tokens
  })

  const remainingTokens = computed(() => {
    if (selectedTokens.value) {
      return selectAmount.value - selectedTokens.value.size
    } else {
      return -1
    }
  })

  const isSelectingDevelopment = computed(() => {
    return selectedDevelopment.value != null;
  })

  const isDevelopmentSelected = computed(() => {
    return (devId: number) => {
      if (selectedDevelopment.value) {
        return selectedDevelopment.value[1] == devId
      } else {
        return false
      }
    }
  })

  const doneSelectingDevelopment = computed(() => {
    if (selectedDevelopment.value) {
      return selectedDevelopment.value[0] != -1
            && selectedDevelopment.value[1] != -1
    } else {
      return false
    }
  })

  //Actions
  function beginTokenSelect(amount: number) {
    if (amount == 1 || amount == 3) {
      selectedTokens.value = new Set()
      selectAmount.value = amount
    }
  }

  function toggleTokenSelected(color: string) {
    if (selectedTokens.value) {
      if (selectedTokens.value.has(color)) {
        selectedTokens.value.delete(color)
      } else if (selectedTokens.value.size < selectAmount.value) {
        // Only add selection if less than the desired amount are selected
        selectedTokens.value.add(color)
      }
    }
  }

  function submitAcquireTokens() {
    if (selectedTokens.value) {
      $socket.sendAction(
        "AcquireTokens",
        Array.from(selectedTokens.value),
      );
      selectedTokens.value = null;
      selectAmount.value = 0;
    }
  }

  function beginDevelopmentSelect() {
    selectedDevelopment.value = [-1, -1]
  }

  function toggleDevelopmentSelected(deckIx: number, devId: number) {
    if (selectedDevelopment.value) {
      if (selectedDevelopment.value[1] == devId) {
        selectedDevelopment.value = [-1, -1]
      } else {
        selectedDevelopment.value = [deckIx, devId]
      }
    }
  }

  function submitPurchaseDevelopment() {
    if (selectedDevelopment.value && doneSelectingDevelopment.value) {
      $socket.sendAction("PurchaseDevelopment", selectedDevelopment.value)
      selectedDevelopment.value = null;
    }
  }

  return {
    //Getters
    isSelectingTokens,
    getSelectedTokens,
    remainingTokens,

    isSelectingDevelopment,
    isDevelopmentSelected,
    doneSelectingDevelopment,
    // Actions
    beginTokenSelect,
    toggleTokenSelected,
    submitAcquireTokens,

    beginDevelopmentSelect,
    toggleDevelopmentSelected,
    submitPurchaseDevelopment,
  };
});
