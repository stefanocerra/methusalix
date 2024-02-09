<template>
  <q-page class="row q-pa-md">
    <div class="col-md-8 col-sm-12 col-xs-12 room-borders">
      <p>Babaorum</p>
      <div class="row justify-around no-wrap-md wrap-sm">
        <!-- PlantComponent v-for ...roombabaorum computed -->
<!--        <PlantComponent name="fritz"></PlantComponent>-->
<!--        <PlantComponent name="hans"></PlantComponent>-->
      </div>
    </div>
    <div class="col-md-4 col-sm-12 col-xs-12 room-borders">
      <p>Kleinbonum</p>
      <div class="row justify-around no-wrap-md wrap-sm">
<!--        <PlantComponent name="peter"></PlantComponent>-->
      </div>
    </div>
    <div class="col-12 room-borders">
      <p>Laudanum</p>
      <div class="row justify-around no-wrap-md wrap-sm">
<!--        <PlantComponent name="karin"></PlantComponent>-->
      </div>
    </div>
    <div class="col-12 room-borders">
      <p>Aremorica</p>
      <div class="row justify-around no-wrap-md wrap-sm">
        <PlantComponent v-for="plant in aremoricaPlants" v-bind:key="plant.id" :plant="plant"></PlantComponent>
      </div>
    </div>
  </q-page>
  <!--<q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :plants="plants"
      :todos="todos"
      :meta="meta"
    ></example-component>
  </q-page>-->
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import PlantComponent from 'components/PlantComponent.vue';
import {computed, defineComponent, ref} from 'vue';
import {useCounterStore} from "stores/example-store";
import {storeToRefs} from "pinia";

export default defineComponent({
  name: 'IndexPage',
  components: {PlantComponent },
  setup () {
    const appStore = useCounterStore();
    appStore.loadPlants()

    //const plants = appStore.listPlants;
    //console.log("plants", plants)
    const { plants } = storeToRefs(appStore)

    const aremoricaPlants = computed(() => {
      return plants.value.filter((plant) => plant.room === 'Aremorica');
    });
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1'
      },
      {
        id: 2,
        content: 'ct2'
      },
      {
        id: 3,
        content: 'ct3'
      },
      {
        id: 4,
        content: 'ct4'
      },
      {
        id: 5,
        content: 'ct5'
      }
    ]);
    const meta = ref<Meta>({
      totalCount: 1200
    });
    return { todos, meta, plants, aremoricaPlants };
  }
});
</script>
