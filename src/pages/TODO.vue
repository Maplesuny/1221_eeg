<template>
    <!-- <div class="q-pa-md"> -->
    <q-scroll-area style="top:60px;height:90%; max-width:500px;">
        <q-list bordered separator>
            <q-item v-for="todo in todos" :key="todo.id">
                <div class="q-pa-md">
                    <div class="q-gutter-sm">
                        <q-checkbox v-model="todo.done" />
                    </div>
                    <div class="q-px-sm"></div>
                </div>
                <q-item-section>
                    <!--第一個顯示大Title-->
                    <q-item-label overline>OVERLINE</q-item-label>
                    <q-item-label>{{ todo.title }}</q-item-label>
                </q-item-section>
                <div class="q-pa-sm">
                    <q-btn
                        ripple
                        round
                        icon="clear"
                        color="red"
                        class="q-ma-sm"
                        size="10px"
                        v-if="todo.done"
                        @click="removeTodo(todo.id)"
                    ></q-btn>
                </div>
                <!--病理特徵-->
                <q-item v-if="!todo.done">
                    <div class="q-pa-md">
                        <q-item-section>
                            <!-- <q-btn unelevated rounded color="primary">{{ seleted }}</q-btn> -->
                            <!-- <q-btn unelevated rounded color="primary">select</q-btn> -->
                            <selectd></selectd>
                        </q-item-section>
                    </div>
                </q-item>
            </q-item>
        </q-list>
        <!--用這樣會出現怪怪的-->
        <!-- <q-input outlined v-model="$props.inputText" @keypress.enter="addTodo" /> -->
        <q-input outlined v-model="newTodo" @keypress.enter="addTodo" />
        <q-btn @click="addTodo">Send</q-btn>
        <p>{{ inputText }}</p>
        <!-- <p>{{ aa }}</p> -->
    </q-scroll-area>
    <!-- </div> -->
</template>

<script>
import { ref, watch, computed } from 'vue'
import useTodo_function from '../hooks/useTodo'
import selectd from './dialog.vue'
import * as echarts from "echarts";
export default {
    props: {
        inputText: String
    },
    components: {
        selectd
    },
    setup (props, context) {
        const { todos, addTodo, removeTodo, newTodo } = useTodo_function(props.inputText)
        const seleted = ref('Unelevated')
        console.log('props value', props.inputText)

        watch(todos.value, () => {
            console.log('todos.value', todos.value)
        })

        watch(props.inputText, () => {
            console.log('watch props:', props.inputText)
        })

        const aa = computed(() => {
            return props.inputText
        })


        watch(newTodo, () => {
            newTodo.value = props.inputText
        })





        return {
            todos, addTodo, removeTodo, newTodo, seleted, aa,
            thumbStyle: {
                right: '4px',
                borderRadius: '5px',
                backgroundColor: '#027be3',
                width: '5px',
                opacity: 0.75
            },

            barStyle: {
                right: '2px',
                borderRadius: '9px',
                backgroundColor: '#027be3',
                width: '9px',
                opacity: 0.2
            }

        }
    },
}
</script>

<style scoped>
.q-pa-md {
    height: 65px;
}
</style>