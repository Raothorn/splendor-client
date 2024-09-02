<template>
  <v-sheet
    class="d-flex align-center ma-5 pa-1"
    :color="isSelected ? 'grey-darken-4' : 'surface-light'"
    :elevation="ui.isSelectingTokens() ? 5 : 0"
    :border="ui.isSelectingTokens()"
    rounded
  >
    <img :src="imgUrl" width="50" />
    <h3 class="ml-5">{{ amount }}</h3>
  </v-sheet>
</template>

<script setup lang="ts">
import { useGameStore, useUiStore } from "@/stores/appStores";

const props = defineProps<{
  color: string;
}>();

const game = useGameStore();
const ui = useUiStore();

const amount = computed(() => {
  return game.getBankTokens(props.color);
});

const isSelected = computed(() => {
  if (ui.selectedTokens != null) {
    return ui.selectedTokens.has(props.color);
  } else {
    return false;
  }
});

const colorString = computed(() => {
  return props.color.toLowerCase();
});

const imgUrl = computed(() => {
  return `./public/assets/token_${props.color.toLowerCase()}.png`;
});
</script>
