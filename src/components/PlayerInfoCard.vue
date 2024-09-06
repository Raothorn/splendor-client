<template>
  <v-card class="fill-height">
    <v-card-title> 
      <h3> Player {{ player.username }} </h3>
      <h4 :class="isYou() ? '' : 'hidden'"> (you) </h4>
    </v-card-title>
    <v-card-text>
      <div class="player-card">
        <div class="token-grid">
          <ul>
            <li><h4>#</h4></li>
            <li v-for="color in tokenColors">
              <img
                class="token-icon"
                :src="getTokenImgUrl(color)"
                :alt="color"
              />
            </li>

            <li>
              <img
                class="token-icon"
                src="/assets/token_icon.png"
                alt=""
              />
            </li>
            <li v-for="color in tokenColors">
              <h5>{{ tokenGems(color) }}</h5>
            </li>

            <li>
              <img
                class="card-icon"
                src="/assets/developments_1/back_1.png"
                alt=""
              />
            </li>
            <li v-for="color in tokenColors">
              <h5>{{ developmentGems(color) }}</h5>
            </li>

            <div class="row-divider"></div>
            <li>
              <h4><v-icon icon="mdi-sigma"></v-icon></h4>
            </li>
            <li v-for="color in tokenColors">
              <h5>{{ tokenGems(color) + developmentGems(color) }}</h5>
            </li>
          </ul>
        </div>
        <div class="player-footer">
          <h4>VP: 0</h4>
          <div class="player-gold">
            <img
              class="token-icon"
              src="/assets/token_gold.png"
              alt=""
            />
            <h4>0</h4>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStores";
import { lookupTokens, Player, tokenColors } from "@/types/gamestate";

const props = defineProps<{
  player: Player;
}>();

const app = useAppStore();


function isYou() {
  return props.player.username == app.username
}

function tokenGems(color: string) {
  return lookupTokens(props.player.tokens, color);
}

function developmentGems(color: string) {
  return 0;
}


function getTokenImgUrl(color: string) {
  return `/assets/token_${color.toLowerCase()}.png`;
}
</script>

<style scoped>
ul,
li {
  list-style-type: none;
}

.hidden {
  visibility: hidden;
}

/* small screen sizes and up */
.v-card-title {
  text-align: center;
  font-size: 0.8rem;
  padding: 1px;
}
.v-card-title h4 {
  margin-bottom: 0;
}
.v-card-text {
  padding: 10px 0;
  margin: 0px 10px;
}
.player-card {
  height: 100%;
  display: flex;
  align-items: start;
}
.token-grid ul {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 2px;
}
.token-grid h4,
h5 {
  text-align: center;
}
.token-grid .v-icon {
  text-align: center;
}
.row-divider {
  border-top: 2px solid black;
  grid-column: span 6;
}
.token-icon {
  display: block;
  margin: 0px auto;
  max-width: 20px;
}
.card-icon {
  display: block;
  margin: 0px auto;
  max-height: 20px;
}

.player-footer {
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-left: 4px;
}
.player-footer h4 {
  font-size: 1.4rem;
}

.player-gold {
  display: flex;
  justify-content: start;
  align-items: center;
}
.player-gold .token-icon {
  margin: 0px 3px;
}

/*if there is enough height to put the footer at the bottom*/
@media (min-height: 800px) {
  .player-card {
    flex-direction: column;
  }
  .player-footer {
    height: 24px;
    width: 90%;
    margin-top: 4px;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
