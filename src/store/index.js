import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    offer: [],
  },
  actions: {
    offerSetter({ commit }, payload) {
      commit('SETOFFER', payload);
    },
  },
  mutations: {
    SETOFFER(state, payload) {
      state.offer = payload;
    },
  },
  getters: {
    getOffer(state) {
      return state.offer;
    },
  },
});
