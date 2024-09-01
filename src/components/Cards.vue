<template>
  <v-card class="container fill-height" color="surface-light">
    <div class="fill-height d-flex flex-column justify-space-around">
        <div class="d-flex">
            <div class="card card-back">
                <img src="/public/assets/cardback_3.png"  />
            </div>
            <div class="d-flex justify-start card-group">
                <div class="card" v-for="x in [1,2,3,4,5]">
                    <img src="/public/assets/cardback_3.png"  />
                </div>
            </div>
        </div>
        <div class="d-flex">
            <div class="card card-back">
                <img src="/public/assets/cardback_3.png"  />
            </div>
            <div class="d-flex justify-start card-group">
                <div class="card" v-for="x in [1,2,3,4,5]">
                    <img src="/public/assets/cardback_3.png"  />
                </div>
            </div>
        </div>
        <div class="d-flex">
            <div class="card card-back">
                <img src="/public/assets/cardback_3.png"  />
            </div>
            <div class="d-flex justify-start card-group">
                <div class="card" v-for="x in [1,2,3,4,5]">
                    <img src="/public/assets/cardback_3.png"  />
                </div>
            </div>
        </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">

</script>

<style scoped>

img {
    max-height: 100%;
}

.card {
    height: 15vh;
    margin-left: 10px;
}

.card-back {
    margin-left: 10px;
    margin-right: 40px;
}

.card-group {
    width: 100%;
    margin-right: 10px;
}
</style>