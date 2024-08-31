<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="justify-center">
        <div class="text-center">Tokens</div>
      </v-card-title>
      <v-card-text class="w-100 d-flex justify-center">
        <div class="mx-3" v-for="color in allColors">
          <TokenPile
            @click="tokenPileClicked(color)"
            :color="color"
          ></TokenPile>
        </div>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn-toggle v-model="ui.selectType" color="primary" group>
          <v-btn value=1 > Select 3x1 Tokens </v-btn>
          <v-btn value=2 > Select 1x2 Tokens </v-btn>
        </v-btn-toggle>
        <v-btn @click="acquireTokens">
          Acquire Tokens
        </v-btn> <!-- <v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useGameStore, useUiStore } from "@/stores/appStores";
import { TokenColor } from "@/types/gamestate";
import TokenPile from "./TokenPile.vue";

const game = useGameStore();
const ui = useUiStore();

function tokenPileClicked(color: TokenColor) {
  if (ui.selectedTokens != null) {
    // Toggle whether the token pile is selected
    if (ui.selectedTokens.has(color)) {
      ui.selectedTokens.delete(color);
    } else {
      ui.selectedTokens.add(color);
    }
  }
}

function acquireTokens() {
  if (ui.selectedTokens != null && ui.selectType != 0) {
    // Check if the appropriate number of tokens are selected
   if (ui.selectType == ui.selectedTokens.size) {
    console.log("Correct")
   } else {
    console.log("You have not selected the correct number of tokens")
   }

  }
}

const allColors = [
  TokenColor.Black,
  TokenColor.Blue,
  TokenColor.Red,
  TokenColor.White,
  TokenColor.Green,
];
</script>
