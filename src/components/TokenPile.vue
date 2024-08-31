<template>
  <v-card
    class="text-center"
    :color="isSelected ? 'surface-variant' : 'surface-light'"
  >
    <v-card-title>
      <v-icon icon="mdi-circle" :color="colorString"></v-icon>
      <span class="ml-5"> {{ amount }} </span>
    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import { useGameStore, useUiStore } from "@/stores/appStores";
import { TokenColor } from "@/types/gamestate";

const props = defineProps<{
  color: TokenColor;
}>();

const game = useGameStore();
const ui = useUiStore();

const colorString = computed(() => {
  if (props.color == TokenColor.Black) return "black";
  else if (props.color == TokenColor.White) return "white";
  else if (props.color == TokenColor.Blue) return "blue";
  else if (props.color == TokenColor.Green) return "green";
  else if (props.color == TokenColor.Red) return "red";
});

const amount = computed(() => {
  return game.getNumTokens(props.color);
});

const isSelected = computed(() => {
  if (ui.selectedTokens != null) {
    return ui.selectedTokens.has(props.color);
  } else {
    return false;
  }
});
</script>
