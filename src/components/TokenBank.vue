<template>
  <v-card class="fill-height" color="surface-light">
    <v-card-title class="text-center">
      Tokens
    </v-card-title>
    <v-card-text>
      <div class="d-flex flex-column align-center justify-space-between">
        <div v-for="color in tokenColors">
          <TokenPile @click="tokenPileClicked(color)" :color="color"></TokenPile>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useGameStore, useUiStore } from "@/stores/appStores";
import TokenPile from "./TokenPile.vue";
import { tokenColors } from "@/types/gamestate";
import $socket from "@/socket";

const game = useGameStore();
const ui = useUiStore();

function tokenPileClicked(color: string) {
  if (ui.selectedTokens != null) {
    // Toggle whether the token pile is selected
    if (ui.selectedTokens.has(color)) {
      ui.selectedTokens.delete(color);
    } else if (ui.selectedTokens.size < ui.selectAmount) {
      ui.selectedTokens.add(color);
    }
  }
}

function acquireTokens() {
  if (ui.selectedTokens != null && ui.selectAmount != 0) {
    // Check if the appropriate number of tokens are selected
    if (ui.selectAmount == ui.selectedTokens.size) {
      $socket.sendAction("AcquireTokensAction", Array.from(ui.selectedTokens));
    } else {
      console.log("You have not selected the correct number of tokens");
    }
  }
}
</script>
