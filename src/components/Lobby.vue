<template>
  <v-card class="w-50 mx-auto my-10">
    <v-card-title>Lobby</v-card-title>
    <v-card-text>
      <v-table>
        <thead> <tr> <h1>Players</h1></tr> </thead>
        <tbody>
          <tr v-for="player in app.lobbyPlayers">
            <td> {{ player}} </td>
          </tr>
        </tbody>
      </v-table>
      <hr>
      <br>
      <v-text-field v-if="!app.isJoined" label="username" v-model="username" :hide-details=true></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="app.isJoined" @click="startGame" variant="tonal" block>Start game</v-btn>
      <v-btn v-else @click="login" variant="tonal" block>Join lobby</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import $socket from '@/socket';
import { useAppStore } from '@/stores/appStores';

const app = useAppStore()

const username = ref("user1")

function login(){
  app.attemptJoinLobby(username.value)
}

function startGame() {
  $socket.startGame()
}
</script>