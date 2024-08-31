<template>
  <v-container>
    <v-card>
      <v-card-title class="justify-center">
        <div class="text-center">Actions</div>
      </v-card-title>
      <v-card-text>
        <v-btn color="surface-light" class="mt-5" block
            @click="acquireTokens">
            Acquire tokens
        </v-btn>
        <v-btn color="surface-light" class="mt-5" block>
            Purchase Development
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script setup lang="ts">
import { useUiStore } from '@/stores/appStores';

const ui = useUiStore()

function acquireTokens() {
    ui.selectedTokens = new Set()
    ui.selectType = "select1"
}
</script>
