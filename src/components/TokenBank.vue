<template>
  <v-sheet class="token-piles" color="surface-light">
    <template v-for="color in tokenColors">
      <TokenPile @click="tokenClicked(color)" :color="color"></TokenPile>
    </template>
    <TokenPile color="Gold"></TokenPile>
  </v-sheet>
</template>

<script setup lang="ts">
import { useUiStore } from "@/stores/uiStore";
import TokenPile from "./TokenPile.vue";
import { tokenColors } from "@/types/gamestate";

const ui = useUiStore();

function tokenClicked(color: string) {
  ui.toggleTokenSelected(color)
}

</script>

<style scoped>
/* small screens and up */
.token-piles{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  height: 100%;
  padding: 0px 100px;
}
.selected {
  background-color: rgba(255, 255, 255, 0.2)
}
</style>