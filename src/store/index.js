import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // {
    //     compId,
    //     compName,
    //     props,
    //     models,
    //     style: {
    //         position: 'absolute'
    //     }
    // }
    preComps: [] // 画布中的组件树
  },
  getters: {
    getComp: state => compId => state.preComps.find(comp => comp.compId == compId)
  },
  mutations: {
    putComp(state, comp) {
      for(let i = 0; i < state.preComps.length; i++) {
        if(state.preComps[i].compId == comp.compId) {
          state.preComps.splice(i, 1, comp)
          return
        }
      }
      state.preComps.push(comp)
    }
  },
  actions: {
  },
  modules: {
  }
})
