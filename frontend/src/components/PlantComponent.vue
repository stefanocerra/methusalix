<template>
  <div
    class="plant-size row"
    @click="openPlantComponent"
  >
    <p>{{ plant.name }}</p>
    <q-img
      style="height: 150px; width: 100px; border-radius: 5px;"
      :src="`http://127.0.0.1:8090/api/files/plants/${plant.id}/${plant.picture}`" />
    <p>Status: {{ plantStatus }}</p>
  </div>
  <q-dialog v-model="detailVisible">
    <q-card>
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h6 column">
            {{ plant.name }}
            <div>
              <q-btn flat round color="primary" icon="info" @click="openCareInstructions"/>
              <q-btn flat round color="primary" icon="open_in_new" @click="openLink(plant.link)"/>
            </div>
          </div>
          <div>
            <q-img
              style="height: 150px; width: 100px; border-radius: 5px;"
              :src="`http://127.0.0.1:8090/api/files/plants/${plant.id}/${plant.picture}`"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-weight-bold">Add Logbook entry</div>

          <div class="row">
            <div class="column col-6">
              <q-select
                v-model="creatorName"
                :options="creatorNames"
                label="Name"
              />
              <q-select
                v-if="!waterNeeded"
                v-model="waterLevel"
                :options="waterLevels"
                label="Water level"
              />
            </div>

            <div class="col-6">
              <q-input
                v-model="comment"
                autogrow
                filled
                label="Comment"
                type="textarea"
              />
            </div>
          </div>
          <q-btn
            @click="addLogBookEntry"
            color="secondary"
            :label="addBtnTxt"
          />
      </q-card-section>

      <q-card-section>
          <q-table
            title="Logbook"
            :rows="getLogsForPlant(plant.id)"
            :columns="columns"
            row-key="name"
          ></q-table>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="careInstructionsVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">Care Instructions</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p>- Pour up to the <b>"Optimum"</b> level displayed, not maximum</p>
        <p>- Water  <b>near the stem/growth area</b>, not at the edge of the container</p>
        <p>
          - <b>Water level indicator:</b> This can get stuck in the meantime.
          Tap the indicator with your finger or, if in doubt, briefly remove the transparent attachment.
          When doing so, you must ensure that the tube is not displaced and that no substrate gets into the tube.
        </p>
        <p>- Dead leaves must be <b>removed</b>. Cut off as <b>close</b> to the origin as possible.</p>

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
} from 'vue';
import {Plant} from './models'
import {storeToRefs} from 'pinia';
import {usePlantStore} from 'stores/PlantStore';

export default defineComponent({
  name: 'ExampleComponent',
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
    const { getLogsForPlant, logs, plants } = storeToRefs(plantStore)

    const detailVisible = ref(false);
    const careInstructionsVisible = ref(false);
    const creatorName = ref('');
    const waterLevel = ref('');
    const comment = ref('');
    const waterNeeded = ref(false)
    const addBtnTxt = ref('Add');

    // const status = computed(() => {
    //   return 'hi' + getLogsForPlant(props.plant.id)
    // })

    // // const testStore = useTestStore();
    // const status =  computed(()=> {
    //   if (plantStore.getLogsForPlant(props.plant.id).length > 0) {
    //     return plantStore.getLogsForPlant(props.plant.id)[0].created
    //   } else {
    //     return '';
    //   }
    // });

    const plantStatus =  computed(()=> {
      if (plantStore.getLogsForPlant(props.plant.id).length > 0) {
        const plantId = props.plant.id;
        const plantLogs = logs.value.filter((log: object) => {
          return log.fk_plant === plantId
        });

        const latestPlantLog: object = plantLogs[0];

        // const plant = plants.value.filter(plant => plant.id === plantId);
        const dryingInterval: number = props.plant.drying_interval * 86400000;

        const currentDate: number = new Date().getTime();
        const latestLogDate: number = new Date(latestPlantLog.created).getTime();

        // Check if last log entry is older than 2 days
        if (latestLogDate + 172800000 < currentDate || latestPlantLog.waterlevel === 0) {
          if(latestLogDate + dryingInterval <= currentDate && latestPlantLog.waterlevel === 0) {
            return 'Water now!';
          } else if (latestLogDate + dryingInterval > currentDate && latestPlantLog.waterlevel === 0) {
            if (Math.ceil((latestLogDate + dryingInterval - currentDate) /  86400000) === 1) {
              return 'Water in 1 day.';
            } else {
              return 'Water in ' + Math.ceil((latestLogDate + dryingInterval - currentDate) /  86400000) + ' days.';
            }

          } else if (latestPlantLog.waterlevel !== 0) {
            console.log('current dAte', currentDate)
            console.log('lates date', latestLogDate)
            console.log('date difference', latestLogDate + 172800000 < currentDate)
            return 'Check';
          } else {
            return 'OK'
          }
        } else {
          return 'OK';
        }
      } else {
        return '';
      }
    });

    const openPlantComponent = () => {
      detailVisible.value = true;

      const latestPlantLog = plantStore.getLatestLog(props.plant.id)[0];

      if (latestPlantLog.waterlevel === 0) {
        waterNeeded.value = true;
        addBtnTxt.value = 'Watered';
      } else {
        addBtnTxt.value = 'Add';
        waterNeeded.value = false;
      }
    }

    const openCareInstructions = () => {
      careInstructionsVisible.value = true;
    }

    const addLogBookEntry = () => {

      if (!waterNeeded.value) {
        const convertedWaterLvl = waterLevel.value.split('%')[0];

        if (parseInt(convertedWaterLvl) === 0) {
          waterNeeded.value = true;
          addBtnTxt.value = 'Watered';
        }

        plantStore.createLogEntry(creatorName.value, 'Check', parseInt(convertedWaterLvl) , comment.value, props.plant.id);
      } else {
        plantStore.createLogEntry(creatorName.value, 'Water', 100, comment.value, props.plant.id);
        waterNeeded.value = false;
        addBtnTxt.value = 'Add';
      }

      creatorName.value = '';
      waterLevel.value = '';
      comment.value = '';
    }

    const openLink = (url: string) => {
      window.open(url,'_blank');
    }

    const columns = [
      { name: 'date', align: 'center', label: 'Date', field: 'created' },
      { name: 'creator_name', align: 'center', label: 'Name', field: 'creator_name' },
      { name: 'type', align: 'center', label: 'Type', field: 'type' },
      { name: 'waterlevel', align: 'center', label: 'Water level', field: 'waterlevel' },
      { name: 'comment', align: 'center', label: 'Comment', field: 'comment' },
    ]

    const creatorNames = [
      'CEST',
      'JEAN',
      'BUMI',
      'FLMA',
      'ELMA',
      'GAMA',
      'KRTO',
      'DOLE',
      'BAUM',
      'AERO',
      'JADA',
      'PICU'
    ]

    const waterLevels = [
      '0%',
      '25%',
      '50%',
      '75%',
      '100%',
    ]
    return {
      plantStatus,
      detailVisible,
      careInstructionsVisible,
      openPlantComponent,
      openCareInstructions,
      getLogsForPlant,
      columns,
      creatorNames,
      waterLevels,
      creatorName,
      waterLevel,
      comment,
      addLogBookEntry,
      openLink,
      addBtnTxt,
      waterNeeded,
    }
  },
});
</script>

<style>
.plant-size {
  margin: 0.5rem;
  width: 15rem;
  height: 15rem;
  padding: .5rem;
  background-color: white;
  border: #1D1D1D solid 1px;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
