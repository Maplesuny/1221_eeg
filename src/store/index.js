// import { store } from 'quasar/wrappers'
// import { createStore } from 'vuex'

// // import example from './module-example'

// /*
//  * If not building with SSR mode, you can
//  * directly export the Store instantiation;
//  *
//  * The function below can be async too; either use
//  * async/await or return a Promise which resolves
//  * with the Store instance.
//  */

// export default store(function (/* { ssrContext } */) {
//   const Store = createStore({
//     modules: {
//       // example 對應上面的example，可以自定義自己的拉來用。
//     },

//     // enable strict mode (adds overhead!)
//     // for dev mode and --debug builds only
//     strict: process.env.DEBUGGING
//   })

//   return Store
// })


import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    count: 110,
    todos: [
      {
        id: 1,
        title: "This is long, I hope that it gets abbreviated",
        done: false
      },
      {
        id: 2,
        title: "Scary Vue 3 presentation",
        done: true
      },
      {
        id: 3,
        title: "Find the good bits in Vue 3",
        done: false
      }
    ],
  },
  actions: {
    ADD_TODO ({ commit }, payload) {
      commit('SET_TODO', payload);
    },
    REMOVE_TODO ({ commit }, payload) {
      commit('DELETE_TODO', payload)
    },
  },
  mutations: {
    SET_TODO (state, payload) {
      state.todos = [...state.todos, payload];
      // console.log(state.todos)
    },
    DELETE_TODO (state, payload) {
      const index = state.todos.findIndex(todo => todo.id === payload);
      state.todos.splice(index, 1);
      // console.log('delete', index)
    }
  },
  getters: {
    todos (state) {
      return state.todos
    }
  },
  // plugins: [
  //   createPersistedState()
  // ]
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})