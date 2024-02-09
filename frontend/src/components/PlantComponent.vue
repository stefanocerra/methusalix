<template>
  <div class="plant-size">
    <p>{{ plant.name }}</p>
  </div>
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
import {Plant} from './models';


export default defineComponent({
  name: 'ExampleComponent',
  props: {
    plant: {
      type: Object as PropType<Plant>,
      default: () => ({})
    }
  },
  setup (props) {
    console.log("props", props)
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
