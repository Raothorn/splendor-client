import { defineStore } from "pinia";
import $socket from "@/socket";

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
