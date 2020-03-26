import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state, num = 1){
      state.count += num;
    }
  },
  getters:{
    score(state){
      return `一共点击了 ${state.count / 2} 次`
    }
  },
  actions: {
    asyncAdd({commit}){
      return new Promise(resolve=>{
        setTimeout(()=>{
          commit('add', 10);
          resolve({code: 200, mes: '成功'})
        }, 2000)
      })
    }
  },
  modules: {
  }
})
