<template>
  <v-sheet class="fill-height" color="surface" rounded>
    <div class="fill-height d-flex flex-column justify-space-evenly">
      <div class="btn-container" v-if="ui.isSelectingTokens()">
        <v-btn @click="ui.acquireTokens" block variant="tonal">Acquire tokens</v-btn>
      </div>
      <div class="btn-container" v-else-if="ui.isPurchasingDevelopment">
        <v-btn @click="ui.submitPurchaseDevelopment" block variant="tonal">Purchase development</v-btn>
      </div>
      <div class="btn-container" v-else>
        <v-btn block @click="dialogActive = true"  variant="tonal">
          Choose Action
        </v-btn>
      </div>
    </div>
  </v-sheet>
  <v-dialog v-model="dialogActive" max-width="500">
    <v-card>
      <v-card-title class="text-center">Choose action</v-card-title>
      <v-card-actions>
        <div class="w-100 d-flex flex-column justify-space-evenly">
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
import { useUiStore } from "@/stores/appStores";

const ui = useUiStore();

const dialogActive = ref(false);

function purchaseDevelopment() {
  ui.isPurchasingDevelopment = true
  ui.selectedDevelopment = -1
  dialogActive.value = false;
}

function take3() {
  ui.selectedTokens = new Set<String>();
  ui.selectAmount = 3;
  dialogActive.value = false;
}

function take2() {
  ui.selectedTokens = new Set<String>();
  ui.selectAmount = 1;
  dialogActive.value = false;
}

</script>

<style scoped>
.v-btn {
  margin-bottom: 5px;
}

.btn_container {
  width: 100%;
}

</style>
