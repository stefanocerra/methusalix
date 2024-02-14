<template>
  <q-page class="row q-pa-md">
    <div class="col-md-8 col-sm-12 col-xs-12 room-bottom-borders">
      <p class="q-pa-xs text-h6 text-weight-light ptolemy">Babaorum</p>
      <div class="row justify-around no-wrap-md wrap-sm">
        <PlantComponent v-for="plant in babaorumPlants" v-bind:key="plant.id" :plant="plant"></PlantComponent>
      </div>
    </div>
    <div class="col-md-4 col-sm-12 col-xs-12 room-bottom-borders room-left-borders">
      <p class="q-pa-xs text-h6 text-weight-light ptolemy">Kleinbonum</p>
      <div class="row justify-around no-wrap-md wrap-sm">
        <PlantComponent v-for="plant in kleinbonumPlants" v-bind:key="plant.id" :plant="plant"></PlantComponent>
      </div>
    </div>
    <div class="col-12 room-bottom-borders">
      <p class="q-pa-xs text-h6 text-weight-light ptolemy">Laudanum</p>
      <div class="row justify-around no-wrap-md wrap-sm">
        <PlantComponent v-for="plant in laudanumPlants" v-bind:key="plant.id" :plant="plant"></PlantComponent>
      </div>
    </div>
    <div class="col-12 room-borders">
      <p class="q-pa-xs text-h6 text-weight-light ptolemy">Aremorica</p>
      <div class="row justify-around no-wrap-md wrap-sm">
        <PlantComponent v-for="plant in aremoricaPlants" v-bind:key="plant.id" :plant="plant"></PlantComponent>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import PlantComponent from 'components/PlantComponent.vue';
import {computed, defineComponent} from 'vue';
import {usePlantStore} from 'stores/PlantStore';
import {storeToRefs} from 'pinia';

export default defineComponent({
  name: 'IndexPage',
  components: {PlantComponent },
  setup () {
    const plantStore = usePlantStore();
    plantStore.loadPlants()

    const { plants } = storeToRefs(plantStore)

    const aremoricaPlants = computed(() => {
      return plants.value.filter((plant) => plant.room === 'Aremorica');
    });

    const kleinbonumPlants = computed(() => {
      return plants.value.filter((plant) => plant.room === 'Kleinbonum');
    });

    const babaorumPlants = computed(() => {
      return plants.value.filter((plant) => plant.room === 'Babaorum');
    });

    const laudanumPlants = computed(() => {
      return plants.value.filter((plant) => plant.room === 'Laudanum');
    });

    return { plants, aremoricaPlants, kleinbonumPlants, babaorumPlants, laudanumPlants };
  }
});
</script>
