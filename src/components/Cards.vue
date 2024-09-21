<template>
  <v-sheet class="cards-panel" color="surface">
    <ul>
      <template v-for="index in 3" :key="index">
        <li>
          <div class="card-back development-card">
            <img :src="getCardBackImg(3 - index)" alt="" />
          </div>
        </li>
        <li class="divider"></li>
        <li v-for="devId in game.getShownDevelopments(3 - index)">
          <div
            class="development-card"
            :class="ui.isDevelopmentSelected(devId) ? 'selected' : 'unselected'"
            @click="onCardClick(devId)"
          >
            <img :src="getDevelopmentImg(devId)" alt="" />
          </div>
        </li>
      </template>
    </ul>
  </v-sheet>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { SelectDevelopmentMode, useUiStore } from '@/stores/uiStore';


const game = useGameStore();
const ui = useUiStore();

function onCardClick(devId: number) {
  if (ui.getSelectDevelopmentMode != SelectDevelopmentMode.None) {
    ui.toggleDevelopmentSelected(devId)
  }
}

function getDevelopmentImg(devId: number) {
  return `./assets/developments_1/${devId}.png`;
}

function getCardBackImg(deckIndex: number) {
  return `./assets/developments_1/back_${deckIndex + 1}.png`;
}

</script>

<style scoped>
/* reset */
img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
li,
ul {
  list-style-type: none;
}

.selected {
  transform: scale(1.05);
  /* border: 2px solid black; */
}
.unselected {
  border: 1px solid black;
}

/* small screens and up */
.cards-panel {
  height: 100%;
  display: flex;
  justify-content: center;
}
.cards-panel ul {
  display: grid;
  padding: 10px 0px;
  grid-template-columns: 1fr 3px 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: repeat(3, 33%);
  grid-gap: 5px;
}
.dummy {
  grid-column: span 7;
  grid-row: span 1;
}
.divider {
  grid-column: 2/3;
  grid-row: span 1;
  width: 2px;
}
.development-card {
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.development-card img {
  max-height: 100%;
  max-width: 100%;
}
</style>
