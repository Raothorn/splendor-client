<template>
  <v-sheet class="fill-height" color="surface" rounded>
    <v-container fluid class="fill-height">
      <v-row class="fill-height">
        <v-col class="fill-height py-0 my-0" cols="1">
            <TokenBank></TokenBank>
        </v-col>
        <v-col>
            <Cards></Cards>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import TokenBank from "./TokenBank.vue";
import Cards from "./Cards.vue";

</script>

<style scoped>
.v-col {
  margin-right: 1px;
  margin-left: 1px;
  padding: 1px;
}

.v-container {

  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
