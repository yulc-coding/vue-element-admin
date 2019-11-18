import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 左侧菜单是否折叠
    isCollapse: false
  },
  mutations: {
    switchCollapse(state) {
      state.isCollapse = !state.isCollapse;
    }
  },
  actions: {},
  modules: {}
});
