import * as echarts from 'echarts'
import { ref, onMounted, watch, onBeforeUnmount, onBeforeMount, reactive } from "vue";
import axios from 'axios'
import { useQuasar } from 'quasar'
import timeline from '../javascript/Timeline'
import { sharpSignalCellularAlt, sharpCollectionsBookmark, sharp5g } from '@quasar/extras/material-icons-sharp'
import { matAllInbox } from '@quasar/extras/material-icons'
export default function Setoption (elementID, montage) {
    //-----for Loading timer------
    const $q = useQuasar()
    let timer
    //----------------------------
    let title = []
    let xAxis = []
    let grid = []
    let dataZoom = []
    let toolbox = []
    let brush = []
    const default_color = ref("#3a3c42")
    var myChart


    // get channel pre number
    const channel_number_arr = [];

    var rangeArray = [
        [],
    ]

    // 控制dataZoom可以操控多個chanenl, format :[0,1,2,3....x]
    let count_channel = [];

    // 連接axios，get data
    async function axioss (url) {
        return await axios.get(url).then((res) => {
            let data = res.data
            return data
        }).catch((err) => {
            alert('連線失敗', err)
        })

    }

    // 設定基本option
    function opiton_function (start, end) {
        xAxis.push({
            type: "value",
            show: true,
            splitLine: {
                // 坐標軸分隔線
                show: true,
                lineStyle: {
                    color: ["#626366"],
                    width: 0.5,
                    type: "solid",
                    join: "miter",
                },
            },
            axisLabel: {
                show: true,
            },
            min: start,
            max: end,
            interval: 1,
        })
        grid.push({
            left: "100px",
            right: '1%',
            containLabel: false
        })
        dataZoom.push(
            [
                {
                    type: 'inside',
                    xAxisIndex: count_channel,
                    zoomOnMouseWheel: 'alt'
                },
                {
                    type: 'slider',
                    show: true,
                }
            ]
        )
        toolbox.push({
            // right: 4,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {},
                mytools: {
                    show: true,
                    title: "Clear",
                    icon: "M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z",
                    // icon: matAllInbox,
                    onclick: function () {
                        // myChart.dispatchAction({
                        //     type: "restore",
                        // });
                        // All_data_Option(start_time.value, end_time.value)
                    },
                },
                mytools2: {
                    show: true,
                    title: "aaaa",
                    // icon: 'M 0 0 M 0 -1 L 2 1 M 2 0 M 0 -1 L 0 1 M 1 1 L 2 1 L 0 1 L 0 1 M 0 1 L 2 -1 M 2 1 L 2 1 M 2 1 L 2 1 L 2 0 L 2 -1 M 2 -1 L 2 -1 M 2 -1 L 2 -1 M 2 -1 L 1 -1 M 1 -1 L 0 -1',
                    icon: 'M150 0 L75 200 L225 200 Z',
                    // icon: sharpSignalCellularAlt,
                    onclick: function () {
                        myChart.dispatchAction({
                            type: "restore",
                        });
                        page.value = Minpage.value
                        jump_to.value = null
                    },
                },
            }
        })

        brush.push({
            id: 'brush',
            geoIndex: 'all',
            seriesIndex: 'all',
            brushLink: 'all',
            toolbox: ['rect', 'keep', 'lineX', 'clear'],
            inBrush: {
                opacity: 1,
                symbolSize: 20,
            },
            // 調整是否可平移
            transformable: false,
            throttleType: 'debounce',
            throttleDelay: 600,
            //   brushMode: 'multiple',
            brushStyle: {
                borderWidth: 3,
                color: 'rgba(245,39,56,0)',
                borderColor: 'rgba(220,20,57,0.8)',
            },
        })
    }

    // 取得channel 名稱
    let channel_array = ref([])
    function channel_name_function (arr, arr_length, data) {
        for (let i = 0; i < arr_length; i++) {
            arr.push(data[i]['id'])
        }
        return arr
    }

    // 資料與秒數合併 ==> arr[秒數,資料]
    function convert_sec (arr, start, end, idx, data) {
        // 總筆數
        let total_number = end * 512
        //將筆數傳換為秒數，每筆幾秒
        let convert = end / total_number
        let conver_arr = []
        let sum = 0
        console.log('conver_sec', start, end)
        for (let i = 0; i < total_number; i++) {
            sum = sum + convert
            if (sum > start) {
                conver_arr.push([sum, data[idx]['value'][i] - 500 * idx])
            } else {
                // if start/end 10/40  , at least start > 10 ,then i will start count
                i = 0
            }
        }
        arr.push(conver_arr)
        // console.log('arr_length', arr[idx].length)
    }

    //dynamic_10sdata用
    function convert_sec2 (arr, start_time, end_time, idx, data) {
        // 總筆數
        let total_number = end_time * 512
        // 將筆數換為秒數 
        let conver = end_time / total_number
        let conver_arr = []
        let sum = 0
        for (let i = 0; i < total_number; i++) {
            sum = sum + conver
            conver_arr.push([sum, data[idx]['value'][i] - 500 * idx])
        }
        // 要扣掉的筆數,
        let delete_number = start_time * 512
        // console.log(delete_number)
        if (delete_number === 0) {
            arr.push(conver_arr)
        } else {
            for (let j = 0; j < delete_number; j++) {
                // 從頭開始移除
                // conver_arr.shift()
                // 從後面移除
                conver_arr.pop()
            }
            arr.push(conver_arr)
        }

        return arr
    }


    async function show_option (url, start, end) {
        const charDom = document.getElementById(elementID)
        let series = []
        let aa = {
            width: 1600 + 'px',
            height: 670 + 'px'
        }
        myChart = echarts.init(charDom, null, aa)

        let data = await axioss(url)
        console.log('收進來的data', data)

        // Count Channel number [0,1,2,3,...16]

        for (let i = 0; i < Object.keys(data).length; i++) {
            count_channel.push(i);
        }

        channel_name_function(channel_array.value, data.length, data)

        // 將資料合併到save_arr ，format : [time,value] 
        let save_arr = []
        for (let i = 0; i < data.length; i++) {
            convert_sec(save_arr, start, end, i, data);
        }

        channel_array.value.forEach(function (egg_parameter, idx) {
            // channel_array[idx] , idx = 0 , is F1-C3  ，這裡拆要change
            let de = data.length - 1 - idx
            let arr_split = channel_array.value[de].split("");
            for (let l = 0; l < 3; l++) {
                let conver_number = Number(arr_split[l]);
                if (!isNaN(conver_number)) {
                    channel_number_arr.push(conver_number);
                    if (conver_number % 2 === 0) {
                        default_color.value = "#1607ed";
                    } else if (conver_number % 2 != 0) {
                        default_color.value = "#ed070f";
                    }
                }
            }
            if (idx === 0) {
                default_color.value = "#0c0d0c";
            }
            if (arr_split[1] == 'z') {
                default_color.value = "#0bb30b";
            }
            series.push({
                type: "line",
                name: egg_parameter,
                data: save_arr[de],
                symbol: "none",
                smoth: true,
                color: default_color.value,
            });

        })

        opiton_function(start, end)
        let option = {
            animation: false,
            xAxis: xAxis,
            yAxis: {
                show: false,
                type: "value",
                scale: true,
                axisLabel: {
                    show: true,
                    showMinLabel: true,
                    showMaxLabel: true,
                },
                // 網格線
                splitLine: {
                    show: false,
                },
                min: 495 * (-1 * data.length),
                // min: -7315,
                max: 300,
            },
            series: series,
            grid: grid,
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: count_channel,
                    zoomOnMouseWheel: 'alt'
                },
                {
                    type: 'slider',
                    show: true,
                }
            ],

            toolbox: toolbox,
            brush: brush
        }
        option && myChart.setOption(option);

        timeline(1, 1, rangeArray)

    }

    async function dynamic_10sdata (page, montage_type) {
        // console.log('pageis', page)
        let dynamic_start = (page * 10) - 10
        let dynamic_end = page * 10
        console.log('dynamic', dynamic_start, dynamic_end)
        let url =
            "http://127.0.0.1:8000/api/v1/eegData?start_time=" +
            dynamic_start +
            "&end_time=" +
            dynamic_end +
            "&montage_type=" +
            montage_type;
        let series1 = []
        let Data = await axioss(url)
        // console.log(Data)
        // 將資料合併到save_arr ，format : [time,value]  value只有10秒資料
        let all_save_arr = []
        for (let i = 0; i < Data.length; i++) {
            // convert_sec(all_save_arr, dynamic_start, dynamic_end, i, Data);
            convert_sec2(all_save_arr, dynamic_start, dynamic_end, i, Data)
        }

        console.log(all_save_arr)

        let next_page_value = 0
        channel_array.value.forEach(function (egg_parameter, idx) {

            let de = Data.length - 1 - idx
            // console.log('Daa', all_save_arr[de])
            let arr_split = channel_array.value[de].split("");
            for (let l = 0; l < 3; l++) {
                let conver_number = Number(arr_split[l]);
                if (!isNaN(conver_number)) {
                    channel_number_arr.push(conver_number);
                    if (conver_number % 2 === 0) {
                        default_color.value = "#1607ed";
                    } else if (conver_number % 2 != 0) {
                        default_color.value = "#ed070f";
                    }
                }
            }
            if (idx === 0) {
                default_color.value = "#0c0d0c";
            }
            if (arr_split[1] == 'z') {
                default_color.value = "#0bb30b";
            }
            series1.push({
                type: "line",
                name: egg_parameter,
                data: all_save_arr[de],
                symbol: "none",
                smoth: true,
                color: default_color.value,
            });
        })
        let option = {
            animation: false,
            xAxis: {
                type: "value",
                show: true,
                splitLine: {
                    // 坐標軸分隔線
                    show: true,
                    lineStyle: {
                        color: ["#626366"],
                        width: 0.5,
                        type: "solid",
                        join: "miter",
                    },
                },
                axisLabel: {
                    formatter: function (value) {
                        // 從start time抓開頭，從開頭+value
                        next_page_value = dynamic_start
                        next_page_value = next_page_value + value
                        return next_page_value
                    },
                    show: true,
                },
                min: 0,
                max: 10,
                interval: 1,
            },
            yAxis: {
                show: false,
                type: "value",
                scale: true,
                axisLabel: {
                    show: true,
                    showMinLabel: true,
                    showMaxLabel: true,
                },
                // 網格線
                splitLine: {
                    show: false,
                },
                min: 495 * (-1 * Data.length),
                max: 300,
            },
            series: series1,
            grid: grid,
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: count_channel,
                    zoomOnMouseWheel: 'alt'
                },
                {
                    type: 'slider',
                    show: true,
                }
            ],
            toolbox: toolbox,
            brush: brush,
        }
        myChart.setOption(option);

    }


    // Loading 
    function showLoading () {
        $q.loading.show({
            message: 'Get Data information. Please wait...',
            boxClass: 'bg-grey-2 text-grey-9',
            spinnerColor: 'primary'
        })
        // hiding in 3s
        timer = setTimeout(() => {
            $q.loading.hide()
            timer = void 0
        }, 1000)
    }

    return {
        showLoading, axioss,
        show_option,
        dynamic_10sdata


    }

}