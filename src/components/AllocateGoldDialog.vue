<template>
  <v-dialog v-model="ui.isAllocatingGold" max-width="800">
    <v-card>
      <v-card-title>Allocate Gold</v-card-title>
      <v-card-subtitle>
        (Remaining gold: {{ remainingGold }})
      </v-card-subtitle>
      <v-card-actions class="d-flex flex-column">
        <v-table>
          <thead>
            <tr>
              <th>Gem</th>
              <th>
                <img class="token-icon-small" src="/assets/developments_1/back_1.png">
              </th>
              <th>
                <img
                  class="token-icon-small"
                  src="/assets/token_icon.png"
                  alt=""
                />
              </th>
              <th></th>
              <th>
                <img class="token-icon-small" src="/assets/token_gold.png">
              </th>
              <th></th>
              <th>Total</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[color, _] in ui.selectedDevelopmentCost">
              <td>
                <img class="token-icon-small" :src="getTokenImgUrl(color)" />
              </td>
              <td>{{ devGems(color) }}</td>
              <td>{{ spendTokenGems(color) }}</td>
              <td class="no-pad">
                <v-btn
                  @click="ui.allocateGold(color, true)"
                  icon="mdi-minus"
                  :disabled="!canDeallocate(color)"
                  density="compact"
                ></v-btn>
              </td>
              <td>
                <p>{{ ui.getAllocatedGold(color) }}</p>
              </td>
              <td class="no-pad">
                <v-btn
                  @click="ui.allocateGold(color)"
                  icon="mdi-plus"
                  :disabled="!canAllocate(color)"
                  density="compact"
                ></v-btn>
              </td>
              <td>
                <h4>{{ sumGems(color) }}</h4>
              </td>
              <td>
                <h4
                  :class="
                    sumGems(color) >= devCost(color) ? 'success' : 'error'
                  "
                >
                  {{ devCost(color) }}
                </h4>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div class="d-flex w-50 justify-space-evenly">
          <v-btn
            @click="ui.submitPurchaseAction"
            :disabled="!canPurchase"
            variant="tonal"
          >
            Purchase development
          </v-btn>
          <v-btn @click="ui.cancelAction" variant="tonal">Cancel</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores/gameStore"
import { useUiStore } from "@/stores/uiStore"
import { lookupTokens, tokenColors } from "@/types/gamestate"

const game = useGameStore()
// TODO move the allocated gold stuff from the pinia store to here
const ui = useUiStore()

const remainingGold = computed(() => {
  let playerGold = 0
  let player = game.getUserPlayer
  if (player) {
    playerGold = lookupTokens(player.tokens, "Gold")
  }

  for (let color of tokenColors) {
    playerGold -= ui.getAllocatedGold(color)
  }
  return playerGold
})

const canPurchase = computed(() => {
  for (let [color, cost] of ui.selectedDevelopmentCost) {
    if (sumGems(color) < cost) {
      return false
    }
  }
  return true
})

function canAllocate(color: string) {
  return remainingGold.value > 0
      && (spendTokenGems(color) > 0 || sumGems(color) < devCost(color))
}

function canDeallocate(color: string) {
  return ui.getAllocatedGold(color) > 0
}

function sumGems(color: string) {
  return spendTokenGems(color) 
    + ui.getAllocatedGold(color)
    + devGems(color)
}

function spendTokenGems(color: string) {
  let costWithGold = devCost(color) - ui.getAllocatedGold(color)

  return Math.min(tokenGems(color), costWithGold)
}

function tokenGems(color: string) {
  let player = game.getUserPlayer
  if (player) {
    return lookupTokens(player.tokens, color)
  } else {
    return 0
  }
}

function devGems(color: string) {
  let player = game.getUserPlayer
  if (player) {
    return lookupTokens(player.developmentGems, color)
  } else {
    return 0
  }
}

function devCost(color: string) {
  return lookupTokens(ui.selectedDevelopmentCost, color)
}

// function gemSpendAmount(color: string) {
//   let costs = ui.selectedDevelopmentCost
//   let maxGemCost = lookupTokens(costs, color) - ui.getAllocatedGold(color)
//   return Math.min(maxGemCost, playerGemAmount(color))
// }

function getTokenImgUrl(color: string) {
  return `/assets/token_${color.toLowerCase()}.png`
}
</script>

<style scoped>
.v-card-title {
  text-align: center;
}
.v-card-subtitle {
  text-align: center;
}

.v-table {
  margin: 0px auto;
}

.v-icon {
  width: 10px;
  transform: scale(0.5);
}

th {
  text-align: center;
}

td {
  text-align: center;
  margin: 0px auto;
}

.error {
  color: red;
}
.success {
  color: green;
}
.no-pad {
  padding: 0px 0px !important;
}

.token-icon-med {
  display: block;
  width: 40px;
  height: 40px;
}
.token-icon-small {
  display: block;
  width: 20px;
}
</style>
