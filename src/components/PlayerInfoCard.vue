<template>
  <v-card class="player-info-card" :class="{ inactive: !isTurn() }">
    <v-card-title>
      <h3>{{ player.username }}</h3>
    </v-card-title>
    <v-card-subtitle>
      <h4 :class="isYou() ? '' : 'hidden'">(you)</h4>
    </v-card-subtitle>
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
              <img class="token-icon" src="/assets/token_icon.png" alt="" />
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
          <div class="d-flex justify-space-evenly align-center">
            <div class="d-flex align-center">
              <h4>VP: {{ player.victoryPoints }}</h4>
              <v-btn
                id="vp-info-btn"
                class="info-btn"
                icon="mdi-information-outline"
                density="compact"
                variant="flat"
              >
              </v-btn>
              <v-tooltip
                activator="parent"
                location="top"
              >
                <v-card class="vp-tooltip">
                  <v-card-title
                    >{{ player.username }} Victory Points</v-card-title
                  >
                  <v-card-text>
                    <div class="d-flex flex-column">
                      <div class="d-flex align-center">
                        <v-table>
                          <tr>
                            <td>Nobles</td>
                            <td v-for="noble in player.nobles">
                              <img
                                class="noble-icon ml-3"
                                :src="getNobleImgUrl(noble)"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Developments</td>
                            <td v-for="dev in player.ownedDevelopments">
                              <img
                                class="noble-icon ml-3"
                                :src="getDevelopmentImgUrl(dev)"
                              />
                            </td>
                          </tr>
                        </v-table>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-tooltip>
            </div>
            <div class="player-gold">
              <img class="token-icon" src="/assets/token_gold.png" alt="" />
              <h4>{{ goldAmt }}</h4>
            </div>
          </div>
          <div class="player-reserved-developments">
            <p>Reserved developments</p>
            <ul>
              <li v-for="reserved in player.reservedDevelopments.slice(0, 4)">
                <v-tooltip activator="parent">
                  <img :src="`/assets/developments_1/${reserved}.png`" />
                </v-tooltip>
                <img
                  @click="selectReservedDevelopment(reserved)"
                  class="development-icon"
                  :class="ui.isDevelopmentSelected(reserved) ? 'selected' : ''"
                  :src="`/assets/developments_1/${reserved}.png`"
                />
              </li>
              <li v-if="player.reservedDevelopments.length > 4">
                <v-icon icon="mdi-dots-horizontal-circle-outline"></v-icon>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStores"
import { useGameStore } from "@/stores/gameStore"
import { SelectDevelopmentMode, useUiStore } from "@/stores/uiStore"
import { lookupTokens, Player, tokenColors } from "@/types/gamestate"

const props = defineProps<{
  player: Player
}>()

const app = useAppStore()
const game = useGameStore()
const ui = useUiStore()

const goldAmt = computed(() => {
  let totalGold = tokenGems("Gold")
  return totalGold
})

function isYou() {
  return props.player.username == app.username
}

function isTurn() {
  return props.player.username == game.getCurrentTurnPlayer
}

function selectReservedDevelopment(devId: number) {
  if (
    isYou() &&
    ui.getSelectDevelopmentMode == SelectDevelopmentMode.Purchase
  ) {
    ui.toggleDevelopmentSelected(devId)
  }
}

function tokenGems(color: string) {
  return lookupTokens(props.player.tokens, color)
}

function developmentGems(color: string) {
  return lookupTokens(props.player.developmentGems, color)
}

function getDevelopmentImgUrl(devId: number) {
  return `./assets/developments_1/${devId}.png`
}

function getTokenImgUrl(color: string) {
  return `/assets/token_${color.toLowerCase()}.png`
}

function getNobleImgUrl(nobleId: number) {
  return `./assets/nobles/${nobleId}.webp`
}
</script>

<style scoped lang="scss">
ul,
li {
  list-style-type: none;
}

.inactive {
  opacity: 0.75;
}

.hidden {
  visibility: hidden;
}

/* small screen sizes and up */
.player-info-card {
  height: 90%;
}
.v-card-title {
  text-align: center;
  font-size: 0.8rem;
  padding: 1px;
}
.v-card-title h4 {
  margin-bottom: 0;
}
.v-card-subtitle {
  text-align: center;
}
.v-card-text {
  padding: 10px 0;
  margin: 0px 10px;
}
.player-card {
  display: flex;
  align-items: start;
}
.token-grid {
  margin-right: 10px;
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
  margin-left: 4px;

  display: flex;
  flex-direction: column;
}
.player-footer h4 {
  font-size: 1.2rem;
}

.info-btn {
  --v-btn-size: 0.5rem;
}

.player-gold {
  min-height: 35px;
  display: flex;
  justify-content: start;
  align-items: center;
}
.player-gold .token-icon {
  margin: 0px 8px;
}
.player-reserved-developments {
  min-height: 60px;
  border: 1px solid gray;
  border-radius: 4px;
  grid-column: span 2;
  padding: 0px 2px;
}
.player-reserved-developments p {
  font-size: 0.8rem;
}
.player-reserved-developments ul {
  display: flex;
  align-items: center;
  justify-content: center;
}
.player-reserved-developments li {
  margin: 0px 2px;
}
.development-icon {
  max-width: 20px;
}

.allocate-gold-btn {
  border-radius: 20px;
  margin: 4px 0px;
}
.deallocate-gold-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}
.v-snackbar__content {
  padding: 0px;
}

.selected {
  transform: scale(1.1);
}
.noble-icon {
  max-width: 100px;
  border-radius: 5px;
  overflow: hidden;
}
</style>
