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
  <v-dialog v-model="allocateGoldDialog" max-width="500">
    <v-card>
      <v-card-title>Allocate Gold</v-card-title>
      <v-card-actions>
        <div class="d-flex flex-column justify-center w-100">
          <div class="d-flex justify-center w-100 my-2">
            <div class="d-flex flex-column justify-center align-center mr-2">
              <img class="token-icon-med my-2" :src="getTokenImgUrl('Gold')" />
              <h3>{{ goldAmt }}</h3>
            </div>
            <div v-for="color in tokenColors" class="d-flex flex-column">
              <div class="d-flex flex-column align-center">
                <v-btn
                  @click="ui.allocateGold(color, true)"
                  icon="mdi-minus-circle-outline"
                  :disabled="ui.getAllocatedGold(color) <= 0"
                ></v-btn>
                <img class="token-icon-small" :src="getTokenImgUrl(color)" />
                <v-btn
                  @click="ui.allocateGold(color)"
                  icon="mdi-plus-circle-outline"
                  :disabled="goldAmt <= 0"
                ></v-btn>
                <h4>{{ ui.getAllocatedGold(color) }}</h4>
              </div>
            </div>
          </div>
          <div class="allocate-gold-actions">
            <v-btn @click="submitPurchase" variant="tonal"> Purchase </v-btn>
            <v-btn @click="cancelPurchase" class="" variant="tonal"> Cancel </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {
  SelectDevelopmentMode,
  useAppStore,
  useGameStore,
  useUiStore,
} from "@/stores/appStores";
import { lookupTokens, tokenColors } from "@/types/gamestate";

const game = useGameStore();
const app = useAppStore();
const ui = useUiStore();

const chooseActionDialog = ref(false);
const allocateGoldDialog = ref(false);

const buttonData = computed(() => {
  let onClick = () => {};
  let disabled = false;
  let contents = "hi";
  let cancelButton = false;

  if (ui.isSelectingTokens) {
    if (ui.remainingTokens > 0) {
      contents = `Select ${ui.remainingTokens} more tokens`;
      disabled = true;
      cancelButton = true
    } else {
      contents = "Acquire tokens";
      onClick = ui.submitAcquireTokens;
    }
  } else if (ui.getSelectDevelopmentMode == SelectDevelopmentMode.Purchase) {
    if (ui.doneSelectingDevelopment) {
      contents = "Purchase Development";
      onClick = () => (allocateGoldDialog.value = true);
    } else {
      contents = "Select development to purchase";
      disabled = true;
      cancelButton = true
    }
  } else if (ui.getSelectDevelopmentMode == SelectDevelopmentMode.Reserve) {
    if (ui.doneSelectingDevelopment) {
      contents = "Reserve development";
      onClick = () => ui.submitReserveAction();
    } else {
      contents = "Select development to reserve";
      disabled = true;
      cancelButton = true
    }
  } else if (yourTurn()) {
    contents = "Your turn Choose action";
    onClick = () => (chooseActionDialog.value = true);
  } else {
    contents = "Waiting...";
    disabled = true;
  }

  return {
    onClick: onClick,
    disabled: disabled,
    contents: contents,
    cancelButton: cancelButton,
  };
});

const goldAmt = computed(() => {
  let playerGold = 0;
  let player = game.getPlayer;
  if (player) {
    playerGold = lookupTokens(player.tokens, "Gold");
  }

  for (let color of tokenColors) {
    playerGold -= ui.getAllocatedGold(color);
  }
  return playerGold;
});

function yourTurn() {
  return game.getCurrentPlayer == app.username;
}

function cancelPurchase() {
  ui.cancelAction()
  allocateGoldDialog.value = false
}

function submitPurchase() {
  ui.submitPurchaseAction();
  allocateGoldDialog.value = false;
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

function getTokenImgUrl(color: string) {
  return `/assets/token_${color.toLowerCase()}.png`;
}
</script>

<style scoped>
.v-card-title {
  text-align: center;
}
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
.token-icon-med {
  display: block;
  width: 40px;
  height: 40px;
}
.token-icon-small {
  display: block;
  width: 20px;
  height: 20px;
}

.allocate-gold-actions {
  display: flex;
  justify-content: center;
}
.allocate-gold-actions .v-btn {
  margin: 0px 4px;
}
</style>
