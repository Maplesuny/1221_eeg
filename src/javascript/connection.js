import { ref, onMounted, watch, onBeforeUnmount, onBeforeMount, reactive } from "vue";
import axios from 'axios'

export default function my_axios () {
    async function axioss (url) {
        return await axios.get(url).then((res) => {
            let data = res.data
            return data
        }).catch((err) => {
            allert('connections 連線失敗')
            console.log(err)
        })
    }

    return {
        axioss
    }
}