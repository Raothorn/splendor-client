<template>
  <div class="main-panel">
    <div class="token-bank">
      <TokenBank></TokenBank>
    </div>
    <div class="cards-panel">
      <Cards></Cards>
    </div>
    <div class="main-footer">
      <div class="player-info-panel">
        <PlayerInfoPanel></PlayerInfoPanel>
      </div>
      <div class="">
        <ContextButton></ContextButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TokenBank from "./TokenBank.vue";
import PlayerInfoPanel from "./PlayerInfoPanel.vue";
import Cards from "./Cards.vue";
import ContextButton from "./ContextButton.vue";

</script>

<style scoped>
/* small screens and up */
.main-panel {
  height: 100vh;
  display: grid;
  grid-template-rows: repeat(12, 1fr);
}

.token-bank {
  grid-row: span 1;
}
.cards-panel {
  grid-row: span 8;
}
.main-footer{
  grid-row: span 3;

  display: grid;
  grid-template-columns: 4fr 200px;
}
</style>
