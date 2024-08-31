<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import $socket from './socket';


onMounted(() => {
  $socket.connect() 
})

onBeforeUnmount(() => {
  $socket.disconnect()
})
</script>
