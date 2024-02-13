import { defineStore } from 'pinia';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// const getLogbookForPlant = (plantId) => {
//   pb.collection('logbook').getList(1, 50, {
//     filter: `fk_plant = ${plantId}`,
//   }).then(logs => {
//     console.log("plant logs", plantId, logs)
//   });
// }

export const usePlantStore = defineStore('plant', {
  state: () => ({
    plants: [],
    logs: []
  }),
  getters: {
    getLogsForPlant: (state) => {
      return (plantId: string) => state.logs.filter((log) => {
        return log.fk_plant === plantId
      })
    },

    // testGetPlantStatus: (state) => {
    //   return (plantId: string) => {
    //     const plantLogs = state.logs.filter((log: object) => {
    //           return log.fk_plant === plantId
    //     });
    //
    //     const latestPlantLog: object = plantLogs[0];
    //
    //     console.log('latestPlantLogsss', latestPlantLog)
    //     const plant = state.plants.filter(plant => plant.id === plantId);
    //     const dryingInterval: number = plant.drying_interval * 86400000;
    //
    //     const currentDate: number = new Date().getTime();
    //     const latestLogDate: number = new Date(latestPlantLog.created).getTime();
    //
    //     // Check if last log entry is older than 2 days
    //     if (latestLogDate + 172800000 < currentDate) {
    //       if(latestLogDate + dryingInterval <= currentDate && latestPlantLog.waterlevel === 0) {
    //         return 'Water';
    //       } else {
    //         console.log('current dAte', currentDate)
    //         console.log('lates date', latestLogDate)
    //         console.log('date difference', latestLogDate + 172800000 < currentDate)
    //         return 'Check';
    //       }
    //     } else {
    //       return 'OK';
    //     }
    //   }
    // }
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
        sort: '-created, fk_plant'
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
