<template>
  <v-sheet class="message-panel">
    <h2>Messages</h2>
    <div v-for="message in game.messageLog">
      <p>
        > <span v-html="processMessage(message)" :id="$style.expanded"> </span>
      </p>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';

const game = useGameStore()

function processMessage(msg: string) {
  let regex = /\[d\|(.*)\]/i;

  let result = msg.replace(regex, 
    `<a href='#img'>development<span class='expanded-img'>
    <img src='./assets/developments_1/$1.png'/></span></a>`)

  return result
}

</script>

<style scoped>
.message-panel {
  height: 100%;
  overflow-y: scroll;
}
.message-panel h2 {
  text-align: center;
}
.message-panel p {
  margin-bottom: 10px;
}


</style>

<style module>

#expanded>a>span {
  position: absolute;
  padding: 5px;
  display: none;
  color: black;
  text-decoration: none;
}

#expanded>a>span>img {
  border-width: 0;
  padding: 2px;
  display: block;
  max-width: 100px;
}

#expanded a:hover span {
  display: contents;
  top: 60px;
  left: 60px;
}
</style>