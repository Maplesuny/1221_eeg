<template>
    <div class="q-pa-md full-height">
        <div class="full-height" style="max-width:3000px">
            <!--如果不+fit  dialog出不來 -->
            <q-card class="flex fit">
                <q-tabs
                    v-model="tab"
                    dense
                    class="text-grey-8"
                    active-color="primary"
                    indicator-color="primary"
                    align="justify"
                    narrow-indicator
                >
                    <q-tab name="A1_A2" label="A1 A2 montage" />
                    <q-tab name="CZ" label="CZ" />
                    <q-tab name="Double_banana" label="Double Banana" />
                </q-tabs>
                <q-separator />
                <q-tab-panels v-model="tab" animated keep-alive style="height:96%;width:100%">
                    <q-tab-panel name="A1_A2">
                        <CZ></CZ>
                    </q-tab-panel>

                    <q-tab-panel name="CZ">
                        <div class="text-h6">Alarms</div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </q-tab-panel>

                    <q-tab-panel name="Double_banana">
                        <div class="text-h6">Movies</div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </q-tab-panel>
                </q-tab-panels>
            </q-card>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import news from '../pages/CZ.vue'

export default {
    components: {
        CZ: news
    },
    setup () {
        return {
            tab: ref('A1_A2')
        }
    }
}
</script>