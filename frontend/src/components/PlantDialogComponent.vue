<template>
  <q-dialog v-model="alert">

    <q-card>
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
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
  watch,
} from 'vue';
import {Plant} from './models';


export default defineComponent({
  name: 'PlantDialogComponent',
  props: {
    test: {type: Boolean}
  },
  setup (props) {
    const alert = ref(props.test);

    watch(() => props.test, () => {
      alert.value = props.test;
    })

    return {
      alert,
    }
  }
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
