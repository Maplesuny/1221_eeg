import * as echarts from 'echarts'
import { ref, onMounted, watch, onBeforeUnmount, onBeforeMount, reactive } from "vue";
import axios from 'axios'
import { useQuasar } from 'quasar'
import timeline from '../javascript/Timeline'
import { sharpSignalCellularAlt, sharpCollectionsBookmark } from '@quasar/extras/material-icons-sharp'
export default function Setoption (elementID, start, end, montage) {
    //-----for Loading timer------
    const $q = useQuasar()
    let timer
    //----------------------------
    let title = []
    let xAxis = []
    let series = []
    let grid = []
    let dataZoom = []
    let toolbox = []
    let brush = []
    // get channel pre number
    const channel_number_arr = [];
    var rangeArray = [
        [],
    ]

    let count_channel = [];
    var data

    // 將資料合併到save_arr ，format : [time,value]  value只有10秒資料
    let all_save_arr = []

    function opiton_function () {
        title.push({
            text: 'Beijing AQI',
            left: '1%'
        })

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
            left: "4.5%",
            right: '1%',
            containLabel: false
        })

        dataZoom.push([
            {
                type: 'inside',
                xAxisIndex: count_channel,
                zoomOnMouseWheel: 'ctrl'
            },
            {
                type: 'slider',
                show: true,
            }
        ])

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
                    // icon: "M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z",
                    icon: sharpSignalCellularAlt,
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

    function setOption (url) {
        const charDom = document.getElementById(elementID)
        let aa = {
            width: 1000 + 'px',
            height: 700 + 'px'
        }
        let myChart = echarts.init(charDom, null, aa)
        let getW = document.getElementById(elementID).clientWidth
        let getH = document.getElementById(elementID).clientHeight
        charDom.style.width = getW + 'px'
        charDom.style.height = getH + 700 + 'px'
        axios.get(url).then((res) => {
            let data = res.data
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '5%',
                    right: '%',
                    bottom: '10%'
                },
                xAxis: {
                    data: data.map(function (item) {
                        return item[0];
                    })
                },
                yAxis: {},
                toolbox: {
                    right: 5,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                dataZoom: [
                    {
                        startValue: '2014-06-01'
                    },
                    {
                        type: 'inside'
                    }
                ],
                series: {
                    name: 'Beijing AQI',
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        lineStyle: {
                            color: '#333'
                        },
                        data: [
                            {
                                yAxis: 50
                            },
                            {
                                yAxis: 100
                            },
                            {
                                yAxis: 150
                            },
                            {
                                yAxis: 200
                            },
                            {
                                yAxis: 300
                            }
                        ]
                    }
                }
            }
            option && myChart.setOption(option);

        }).catch((err) => {
            alert('連線失敗，請檢察連線')
            console.log(
                'Error Message :', err
            )
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
    function convert_sec (arr, end, number, idx, data) {
        const base = end / number
        const list_array = []
        let sum = 0
        for (let i = 0; i < number; i++) {
            sum = sum + base
            list_array.push([sum, data[idx]['value'][i] - 400 * idx])
        }
        arr.push(list_array)
        return arr
    }


    function A1_A2 (url) {
        const charDom = document.getElementById(elementID)
        let aa = {
            width: 1800 + 'px',
            height: 600 + 'px'
        }
        let myChart = echarts.init(charDom, null, aa)

        axios.get(url).then((res) => {
            data = res.data
            const default_color = ref("#3a3c42")
            // Count Channel number [0,1,2,3,...16]

            for (let i = 0; i < Object.keys(data).length; i++) {
                count_channel.push(i);
            }

            channel_name_function(channel_array.value, data.length, data)

            // 將資料合併到save_arr ，format : [time,value] 
            let save_arr = []
            for (let i = 0; i < data.length; i++) {
                convert_sec(save_arr, end, 512 * end, i, data);
            }

            console.log(save_arr)

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

            opiton_function()

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
                    min: 385 * (-1 * data.length),
                    // min: -7315,
                    max: 300,
                },
                series: series,
                grid: grid,
                dataZoom: dataZoom,
                toolbox: toolbox,
                brush: brush
            }
            option && myChart.setOption(option);

            timeline(1, 1, rangeArray)

        }).catch((err) => {
            alert('連線失敗，請檢察連線')
            console.log(
                'Error Message :', err
            )
        })

    }


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
        setOption,
        showLoading,
        A1_A2

    }

}