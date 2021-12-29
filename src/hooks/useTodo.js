import { ref, computed } from 'vue'
import { useStore } from "vuex"

// 裡面寫操作TODO的動作，把功能隔離出來，再導入vue即可
export default function useTodo () {
    const store = useStore()
    const newTodo = ref('');
    const todos = computed(() => store.getters['todos'])
    function addTodo () {
        const value = newTodo.value && newTodo.value.trim();
        if (!value) {
            return;
        }
        const payload = {
            id: count_(),
            title: value,
            done: false
        }
        store.dispatch('ADD_TODO', payload)
        newTodo.value = '';
    }
    //計算id要設多少，賦予id
    let id_state = false
    function count_ () {
        let i
        for (i = todos.value.length; i <= todos.value.length; i++) {
            id_state = true
        }
        return i
    }

    function removeTodo (id) {
        store.dispatch('REMOVE_TODO', id)
    }

    return {
        addTodo,
        removeTodo,
        newTodo,
        todos,
    }


}