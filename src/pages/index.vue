<template>
  <v-container class="w-100">
      <v-row class="w-100">
        <v-col cols="8"> 
          <Game></Game>
        </v-col>
        <v-col cols="4">
          <TurnActions></TurnActions>
        </v-col>
      </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import Game from '@/components/Game.vue'
  import TurnActions from '@/components/TurnActions.vue';
</script>
