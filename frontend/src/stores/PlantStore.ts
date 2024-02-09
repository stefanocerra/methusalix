import { defineStore } from 'pinia';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const getLogbookForPlant = (plantId) => {
  pb.collection('logbook').getList(1, 50, {
    filter: `fk_plant = ${plantId}`,
  }).then(logs => {
    console.log("plant logs", plantId, logs)
  });
}

export const usePlantStore = defineStore('plant', {
  state: () => ({
    plants: [],
    logs: []
  }),
  getters: {
    getLogsForPlant: (state) => {
      return (plantId) => state.logs.filter((log) => log.fk_plant === plantId)
    }
  },
  actions: {
    loadPlants() {
      pb.collection('plants').getFullList({
        sort: 'room',
        expand: 'logbook(plants).fk_plant'
      }).then(plants => {
        console.log("plants", plants)
        this.plants = plants
        /*for (const plant of plants) {
          getLogbookForPlant(plant.id)
        }*/
      }).catch((error) => console.log(error));

      pb.collection('logbook').getFullList({
        sort: 'fk_plant'
      }).then(logs => {
        console.log("logbook", logs)
        this.logs = logs
        /*for (const plant of plants) {
          getLogbookForPlant(plant.id)
        }*/
      }).catch((error) => console.log(error));

      pb.collection('logbook').subscribe('*',  (e) => {
        console.log(e.action);
        console.log(e.record);
        this.logs.push(e.record);
      })
    },

  },
});
