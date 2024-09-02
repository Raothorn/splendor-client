import { Game, lookupTokens } from "@/types/gamestate";
import { defineStore } from "pinia";
import $socket from "@/socket";

export const useGameStore = defineStore("game", () => {
  const game: Ref<Game | null> = ref(null);

  onMounted(() => {
    $socket.onStateUpdate((newState: Game) => {
      console.log("updating state", newState);
      game.value = newState;
    });

    $socket.connect();
  });

  onBeforeUnmount(() => {
    $socket.disconnect();
  });

  const getBankTokens = computed(() => {
    return (color: string) => {
      let piles = game.value?._tokenBank ?? [];
      return lookupTokens(piles, color);
    };
  });

  const getPlayerTokens = computed(() => {
    return (color: string) => {
      let piles = game.value?._player.tokens ?? [];
      return lookupTokens(piles, color);
    };
  });

  const getPlayerDevelopmentValue = computed(() => {
    return (color: string) => {
      let tokens = game.value?._player.developments ?? [];
      return tokens.filter(t => t.developmentGem == color).length
    }
  })

  const getDevelopmentCards = computed(() => {
    return (deckIx: number) => {
      return game.value?._developmentDecks[deckIx][1] ?? [];
    }
  });

  const unshownDevelopmentCardsAmt = computed(() => {
    return (deckIx: number) => {
      let deck = game.value?._developmentDecks[deckIx][0] ?? []
      return deck.length
    }
  })

  // Exporting game for debugging purposes, but shouldn't be accessed
  return {
    game,
    getBankTokens,
    getPlayerTokens,
    getDevelopmentCards,
    getPlayerDevelopmentValue,
    unshownDevelopmentCardsAmt,
  };
});

export const useUiStore = defineStore("ui", () => {
  const selectedTokens: Ref<Set<String> | null> = ref(null);
  const selectAmount: Ref<number> = ref(0);

  const isSelectingDevelopment: Ref<boolean> = ref(false);
  const selectedDevelopment: Ref<number> = ref(-1);


  function isSelectingTokens() {
    return selectedTokens.value != null;
  }

  function submitAcquireTokens() {
    if (selectedTokens.value) {
      $socket.sendAction(
        "AcquireTokensAction",
        Array.from(selectedTokens.value),
      );
      selectedTokens.value = null;
      selectAmount.value = 0;
    }
  }

  function submitPurchaseDevelopment() {
    if (isSelectingDevelopment.value && selectedDevelopment.value != -1) {
      $socket.sendAction("PurchaseDevelopmentAction", [0, selectedDevelopment.value])
      isSelectingDevelopment.value = false
      selectedDevelopment.value = -1
    }
  }

  return {
    selectedTokens,
    selectAmount,
    selectedDevelopment,
    isPurchasingDevelopment: isSelectingDevelopment,
    submitPurchaseDevelopment,
    isSelectingTokens,
    acquireTokens: submitAcquireTokens,
  };
});
