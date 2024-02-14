import { defineStore } from 'pinia';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export const usePlantStore = defineStore('plant', {
  state: () => ({
    plants: [],
    logs: []
  }),
  getters: {
    getLogsForPlant: (state) => {
      return (plantId: string) => state.logs.filter((log) => {
        log.created = log.created.split('.')[0]
        return log.fk_plant === plantId
      })
    },
  },
  actions: {
    loadPlants() {
      pb.collection('plants').getFullList({
        sort: 'room',
        expand: 'logbook(plants).fk_plant'
      }).then(plants => {
        this.plants = plants
      }).catch((error) => console.log(error));

      pb.collection('logbook').getFullList({
        sort: '-created, fk_plant'
      }).then(logs => {
        this.logs = logs
      }).catch((error) => console.log(error));

      pb.collection('logbook').subscribe('*',  (e) => {
        this.logs.push(e.record);
        this.logs.sort((a,b) =>  new Date(b.created) - new Date(a.created));
      })
    },
    createLogEntry(creatorName: string, type: string, waterLevel: number, comment: string, plantId: string) {
      const data = {
        'creator_name': creatorName,
        'type': type,
        'waterlevel': waterLevel,
        'comment': comment,
        'fk_plant': plantId
      };

      pb.collection('logbook').create(data).then();
    },
    getLatestLog(plantId: string) {

      return this.logs.filter(log => log.fk_plant === plantId);

    },
  },
});
