<template>
  <div
    class="plant-size"
    @click="openPlantComponent"
  >
    <p>{{ plant.name }}</p>
    <p>{{ status }}</p>
  </div>
  <q-dialog v-model="detailVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ getLogsForPlant(plant.id) }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  toRef,
  Ref,
} from 'vue';
import {Plant} from './models'
import {storeToRefs} from "pinia";
import {usePlantStore} from "stores/PlantStore";


export default defineComponent({
  name: 'ExampleComponent',
  components: {},
  props: {
    plant: {
      type: Object as PropType<Plant>,
      default: () => ({
        name: ''
      })
    }
  },
  setup (props) {

    const plantStore = usePlantStore();
    const { getLogsForPlant } = storeToRefs(plantStore)

    const detailVisible = ref(false);
    console.log("props", props)

    const status = computed(() => {
      return 'hi' + props.plant.drying_interval
    })

    const openPlantComponent = () => {
      detailVisible.value = true;
      console.log("clicked")
    }
    return { status, detailVisible, openPlantComponent, getLogsForPlant }
    //return { ...useClickCount(), ...useDisplayTodo(toRef(props, 'todos')) };
  },
});
</script>

<style>
.plant-size {
  margin: 0.5rem;
  width: 15rem;
  height: 15rem;
  background-color: gray;
}
</style>
