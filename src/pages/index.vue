<template>

  <div class="top-row left-col panel" color="background">
    <MainBoard />
  </div>

  <div class="bottom-row left-col panel" color="background">
    <InfoPanel></InfoPanel>
  </div>

  <div class="top-row right-col panel" color="background">
    <PlayerInfo />
  </div>
  
  <div class="bottom-row right-col panel">
    <ContextMenu />
  </div>
</template>

<script lang="ts" setup>
  import MainBoard from '@/components/MainBoard.vue';
  import PlayerInfo from '@/components/PlayerInfo.vue';
  import ContextMenu from '@/components/ContextMenu.vue';
  import InfoPanel from '@/components/InfoPanel.vue';
</script>

<style scoped>

.v-col {
  padding-bottom: 1px;
  padding-top: 1px;
}

.panel {
  position: absolute;
  overflow: hidden;
  padding: 1px;
}

.top-row {
  height: 70vh;
}

.bottom-row {
  top: calc(70vh + 4px);
  height: calc(30vh - 4px);
}

.left-col {
  width: 80vw;
}

.right-col {
  left: calc(80vw + 4px);
  width: calc(20vw - 4px);
}

</style>
