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
        const montage_type = ref(2);
        const page = ref(1)
        const Minpage = ref(1)
        const Maxpage = ref(0)
        const jump_to = ref(null)
        const json_url =
            "http://127.0.0.1:8000/api/v1/eegData?start_time=" +
            start_time.value +
            "&end_time=" +
            end_time.value +
            "&montage_type=" +
            montage_type.value;

        const time_url = 'http://127.0.0.1:8000/api/v1/Time_Information'

        console.log(json_url)
        // const json_url = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/aqi-beijing.json'
        const { axioss, show_option, showLoading, dynamic_10sdata } = option("Echarts", start_time.value, end_time.value, montage_type.value)

        // get 最大秒數
        async function SecTopage (url) {
            let api_time = await axioss(url)
            console.log(api_time)
            let second = Math.ceil(api_time[1] / 10)  // ceil 無條件進入
            Maxpage.value = second
        }

        // 上一頁
        function pre_button () {
            page.value--
            dynamic_10sdata(page.value, montage_type.value)
        }

        // 下一頁
        async function next_button () {
            page.value++
            dynamic_10sdata(page.value, montage_type.value)
        }

        function send_page () {
            // console.log(jump_to.value)
            if (jump_to.value != 0) {
                page.value = Number(jump_to.value)
                // dynamic_10sdata('next')
                if (isNaN(Number(jump_to.value))) {
                    // 非數字
                    alert('Please check input, Input type is [Number]')
                } else if (Number(jump_to.value) > Maxpage.value) {
                    // 大於最大頁數
                    alert('Your page greater than ' + Maxpage.value + ' ,Please ctry again')
                } else if ((Number(jump_to.value) < 1)) {
                    alert('Page number is not found , Please try again')
                } else {
                    // dynamic_10sdata()
                    dynamic_10sdata(page.value, montage_type.value)
                }
            } else {
                alert('Page number ' + "'" + jump_to.value + "'" + '  is not found , Please try again!')
            }
        }


        showLoading()
        onBeforeMount(() => {
            SecTopage(time_url)
        })
        onMounted(() => {
            show_option(json_url, start_time.value, end_time.value)
        })

        return {
            page, Minpage, Maxpage,
            next_button, pre_button, send_page, jump_to
        }
    },
}
</script>