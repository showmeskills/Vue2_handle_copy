import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from "../vuex";
Vue.use(Vuex)
// vuex 目的就是统一管理状态 
// 可以修改状态 更新状态
// 给状态划分模块
export default new Vuex.Store({
  state: {
    app: 0
  },
  getters: {
    getApp: (state) => state.app,
  },
  mutations: {
    add(state, payload) {
      state.app += payload
    }
  },
  actions: {
    addA({
      commit
    }, payload) {
      setTimeout(() => {
        commit('add', payload)
      }, 1000)
    }
  },
  modules: {
    a: {
      //namespace:true,
      getters: { //计算属性在没有命名空间的时候会定义在根实例上
        //有命名空间可以通过命名空间来 划分 (使用模块的时候一定要增加命名空间)
        myAge(state) {
          return state.age + 20;
        }
      },
      state: {
        age: 200,
      },
      mutations: {
        add(state, payload) {
          state.age += payload
        }
      },
      modules: {
        c: {
          //namespace:true,
          getters: { //计算属性在没有命名空间的时候会定义在根实例上
            //有命名空间可以通过命名空间来 划分 (使用模块的时候一定要增加命名空间)
            myAge(state) {
              return state.age + 20;
            }
          },
          state: {
            age: 200,
          },
          mutations: {
            add(state, payload) {
              state.age += payload
            }
          },
        }
      }
    },
    b: {
      //namespace:true,
      state: {
        age: 410,
      },
      mutations: {
        add(state, payload) {
          state.age += payload
        }
      }
    }
  },
})

//1.状态 子模块的状态会定义在根模块上
//2.计算属性 子模块的计算属性会被直接添加到根模块上
//3.mutations 会收集同名的mutation
//4.action 会收集同名的action

// modules 的state上覆盖到根的state上