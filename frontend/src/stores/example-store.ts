import { defineStore } from 'pinia';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
    plants: []
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    listPlants(state) {
      return state.plants;
    },
  },
  actions: {
    increment() {
      this.counter++;
    },
    loadPlants() {
      pb.collection('plants').getFullList({
        sort: 'room',
      }).then(plants => {
        console.log("plants", plants)
        this.plants = plants
      }).catch((error) => console.log(error));
    }
  },
});
