import $socket from "@/socket";
import { GameState, lookupTokens, Player, TokenPiles } from "@/types/gamestate";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  // Properties
  const lobbyPlayers: Ref<string[]> = ref([]);
  const username: Ref<string | null> = ref(null);

  // Actions
  function attemptJoinLobby(_username: string) {
    $socket.attemptJoinLobby(_username);
  }

  function startGame() {
    $socket.startGame();
  }

  // Getters
  const isJoined = computed(() => {
    return username.value != null;
  });

  onMounted(() => {
    $socket.onLobbyJoinSuccess((_username) => {
      username.value = _username;
    });

    $socket.onLobbyUpdate((players) => {
      lobbyPlayers.value = players;
    });

    $socket.connect();
  });

  onBeforeUnmount(() => {
    console.log("Disconnecting socket before unmounting store");
    $socket.disconnect();
  });

  return {
    lobbyPlayers,
    username,
    attemptJoinLobby,
    startGame,
    isJoined,
  };
});

export const useGameStore = defineStore("game", () => {
  const game: Ref<GameState | null> = ref(null);

  //Helpers

  // Actions

  // Getters
  const isGameStarted = computed(() => {
    return game.value != null;
  });

  const getPlayers = computed(() => {
    let playersMap = game.value?.players ?? {};
    let players = Object.values(playersMap) as Player[];

    players.sort((a, b) => a.turnOrder - b.turnOrder);

    return players;
  });

  // Gets the actual player of the user
  const getPlayer = computed(() => {
    let players = game.value?.players ?? {};
    let playersMap: Map<string, Player> = new Map(Object.entries(players))
    return playersMap.get($socket.getGuid()) ?? null
  })

  const getCurrentPlayer = computed(() => {
    return game.value?.currentPlayer ?? "";
  });

  const getBankTokens = computed(() => {
    return (color: string) => {
      let tokens = game.value?.tokenBank ?? [];
      return lookupTokens(tokens, color);
    };
  });

  const getShownDevelopments = computed(() => {
    return (deckIx: number) => {
      return game.value?.decks[deckIx][1] ?? [];
    };
  });

  // Event hooks
  onMounted(() => {
    $socket.onStateUpdate((update) => {
      // If this is the first state update the client is recieving, send an ack.
      if (game.value == null) {
        $socket.sendReady();
      }

      game.value = update;
    });
  });

  return {
    // Exporting game for debugging reasons
    game,

    // Actions
    //Getters
    isGameStarted,

    getPlayer,
    getCurrentPlayer,
    getPlayers,
    getBankTokens,
    getShownDevelopments,
  };
});

export enum SelectDevelopmentMode {
  Purchase,
  Reserve,
  None,
}
export const useUiStore = defineStore("ui", () => {
  const selectedTokens: Ref<Set<String> | null> = ref(null);
  const selectAmount: Ref<number> = ref(0);

  // (deckIndex, developmentId)
  const selectedDevelopment: Ref<[number, number] | null> = ref(null);
  const selectDevelopmentMode: Ref<SelectDevelopmentMode> = ref(
    SelectDevelopmentMode.None,
  );

  const goldAllocation: Ref<TokenPiles> = 
    ref([
      ["Black", 0],
      ["White", 0],
      ["Blue", 0],
      ["Green", 0],
      ["Red", 0],
    ]);

  //Getters
  const isSelectingTokens = computed(() => {
    return selectedTokens.value != null;
  });

  const getSelectedTokens = computed(() => {
    let tokens = selectedTokens.value ?? new Set();
    return tokens;
  });

  const remainingTokens = computed(() => {
    if (selectedTokens.value) {
      return selectAmount.value - selectedTokens.value.size;
    } else {
      return -1;
    }
  });

  const getSelectDevelopmentMode = computed(() => {
    return selectDevelopmentMode.value;
  });

  const isDevelopmentSelected = computed(() => {
    return (devId: number) => {
      if (selectedDevelopment.value) {
        return selectedDevelopment.value[1] == devId;
      } else {
        return false;
      }
    };
  });

  const doneSelectingDevelopment = computed(() => {
    if (selectedDevelopment.value) {
      return (
        selectedDevelopment.value[0] != -1 && selectedDevelopment.value[1] != -1
      );
    } else {
      return false;
    }
  });

  const getAllocatedGold = computed(() => {
    return (color: string) => {
      return lookupTokens(goldAllocation.value, color)
    }
  })

  //Actions
  function cancelAction() {
    selectedTokens.value = null;
    selectAmount.value = 0;
    selectedDevelopment.value = null;
    selectDevelopmentMode.value = SelectDevelopmentMode.None;
    goldAllocation.value = [
      ["Black", 0],
      ["White", 0],
      ["Blue", 0],
      ["Green", 0],
      ["Red", 0],
    ]
  }

  function beginTokenSelect(amount: number) {
    if (amount == 1 || amount == 3) {
      selectedTokens.value = new Set();
      selectAmount.value = amount;
    }
  }

  function toggleTokenSelected(color: string) {
    if (selectedTokens.value) {
      if (selectedTokens.value.has(color)) {
        selectedTokens.value.delete(color);
      } else if (selectedTokens.value.size < selectAmount.value) {
        // Only add selection if less than the desired amount are selected
        selectedTokens.value.add(color);
      }
    }
  }

  function submitAcquireTokens() {
    if (selectedTokens.value) {
      $socket.sendAction("AcquireTokens", Array.from(selectedTokens.value));
      selectedTokens.value = null;
      selectAmount.value = 0;
    }
    cancelAction()
  }

  function beginDevelopmentSelect(mode: SelectDevelopmentMode) {
    selectDevelopmentMode.value = mode;
    selectedDevelopment.value = [-1, -1];
  }

  function toggleDevelopmentSelected(deckIx: number, devId: number) {
    if (selectedDevelopment.value) {
      if (selectedDevelopment.value[1] == devId) {
        selectedDevelopment.value = [-1, -1];
      } else {
        selectedDevelopment.value = [deckIx, devId];
      }
    }
  }

  function submitPurchaseAction() {
    if (
      selectedDevelopment.value &&
      doneSelectingDevelopment.value &&
      selectDevelopmentMode.value == SelectDevelopmentMode.Purchase
    ) {
      let [deckIx, devId] = selectedDevelopment.value;
      $socket.sendAction("PurchaseDevelopment", [
        deckIx,
        devId,
        goldAllocation.value,
      ]);
    }
    cancelAction()
  }

  function submitReserveAction() {
    if (
      selectedDevelopment.value &&
      doneSelectingDevelopment.value &&
      selectDevelopmentMode.value == SelectDevelopmentMode.Reserve
    ) {
      $socket.sendAction("ReserveDevelopment", selectedDevelopment.value);
    }
    cancelAction()
  }

  function allocateGold(color: string, deallocate = false) {
    //Doing a "dumb" for-loop because I don't feel 
    console.log("allocating gold ", color)
    // like googling map for the millionth time
    for (let i = 0; i < goldAllocation.value.length; i++) {
      if (goldAllocation.value[i][0] == color) {
        let delta = deallocate ? -1 : 1;
        console.log(delta)
        goldAllocation.value[i][1] += delta  
      }
    }
  }

  return {
    //Getters
    isSelectingTokens,
    getSelectedTokens,
    remainingTokens,

    getSelectDevelopmentMode,
    isDevelopmentSelected,
    doneSelectingDevelopment,

    getAllocatedGold,

    // Actions
    cancelAction,
    beginTokenSelect,
    toggleTokenSelected,
    submitAcquireTokens,

    beginDevelopmentSelect,
    toggleDevelopmentSelected,
    submitPurchaseAction,
    submitReserveAction,

    allocateGold,
  };
});
