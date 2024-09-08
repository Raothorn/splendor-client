<template>
  <div class="d-flex flex-column fill-height">
    <v-btn
      @click="buttonData.onClick"
      class="action-button"
      block
      :disabled="buttonData.disabled"
    >
      <div class="button-contents">
        <h3>{{ buttonData.contents }}</h3>
      </div>
    </v-btn>
    <v-btn 
      v-if="buttonData.cancelButton"
      @click="ui.cancelAction"
      class="cancel-button"
    >
    Cancel
    </v-btn>
  </div>

  <v-dialog v-model="chooseActionDialog" max-width="500">
    <v-card>
      <v-card-title>Choose action</v-card-title>
      <v-card-actions>
        <div class="action-option-buttons">
          <v-btn block variant="tonal" @click="purchaseDevelopment">
            Purchase Development
          </v-btn>
          <v-btn block variant="tonal" @click="reserveDevelopment">
            Reserve Development
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
import { useAppStore } from "@/stores/appStores";
import { useGameStore } from "@/stores/gameStore";
import { SelectDevelopmentMode, useUiStore } from "@/stores/uiStore";

const game = useGameStore();
const app = useAppStore();
const ui = useUiStore();

const chooseActionDialog = ref(false);

const buttonData = computed(() => {
  let onClick = () => {};
  let disabled = false;
  let contents = "hi";
  let cancelButton = true;

  if (ui.isSelectingTokens) {
    if (ui.remainingTokens > 0) {
      contents = `Select ${ui.remainingTokens} more tokens`;
      disabled = true;
    } else {
      contents = "Acquire tokens";
      onClick = ui.submitAcquireTokens;
    }
  } else if (ui.getSelectDevelopmentMode == SelectDevelopmentMode.Purchase) {
    if (ui.doneSelectingDevelopment) {
      if (ui.canAffordSelectedDevelopment) {
        contents = "Purchase Development";
        onClick = () => ui.beginAllocatingGold()
      } else {
        contents = "Cannot afford development. Select another."
        disabled = true
      }
    } else {
      contents = "Select development to purchase";
      disabled = true;
    }
  } else if (ui.getSelectDevelopmentMode == SelectDevelopmentMode.Reserve) {
    if (ui.doneSelectingDevelopment) {
      contents = "Reserve development";
      onClick = () => ui.submitReserveAction();
    } else {
      contents = "Select development to reserve";
      disabled = true;
    }
  } else if (yourTurn()) {
    contents = "Your turn Choose action";
    onClick = () => (chooseActionDialog.value = true);
    cancelButton = false;
  } else {
    contents = "Waiting...";
    disabled = true;
    cancelButton = false;
  }

  return {
    onClick: onClick,
    disabled: disabled,
    contents: contents,
    cancelButton: cancelButton,
  };
});


function yourTurn() {
  return game.getCurrentTurnPlayer == app.username;
}


function purchaseDevelopment() {
  ui.beginDevelopmentSelect(SelectDevelopmentMode.Purchase);
  chooseActionDialog.value = false;
}

function reserveDevelopment() {
  ui.beginDevelopmentSelect(SelectDevelopmentMode.Reserve);
  chooseActionDialog.value = false;
}

function take3() {
  ui.beginTokenSelect(3);
  chooseActionDialog.value = false;
}

function take2() {
  ui.beginTokenSelect(1);
  chooseActionDialog.value = false;
}

</script>

<style scoped>
.action-button {
  max-height: 100%;

  border-radius: 5px;
  border: 2px solid black;
  /* background-color: green; */
  /* opacity: 0.5; */
}
.cancel-button {
  border-radius: 5px;
  border: 2px solid black;
  height: 40px;
}
.action-option-buttons {
  width: 100%;
}
.action-option-buttons .v-btn {
  margin: 2px 0px;
}
.button-contents h3 {
  text-wrap: wrap;
}

.allocate-gold-actions {
  display: flex;
  justify-content: center;
}
.allocate-gold-actions .v-btn {
  margin: 0px 4px;
}
</style>
