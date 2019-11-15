import Vue from "vue";
import Vuex from "vuex";

import auth from "./stores/auth";
import items from "./stores/items";
import order from "./stores/order";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    }
  },
  getters: {
    error: s => s.error
  },
  actions: {},
  modules: {
    items,
    auth,
    order,

  },
});
