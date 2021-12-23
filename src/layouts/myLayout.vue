<template>
    <q-layout view="hHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawer = !drawer" />
                <q-toolbar-title>Quasar App</q-toolbar-title>
                <div>Quasar v{{ $q.version }}</div>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="drawer"
            showif-above
            :mini="miniState"
            @mouseover="miniState = false"
            @mouseout="miniState = true"
            :width="200"
            :breakpoint="500"
            bordered
            class="bg-grey-1"
        >
            <q-scroll-area class="fit">
                <q-list v-model="tab" padding>
                    <q-item to="/CZ" exact>
                        <q-item-section avatar>
                            <q-icon name="home" />
                        </q-item-section>
                        <q-item-section>A1 A2</q-item-section>
                    </q-item>
                    <q-item to="/CZ" exact>
                        <q-item-section avatar>
                            <q-icon name="signal_cellular_alt" />
                        </q-item-section>
                        <q-item-section>CZ</q-item-section>
                    </q-item>
                    <q-item to="/Double_Banana" exact>
                        <q-item-section avatar>
                            <q-icon name="insert_chart_outlined"></q-icon>
                        </q-item-section>
                        <q-item-section>Double Banana</q-item-section>
                    </q-item>
                    <q-item to="/Total" exact>
                        <q-item-section avatar>
                            <q-icon name="poll"></q-icon>
                        </q-item-section>
                        <q-item-section>Charts</q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'MainLayout',
    setup () {
        return {
            tab: ref(''),
            drawer: ref(false),
            miniState: ref(true),
        }
    }
})
</script>
