<template>
  <v-btn
    v-if="ui.isSelectingTokens"
    @click="ui.submitAcquireTokens"
    class="action-button"
    :disabled="ui.remainingTokens > 0"
    block
  >
    <div class="button-contents">
      <template v-if="ui.remainingTokens == 0">
        <h3>Acquire</h3>
        <h3>Tokens</h3>
      </template>
      <template v-else>
        <h3>Select {{ ui.remainingTokens }}</h3>
        <h3>more tokens</h3>
      </template>
    </div>
  </v-btn>
  <v-btn
    v-else-if="ui.isSelectingDevelopment"
    @click="ui.submitPurchaseDevelopment"
    class="action-button"
    block
    :disabled="!ui.doneSelectingDevelopment"
  >
    <div class="button-contents">
      <template v-if="ui.doneSelectingDevelopment">
        <h3>Purchase</h3>
        <h3>development</h3>
      </template>
      <template v-else>
        <h3>Select</h3>
        <h3>development</h3>
      </template>
    </div>
  </v-btn>
  <v-btn
    v-else-if="yourTurn"
    @click="dialogActive = true"
    class="action-button"
    block
  >
    <div class="button-contents">
      <h2>Your turn</h2>
      <h3>Choose action</h3>
    </div>
  </v-btn>
  <v-btn v-else class="action-button" disabled block>
    <h3>Waiting...</h3>
  </v-btn>

  <v-dialog v-model="dialogActive" max-width="500">
    <v-card>
      <v-card-title class="text-center">Choose action</v-card-title>
      <v-card-actions>
        <div class="action-option-buttons">
          <v-btn block variant="tonal" @click="purchaseDevelopment">
            Purchase Development
          </v-btn>
          <v-btn block variant="tonal" @click="take3">
            Take 3 gem tokens of different colors
          </v-btn>
          <v-btn block variant="tonal" @click="take2">
            Take 2 gem tokens of the same color
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAppStore, useGameStore, useUiStore } from "@/stores/appStores";

const game = useGameStore();
const app = useAppStore();
const ui = useUiStore();

const dialogActive = ref(false);

const yourTurn = computed(() => {
  console.log(game.getCurrentPlayer, app.username);
  return game.getCurrentPlayer == app.username;
});

function purchaseDevelopment() {
  ui.beginDevelopmentSelect();
  dialogActive.value = false;
}

function take3() {
  ui.beginTokenSelect(3);
  dialogActive.value = false;
}

function take2() {
  ui.beginTokenSelect(1);
  dialogActive.value = false;
}
</script>

<style scoped>
.action-button {
  height: 100%;

  border-radius: 0px;
  /* background-color: green; */
  /* opacity: 0.5; */
}
.action-option-buttons {
  width: 100%;
}
.action-option-buttons .v-btn {
  margin: 2px 0px;
}
</style>
