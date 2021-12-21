<template>
    <div id="Echarts"></div>
    <div class="flex flex-center items-center full-width">
        <!-- q-pb-lg  -->
        <q-btn @click="pre_button" v-bind:disabled="page <= Minpage">上一頁</q-btn>
        <span class="q-ml-md">第 {{ page }} 頁 / 共 {{ Maxpage }}頁</span>
        <q-btn @click="next_button" v-bind:disabled="page >= Maxpage" class="q-ml-md">下一頁</q-btn>
        <span class="q-ml-md">跳至</span>
        <q-input outlined v-model="jump_to" class="pagination-input" placeholder="請輸入頁數" mask="##"></q-input>
        <span class="q-ml-md">頁</span>
        <q-btn @click="send_page" class="q-ml-md" v-bind:disable="jump_to > Maxpage">送出</q-btn>
        <!-- <q-btn @click="send_page" v-else disable class="q-ml-md">送出</q-btn> -->
    </div>
    <div id="timeline-container"></div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount, onBeforeMount, reactive } from "vue";
import * as echarts from 'echarts'
import axios from 'axios'
import option from '../javascript/Setoption'

export default {
    setup () {
        const start_time = ref(0);
        const end_time = ref(10);
        const montage_type = ref(1);
        const json_url =
            "http://127.0.0.1:8000/api/v1/eegData?start_time=" +
            start_time.value +
            "&end_time=" +
            end_time.value +
            "&montage_type=" +
            montage_type.value;


        console.log(json_url)
        // const json_url = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/aqi-beijing.json'
        const { setOption, A1_A2, showLoading } = option("Echarts", start_time.value, end_time.value, montage_type.value)

        showLoading()
        onMounted(() => {
            A1_A2(json_url)
            // setOption(json_url)
        })
    },
}
</script>