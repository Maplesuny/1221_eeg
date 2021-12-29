<template>
    <div class="q-pa-md q-gutter-sm">
        <q-btn
            unelevated
            rounded
            :color="color"
            @click="button_up = true"
            v-model="symptom"
        >{{ select_button }}</q-btn>
        <q-dialog v-model="button_up">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Set Symptom</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-pt-none" style="width: 550px; height: 30vh">
                    <div class="q-pa-md q-gutter-sm" style="display: flex">
                        <div class="q-gutter-sm">
                            <q-radio dense v-model="symptom" val="Normal" label="Normal" />
                            <q-radio dense v-model="symptom" val="AbNormal" label="AbNormal" />
                        </div>

                        <div class="q-px-sm q-pt-sm">
                            Your selection is:
                            <q-badge
                                color="white"
                                style="font-size: 15px;"
                                align="middle"
                                text-color="indigo-9"
                            >{{ symptom }}</q-badge>
                        </div>
                    </div>
                    <q-separator />
                    <div class="q-pa-md" style="max-width: 500px">
                        <div class="q-gutter-xs">
                            <q-checkbox
                                v-model="selection"
                                val="Fp1-A1"
                                label="Fp1-A1"
                                color="teal"
                            />
                            <q-checkbox v-model="selection" val="F3-A1" label="F3-A1" color="teal" />
                            <q-checkbox v-model="selection" val="C3-A1" label="C3-A1" color="teal" />
                            <q-checkbox v-model="selection" val="O1-A1" label="C4-A1" color="teal" />
                            <q-checkbox
                                v-model="selection"
                                val="teal4"
                                label="Fp2-A2"
                                color="teal"
                            />
                            <q-checkbox
                                v-model="selection"
                                val="teal5"
                                label="Fp4-A4"
                                color="teal"
                            />
                            <q-checkbox v-model="selection" val="teal6" label="O2-A2" color="teal" />
                            <q-checkbox v-model="selection" val="teal7" label="F7-A1" color="teal" />
                            <q-checkbox v-model="selection" val="teal8" label="T3-A1" color="teal" />
                            <q-checkbox v-model="selection" val="teal9" label="T5-A1" color="teal" />
                            <q-checkbox
                                v-model="selection"
                                val="teal10"
                                label="F8-A2"
                                color="teal"
                            />
                            <q-checkbox
                                v-model="selection"
                                val="teal11"
                                label="T4-A2"
                                color="teal"
                            />
                            <q-checkbox
                                v-model="selection"
                                val="teal12"
                                label="T6-A2"
                                color="teal"
                            />
                            <q-checkbox v-model="selection" val="teal13" label="ECG" color="teal" />
                        </div>
                    </div>
                    <!--menu-->
                    <div class="q-pa-md">
                        <div class="q-gutter-md row items-center">
                            <q-btn color="primary" label="Click me">
                                <q-menu>
                                    <q-separator />
                                    <q-item clickable>
                                        <q-item-section>Description</q-item-section>
                                        <q-item-section side>
                                            <q-icon name="keyboard_arrow_right" />
                                        </q-item-section>
                                        <q-menu anchor="top end" self="top start">
                                            <q-item v-for="n in eeg_data" :key="n" dense clickable>
                                                <q-item-section>{{ n.name }}</q-item-section>
                                                <q-item-section side>
                                                    <q-icon name="keyboard_arrow_right" />
                                                </q-item-section>
                                                <q-menu anchor="top end" self="top start">
                                                    <q-item
                                                        v-for="j in eeg_data[n.id - 1].state"
                                                        :key="j"
                                                        dense
                                                        clickable
                                                    >
                                                        <q-item-section>{{ j.name }}</q-item-section>
                                                        <q-item-section side>
                                                            <q-icon name="keyboard_arrow_right" />
                                                        </q-item-section>
                                                        <q-menu
                                                            auto-close
                                                            anchor="top end"
                                                            self="top start"
                                                        >
                                                            <q-item
                                                                v-for="k in eeg_data[n.id - 1].state[j.id - 1]
                                                                .symptom"
                                                                :key="k"
                                                                dense
                                                                clickable
                                                                @click="send_value(k, n)"
                                                            >
                                                                <q-item-section>{{ k }}</q-item-section>
                                                            </q-item>
                                                        </q-menu>
                                                    </q-item>
                                                </q-menu>
                                            </q-item>
                                        </q-menu>
                                    </q-item>
                                    <q-separator />
                                </q-menu>
                            </q-btn>
                            <div class="q-px-sm q-pt-sm caption">
                                <p style="font-size:17px">
                                    Your selection is:
                                    <q-badge
                                        color="white"
                                        style="font-size: 17px;"
                                        align="middle"
                                        text-color="red"
                                    >{{ select_features }}</q-badge>
                                </p>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="OK" v-close-popup @click="ok_send" />
                </q-card-actions>
                <q-separator />
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { ref, watch } from "vue";
import eeg_data from "../hooks/eeg_data.json";
import useTodo_function from '../hooks/useTodo'
export default {
    setup (context) {
        // button 開啟dialog 
        const button_up = ref("true");
        // save症狀  Normal or Abnormal
        const symptom = ref("");
        // save 病理特徵
        const select_features = ref("");
        //Dialog button按鈕
        const select_button = ref('SELECT')
        const color = ref('primary')
        //vuex 
        const { todos, addTodo, saveid } = useTodo_function()
        // 病理特徵選取後儲存
        function send_value (text, get_id) {
            console.log("所選取的病理特徵: ", text);
            // 儲存feature
            select_features.value = text;
        }
        // 監控症狀的選擇
        watch(symptom, () => {
            console.log("所選取的症狀: ", symptom.value)
        })
        // 設定Dialo OK後傳到TODO那邊
        function ok_send () {
            console.log('Dialog傳送症狀的值出去，值為:', select_features.value)
            context.emit('select_feature', select_features.value)
            select_button.value = symptom.value
            // if (select_button.value != 'Normal') {
            //     color.value = 'negative'
            // }
            select_button.value === 'Normal' ? (color.value = 'primary') : (color.value = 'negative')
            if (symptom.value === '') {
                alert('Please Check your selection  ')
                select_button.value = 'No select option'
                color.value = 'warning'
            } else {
                return
            }
        }
        return {
            send_value,
            symptom,
            button_up,
            eeg_data,
            select_button,
            select_features,
            ok_send,
            color,
            shape: ref('line'),
            selection: ref(['O1-A1', 'F3-A1'])
        };
    },
};
</script>