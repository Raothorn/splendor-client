import { Game, lookupTokens, newGame } from "@/types/gamestate";
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
      let piles = game.value?._tokenPiles ?? [];
      return lookupTokens(piles, color)
    };
  });

  const getPlayerTokens = computed(() => {
    return (color: string) => {
      let piles = game.value?._player._playerTokens ?? [];
      return lookupTokens(piles, color)
    }
  })

  // Exporting game for debugging purposes, but shouldn't be accessed
  return { game, getNumTokens: getBankTokens, getPlayerTokens };
});

export const useUiStore = defineStore("ui", () => {
  const selectedTokens: Ref<Set<String> | null> = ref(null);
  const selectAmount: Ref<number> = ref(0);

  const messages: Ref<string[]> = ref([]);

  function isSelectingTokens() {
    return selectedTokens.value != null;
  }

  function acquireTokens() {
    if (selectedTokens.value) {
      $socket.sendAction(
        "AcquireTokensAction",
        Array.from(selectedTokens.value),
      );
      selectedTokens.value = null;
      selectAmount.value = 0;
    }
  }

  return { selectedTokens, selectAmount, isSelectingTokens, acquireTokens };
});
