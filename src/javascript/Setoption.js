import * as echarts from 'echarts'
import { ref, onMounted, watch, onBeforeUnmount, onBeforeMount, reactive } from "vue";
import axios from 'axios'
import { useQuasar } from 'quasar'
import timeline from '../javascript/Timeline'
import { sharpSignalCellularAlt, sharpCollectionsBookmark, sharp5g } from '@quasar/extras/material-icons-sharp'
import { matAllInbox } from '@quasar/extras/material-icons'
export default function Setoption (elementID) {
    //-----for Loading timer------
    const $q = useQuasar()
    let timer
    //----------------------------
    // 連接axios，get data
    async function axioss (url) {
        return await axios.get(url).then((res) => {
            let data = res.data
            return data
        }).catch((err) => {
            alert('連線失敗', err)
        })

    }

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
        // console.log('conver_sec', start, end)
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

    // 小數點後兩位
    function roundToTwo (num) {
        return +(Math.round(num + "e+2") + "e-2");
    }



    return {
        axioss, showLoading,
        channel_name_function,
        convert_sec, convert_sec2,
        roundToTwo
    }

}