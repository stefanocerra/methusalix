<template>
  <q-card
    flat bordered
    class="plant-size cursor-pointer"
    @click="openPlantComponent"
  >
    <q-card-section horizontal>
      <q-img
        class="col-4"
        :src="`${windowOrigin}/api/files/plants/${plant.id}/${plant.picture}`"
      />
      <q-card-section class="column justify-between">
        <p class="text-h5 text-weight-thin ptolemy card-title">{{ plant.name }}</p>
        <q-chip
                class="q-ma-none"
                square
                :color="plantStatus === 'OK' ? '' : 'accent'"
                :icon="plantStatus === 'OK' ? 'cake' : 'event'"
                :text-color="plantStatus === 'OK' ? '' : 'white'">{{ plantStatus }}</q-chip>
        <q-linear-progress
          stripe
          rounded
          size="20px"
          :value="waterLevelIndicator / 100"
          color="primary"
        >
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="primary" :label="'Level: ' + waterLevelIndicator + '%'" />
          </div>
        </q-linear-progress>
      </q-card-section>
    </q-card-section>
  </q-card>

  <q-dialog v-model="detailVisible" :maximized="$q.screen.lt.sm">
    <q-card class="detail-card-size">
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h5 column ptolemy">
            {{ plant.name }}
            <div>
              <q-btn flat round color="primary" icon="info" @click="openCareInstructions">
                <q-tooltip>
                  Show care instructions
                </q-tooltip>
              </q-btn>
              <q-btn flat round color="primary" icon="open_in_new" @click="openLink(plant.link)">
                <q-tooltip>
                  Show plant information
                </q-tooltip>
              </q-btn>
            </div>
          </div>
          <div>
            <q-img
              style="height: 150px; width: 100px; border-radius: 5px;"
              :src="`${windowOrigin}/api/files/plants/${plant.id}/${plant.picture}`"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-weight-bold">Add Logbook entry</div>

        <div class="q-gutter-md">
          <div class="row">
            <q-select
              class="col q-mr-sm"
              ref="creatorNameRef"
              v-model="creatorName"
              :options="creatorNames"
              label="Name"
              :rules="[val => (val && val.length > 0) || 'Please type something']"
            />
            <q-select
              class="col"
              ref="waterLevelRef"
              v-if="!waterNeeded"
              v-model="waterLevel"
              :options="waterLevels"
              label="Water level"
              :rules="[val => (val && val.length > 0) || 'Please type something']"
            />
          </div>

          <div class="col-6 q-ml-sm">
            <q-input
              ref="commentRef"
              v-model="comment"
              autogrow
              filled
              label="Comment"
              type="textarea"
              :rules="[ val => val.length <= 40 || 'Please use maximum 40 characters']"
            />
          </div>
          <div class="flex justify-end">
            <q-btn
              align="right"
              @click="addLogBookEntry"
              color="primary"
              :label="addBtnTxt"
              v-close-popup
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
          <q-table
            style="min-width: fit-content;"
            title="Logbook"
            :rows="getLogsForPlant(plant.id)"
            :columns="columns"
            row-key="name"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  {{ col.label }}
                </q-th>
                <q-th>
                  Comment
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr auto-width :props="props" >
                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  {{ col.value }}
                </q-td>
                <q-td class="text-center">
                  <q-btn icon="info" round dense flat color="accent" v-if="props.row.comment">
                    <q-tooltip>
                      {{ props.row.comment }}
                    </q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
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
    const { getLogsForPlant, logs } = storeToRefs(plantStore)

    const detailVisible = ref(false);
    const careInstructionsVisible = ref(false);
    const creatorNameRef = ref(null);
    const creatorName = ref('');
    const waterLevelRef = ref(null);
    const waterLevel = ref('');
    const comment = ref('');
    const waterNeeded = ref(false)
    const addBtnTxt = ref('Add');
    const commentRef = ref(null);

    const windowOrigin = window.origin.includes('localhost') ? 'http://127.0.0.1:8090' : window.origin;

    const waterLevelIndicator =  computed(()=> {
      if (plantStore.getLogsForPlant(props.plant.id).length > 0) {
        const plantId = props.plant.id;
        const plantLogs = logs.value.filter((log: object) => {
          return log.fk_plant === plantId
        });

        const latestPlantLog: object = plantLogs[0];

        return latestPlantLog.waterlevel;
      } else {
        return 0;
      }
    })

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

      if (latestPlantLog && latestPlantLog.waterlevel === 0) {
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
        if (creatorNameRef.value.validate() && waterLevelRef.value.validate() && commentRef.value.validate()) {
          const convertedWaterLvl = waterLevel.value.split('%')[0];

          if (parseInt(convertedWaterLvl) === 0) {
            waterNeeded.value = true;
            addBtnTxt.value = 'Watered';
          }

          plantStore.createLogEntry(creatorName.value, 'Check', parseInt(convertedWaterLvl) , comment.value, props.plant.id);

          console.log('test')
          creatorName.value = '';
          waterLevel.value = '';
          comment.value = '';

          setTimeout(function(){
            creatorNameRef.value.resetValidation()
            waterLevelRef.value.resetValidation()
            commentRef.value.resetValidation()
          }, 0);

        } else {
          creatorNameRef.value.validate();
          waterLevelRef.value.validate();
        }
      } else {
        if (creatorNameRef.value.validate() && commentRef.value.validate()) {
          plantStore.createLogEntry(creatorName.value, 'Water', 100, comment.value, props.plant.id);

          waterNeeded.value = false;
          addBtnTxt.value = 'Add';

          creatorName.value = '';
          comment.value = '';

          setTimeout(function(){
            creatorNameRef.value.resetValidation()
            commentRef.value.resetValidation()
          }, 0);
        } else {
          creatorNameRef.value.validate();
        }
      }
    }

    const openLink = (url: string) => {
      window.open(url,'_blank');
    }

    const columns = [
      { name: 'date', align: 'left', label: 'Date', field: 'created', format: (val: string) => new Date(val).toLocaleString() },
      { name: 'creator_name', align: 'left', label: 'Name', field: 'creator_name' },
      { name: 'type', align: 'left', label: 'Type', field: 'type' },
      { name: 'waterlevel', align: 'left', label: 'Water level', field: 'waterlevel', format: (val: string) => `${val}%` },
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
      waterLevelIndicator,
      creatorNameRef,
      waterLevelRef,
      commentRef,
      windowOrigin
    }
  },
});
</script>
