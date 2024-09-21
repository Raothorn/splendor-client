<template>
  <div class="main-panel">
    <div class="cards-panel">
      <Cards></Cards>
    </div>
    <div class="nobles-panel">
      <NoblesPanel></NoblesPanel>
    </div>
    <div class="token-bank">
      <TokenBank></TokenBank>
    </div>
    <div class="player-info-panel">
      <PlayerInfoPanel></PlayerInfoPanel>
    </div>
    <div class="context-button">
      <ContextButton></ContextButton>
    </div>
    <div class="message-log">
      <MessagePanel></MessagePanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import TokenBank from "./TokenBank.vue"
import PlayerInfoPanel from "./PlayerInfoPanel.vue"
import Cards from "./Cards.vue"
import ContextButton from "./ContextButton.vue"
import NoblesPanel from "./NoblesPanel.vue"
import MessagePanel from "./MessagePanel.vue"
</script>

<style scoped>
/* small screens and up */
.main-panel {
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(11, 1fr) 175px 300px;
  grid-template-rows: minmax(50px, 5vh) 70vh minmax(200px, 25vh);
}
.message-log {
  grid-column: 13/14;
  grid-row: 1/4;
  border-left: 2px solid black;
}
.nobles-panel {
  grid-column: span 3;
  border-bottom: 1px solid black;
}
.token-bank {
  grid-column: span 9;
  border-bottom: 2px solid black;
}
.cards-panel {
  grid-column: span 12;
  border-bottom: 1px solid black;
}
.player-info-panel {
  grid-column: span 11;
}
.context-button {
  grid-column: span 1;
}
</style>
