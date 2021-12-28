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
</template>

<script>
import {
  ref,
  onMounted,
  watch,
  onBeforeUnmount,
  onBeforeMount,
  reactive,
} from "vue";
import * as echarts from "echarts";
import axios from "axios";
import option from "../javascript/Setoption";
export default {
  setup () {
    // 後端api的port
    const port = '8000'
    const start_time = ref(0);
    const end_time = ref(10);
    const montage_type = ref(1);
    const channel_array = ref([]);
    const default_color = ref("#3a3c42");
    let jump_to = ref(null);
    var myChart;
    // get channel pre number
    const channel_number_arr = [];
    // 控制dataZoom可以操控多個chanenl, format :[0,1,2,3....x]
    let count_channel = [];
    const page = ref(1);
    const Minpage = ref(1);
    // const Maxpage = ref(end_time.value / 10)
    const Maxpage = ref(10);
    // 要傳出去的值
    const sec_range = ref("");
    const grid = [];
    const toolbox = [];
    const brush = [];
    const time_url = "http://127.0.0.1:" + port + "/api/v1/Time_Information";
    const json_url =
      "http://127.0.0.1:" + port + "/api/v1/eegData?start_time=" +
      start_time.value +
      "&end_time=" +
      end_time.value +
      "&montage_type=" +
      montage_type.value;
    // echart brush用到
    let range_start;
    let range_end;
    let coor_start = ref(0);
    let coor_end = ref(0);
    let coordRange_start = ref(0);
    let corrdRange_end = ref(0);
    // 框選數量有幾個
    let brush_count = ref(0);
    // 儲存時間
    let save_cor_time = [];
    var rangeArray = [[]];
    let brush_ares0 = ref([]);
    let aaaa = ref([]);
    let bbbb = ref([]);
    aaaa.value = [
      [1065, 1204],
      [298, 399],
    ]; // range裡面的樣子
    bbbb.value = [
      [
        [1065, 1204],
        [298, 399],
      ],
      [
        [20, 1204],
        [298, 399],
      ],
    ];
    console.log("aaaaa", aaaa.value);
    console.log("bbbb", bbbb.value);


    const {
      axioss,
      channel_name_function,
      convert_sec,
      convert_sec2,
      roundToTwo,
    } = option("Echarts");
    // get 最大秒數
    async function SecTopage (url) {
      let api_time = await axioss(url);
      // console.log(api_time)
      let second = Math.ceil(api_time[1] / 10); // ceil 無條件進入
      Maxpage.value = second;
    }
    // 上一頁
    function pre_button () {
      page.value--;
      dynamic_10sdata();
      clear();
    }
    //下一頁
    function next_button () {
      page.value++;
      dynamic_10sdata();
      clear();
      console.log('下一頁的brush0', brush_ares0.value)
    }
    // jump_to送出
    function send_page () {
      // console.log(jump_to.value)
      if (jump_to.value != 0) {
        page.value = Number(jump_to.value);
        // dynamic_10sdata('next')
        if (isNaN(Number(jump_to.value))) {
          // 非數字
          alert("Please check input, Input type is [Number]");
        } else if (Number(jump_to.value) > Maxpage.value) {
          // 大於最大頁數
          alert(
            "Your page greater than " + Maxpage.value + " ,Please ctry again"
          );
        } else if (Number(jump_to.value) < 1) {
          alert("Page number is not found , Please try again");
        } else {
          // dynamic_10sdata()
          dynamic_10sdata(page.value, montage_type.value);
        }
      } else {
        alert(
          "Page number " +
          "'" +
          jump_to.value +
          "'" +
          "  is not found , Please try again!"
        );
      }
    }
    // base option
    function Setting_option () {
      console.log("mychart", myChart);
      grid.push({
        left: "100px",
        right: "1%",
        containLabel: false,
      });
      toolbox.push({
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          saveAsImage: {},
          mytools: {
            show: true,
            title: "Clear",
            icon: "M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z",
            onclick: function () {
              // clear()
              // myChart.dispatchAction({
              //     type: "brush",
              //     areas: [
              //         {
              //             xAxisIndex: 0,
              //             brushType: "rect",
              //             range: [
              //                 [1424, 1552],
              //                 [124, 215],
              //             ],
              //         },
              //         {
              //             xAxisIndex: 0,
              //             brushType: "rect",
              //             range: [
              //                 [1108, 1281],
              //                 [252, 358],
              //             ],
              //         },
              //         {
              //             xAxisIndex: 0,
              //             brushType: "rect",
              //             range: [
              //                 [759, 885],
              //                 [265, 373],
              //             ],
              //         },
              //     ],
              // });
              // All_data_Option(start_time.value, end_time.value)
            },
          },
          mytools2: {
            show: true,
            title: "delete",
            icon: "M14 31.998h36;M28 18L14 32l14 14",
            // icon: sharpSignalCellularAlt,
            onclick: function () {
              //   let brush_last_index = brush_ares0.value.length - 1;
              //   console.log("onclick", brush_ares0.value[brush_last_index]);
              myChart.dispatchAction({
                type: "brush",
                areas: [
                  {
                    xAxisIndex: 0,
                    brushType: "rect",
                    range: brush_ares0.value
                  },
                ],
              });
              // brush_ares0.value.pop();
            },
          },
          mytools3: {
            show: true,
            title: "restore",
            // icon: 'M 0 0 M 0 -1 L 2 1 M 2 0 M 0 -1 L 0 1 M 1 1 L 2 1 L 0 1 L 0 1 M 0 1 L 2 -1 M 2 1 L 2 1 M 2 1 L 2 1 L 2 0 L 2 -1 M 2 -1 L 2 -1 M 2 -1 L 2 -1 M 2 -1 L 1 -1 M 1 -1 L 0 -1',
            icon: "M10.168 34.947a26.016 26.016 0 1 1 7.45 15.432;M2 23l8.168 11.947L20.986 25",
            // icon: sharpSignalCellularAlt,
            onclick: function () {
              myChart.dispatchAction({
                type: "restore",
              });
              page.value = Minpage.value;
              jump_to.value = null;
            },
          },
        },
      });
      brush.push({
        id: "brush",
        geoIndex: "all",
        seriesIndex: "all",
        brushLink: "all",
        toolbox: ["rect", "keep", "lineX", "clear"],
        inBrush: {
          opacity: 1,
          symbolSize: 20,
        },
        // 調整是否可平移
        transformable: false,
        throttleType: "debounce",
        throttleDelay: 600,
        //   brushMode: 'multiple',
        brushStyle: {
          borderWidth: 3,
          color: "rgba(245,39,56,0)",
          borderColor: "rgba(220,20,57,0.8)",
        },
      });
    }
    //---------------------- Echarts Action -----------------------
    function clear () {
      myChart.dispatchAction({
        type: "brush",
        areas: [],
      });
    }
    async function dynamic_10sdata () {
      let dynamic_start = page.value * 10 - 10;
      let dynamic_end = page.value * 10;
      console.log(
        "dynamic 秒數: ",
        dynamic_start,
        dynamic_end + " 頁數: ",
        page.value
      );
      let url =
        "http://127.0.0.1:" + port + "/api/v1/eegData?start_time=" +
        dynamic_start +
        "&end_time=" +
        dynamic_end +
        "&montage_type=" +
        montage_type.value;
      let series1 = [];
      let Data = await axioss(url);
      console.log(Data);
      // 將資料合併到save_arr ，format : [time,value]  value只有10秒資料
      let all_save_arr = [];
      for (let i = 0; i < Data.length; i++) {
        // convert_sec(all_save_arr, dynamic_start, dynamic_end, i, Data);
        convert_sec2(all_save_arr, dynamic_start, dynamic_end, i, Data);
      }
      let next_page_value = 0;
      channel_array.value.forEach(function (egg_parameter, idx) {
        let de = Data.length - 1 - idx;
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
        if (arr_split[1] == "z") {
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
      });
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
              next_page_value = dynamic_start;
              next_page_value = next_page_value + value;
              return next_page_value;
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
            type: "inside",
            xAxisIndex: count_channel,
            zoomOnMouseWheel: "alt",
          },
          {
            type: "slider",
            show: true,
          },
        ],
        toolbox: toolbox,
        brush: brush,
      };
      myChart.setOption(option);
    }
    async function SetOption (url, start, end) {
      const chartDom = document.getElementById("Echarts");
      let series = [];
      let echarts_WH = {
        width: 1600 + "px",
        height: 670 + "px",
      };
      myChart = echarts.init(chartDom, null, echarts_WH);
      let data = await axioss(url);
      // Count Channel number [0,1,2,3,...16]
      for (let i = 0; i < Object.keys(data).length; i++) {
        count_channel.push(i);
      }
      channel_name_function(channel_array.value, data.length, data);
      // 將資料合併到save_arr ，format : [time,value]
      let save_arr = [];
      for (let i = 0; i < data.length; i++) {
        convert_sec(save_arr, start, end, i, data);
      }
      channel_array.value.forEach(function (eeg_parameter, idx) {
        let de = data.length - 1 - idx;
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
        if (arr_split[1] == "z") {
          default_color.value = "#0bb30b";
        }
        series.push({
          type: "line",
          name: eeg_parameter,
          data: save_arr[de],
          symbol: "none",
          smoth: true,
          color: default_color.value,
        });
      });
      Setting_option();
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
            show: true,
          },
          min: start,
          max: end,
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
          min: 495 * (-1 * data.length),
          max: 300,
        },
        series: series,
        grid: grid,
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: count_channel,
            zoomOnMouseWheel: "alt",
          },
          {
            type: "slider",
            show: true,
          },
        ],
        toolbox: toolbox,
        brush: brush,
      };
      myChart.setOption(option);
      myChart.on("brushSelected", function (params) {
        let brushComponent = params.batch[0];
        if (brushComponent.areas[0] !== undefined) {
          let type = brushComponent.areas[0].brushType;
          select(params, type);
          console.log("brush_ares0內存的:", brush_ares0.value);
        }
      });
    }
    // 至多兩個，用來比對前後兩值是否相同
    let compare_two = [];


    let newpage1 = []
    // 判斷是否為新的一頁
    function newpage (page) {
      newpage1.push(page)
    }


    function select (params, brushType) {
      console.log("Brushtype", brushType);
      let brushComponent = params.batch[0];
      brush_count.value = params.batch[0].areas.length;
      // 框選數量
      let brush_number = params.batch[0].areas.length;
      console.log("框選數量", brush_number);
      console.log(params.batch[0]);
      //裡面有三筆的話，areas_length -1移除前兩筆(最後一筆不算) (Queue FIFO)，不移除的話每次框都會疊加0,1,2,3...
      for (let i = 0; i < brush_count.value - 1; i++) {
        // console.log(params.batch[0].areas[i])
        params.batch[0].areas.shift();
      }
      // 框起來的值，後面比對用
      let select_value = brushComponent.areas[0].range[0][0];

      // 儲存所框選的座標
      brush_ares0.value.push([
        params.batch[0].areas[0].range[0],
        params.batch[0].areas[0].range[1],
      ]);

      // single brush時要確定是否同一行為(比較所框選的值)
      if (compare_two.length < 2) {
        compare_two.push(select_value)
      } else {
        compare_two.shift()
        compare_two.push(select_value)
      }

      if (compare_two[0] != compare_two[1] && brush_number === 1) {
        if (brush_ares0.value.length > 1) {
          // console.log('comparte兩個值不相等且框選1個')
          console.log('移除brush0', brush_ares0.value[0])
          brush_ares0.value.shift()
        }

      }

      console.log("所框選的值", select_value);
      console.log('compare_to:', compare_two)



      // 判斷X軸是LineX 還是 rect
      if (brushType !== "lineX") {
        range_start = brushComponent.areas[0].range[0][0];
        range_end = brushComponent.areas[0].range[0][1];
      } else {
        range_start = brushComponent.areas[0].range[0];
        range_end = brushComponent.areas[0].range[1];
      }
      // 再將rnage座標轉作為xy的座標(coordRange的值)
      coordRange_start.value = myChart.convertFromPixel({ seriesIndex: 0 }, [
        range_start,
        range_end,
      ])[0];
      corrdRange_end.value = myChart.convertFromPixel({ seriesIndex: 0 }, [
        range_end,
        range_start,
      ])[0];
      console.log("range_start/end", range_start, range_end);
      console.log("brushComponent", brushComponent);
      console.log(
        "coordRange_start/end",
        coordRange_start.value,
        corrdRange_end.value
      );
      sec_range.value =
        roundToTwo(coordRange_start.value) +
        " s 到 " +
        roundToTwo(corrdRange_end.value) +
        "s";
      // 轉換成筆數存入arr
      coor_start.value = Math.round(coordRange_start.value * 512);
      coor_end.value = Math.round(corrdRange_end.value * 512);
      save_cor_time.push(coor_start.value);
    }

    watch(brush_ares0.value, () => {
      console.log("brush_area0", brush_ares0.value);
    });

    onBeforeMount(() => {
      SecTopage(time_url);
    });
    onMounted(() => {
      SetOption(json_url, start_time.value, end_time.value);
    });
    return {
      page,
      Minpage,
      Maxpage,
      jump_to,
      pre_button,
      next_button,
      send_page,
    };
  },
};
</script>