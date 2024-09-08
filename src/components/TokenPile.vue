<template>
  <div class="token-pile" :class="isSelected ? 'selected' : ''">
    <img class="token-icon" :src="imgUrl"  />
    <h3 class="ml-5">{{ amount }}</h3>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { useUiStore } from '@/stores/uiStore';


const props = defineProps<{ color: string;
}>();

const game = useGameStore();
const ui = useUiStore();

const amount = computed(() => {
  return game.getBankTokens(props.color);
});

const isSelected = computed(() => {
  return ui.getSelectedTokens.has(props.color)
});

const imgUrl = computed(() => {
  return `./assets/token_${props.color.toLowerCase()}.png`;
});
</script>


<style scoped>
/* small screens and up */
.token-pile {
  padding: 2px 6px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.token-icon {
  max-width: 24px;
  max-height:24px;
  margin: auto 5px;
}
.selected {
  background-color: rgba(255, 255,255, 0.2);
}
</style>