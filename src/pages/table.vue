<template>
    <div class="q-pa-md" style="max-width: 300px">
        <div class="q-gutter-md">
            <q-select
                filled
                v-model="model"
                use-input
                input-debounce="0"
                label="Simple filter"
                :options="options"
                @filter="filterFn"
                style="width: 250px"
                behavior="menu"
            >
                <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">No results</q-item-section>
                    </q-item>
                </template>
            </q-select>
        </div>
    </div>
    <!-- <div>{{ list_column }}</div> -->
    <div class="q-pa-md">
        <q-table
            :title="model"
            :rows="tabledata"
            :columns="list_column"
            row-key="name"
            :filter="filter"
        >
            <template v-slot:top-right>
                <div class="q-pa-md">
                    <q-btn
                        color="primary"
                        icon-right="archive"
                        label="Export to csv"
                        no-caps
                        @click="exportTable"
                    />
                </div>
                <div class="q-pa-md">
                    <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </div>
            </template>
        </q-table>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import option from "../javascript/Setoption";
import { exportFile, useQuasar } from 'quasar'
const columns = [
    {
        name: 'patientno ',
        label: 'PatientNo',
        align: 'center',
        field: 'patientno',
        sortable: true
    },
    { name: 'recorddate ', align: 'center', label: 'RecordDate', field: 'recorddate' },
    { name: 'edustatus ', align: 'center', label: 'EduStatus ', field: 'edustatus', sortable: true },
    { name: 'marrystatus', align: 'center', label: 'MarryStatus', field: 'marrystatus' },
    { name: 'job', align: 'center', label: 'Job', field: 'job' },
    { name: 'systemuser', align: 'center', label: 'SystemUser', field: 'systemuser' },
    { name: 'systemtime', align: 'center', label: 'SystemTime', field: 'systemtime' },

]

const rows = [
    // {
    //     "patientno": 100000000001,
    //     "recorddate": "2013-03-12 00:00:00",
    //     "edustatus": 50,
    //     "marrystatus": 20,
    //     "job": 10,
    //     "systemuser": 999999,
    //     "systemtime": "2017-05-17 23:59:24"
    // },
    // {
    //     "patientno": 100000000064,
    //     "recorddate": "2014-03-20 00:00:00",
    //     "edustatus": 60,
    //     "marrystatus": 20,
    //     "job": 100,
    //     "systemuser": 999999,
    //     "systemtime": "2017-05-16 19:28:32"
    // },
    // {
    //     "patientno": 100000000068,
    //     "recorddate": "2015-09-07 00:00:00",
    //     "edustatus": 30,
    //     "marrystatus": 20,
    //     "job": 100,
    //     "systemuser": 999999,
    //     "systemtime": "2017-05-18 23:16:48"
    // },
    // {
    //     "patientno": 100000000081,
    //     "recorddate": "2014-11-20 00:00:00",
    //     "edustatus": 40,
    //     "marrystatus": 20,
    //     "job": 10,
    //     "systemuser": 999999,
    //     "systemtime": "2018-07-11 16:13:28"
    // },
    // {
    //     "patientno": 100000000171,
    //     "recorddate": "2010-05-15 00:00:00",
    //     "edustatus": 10,
    //     "marrystatus": 20,
    //     "job": 10,
    //     "systemuser": 999999,
    //     "systemtime": "2017-05-16 22:14:45"
    // },
    // {
    //     "patientno": 100000000255,
    //     "recorddate": "2016-07-03 00:00:00",
    //     "edustatus": 50,
    //     "marrystatus": 20,
    //     "job": 99,
    //     "systemuser": 999999,
    //     "systemtime": "2017-05-19 02:28:42"
    // },
    // {
    //     "patientno": 100000000442,
    //     "recorddate": "2013-06-06 00:00:00",
    //     "edustatus": 40,
    //     "marrystatus": 20,
    //     "job": 80,
    //     "systemuser": 999999,
    //     "systemtime": "2017-05-18 22:52:26"
    // },
    // {
    //     "patientno": 100000000449,
    //     "recorddate": "2014-05-25 00:00:00",
    //     "edustatus": 60,
    //     "marrystatus": 20,
    //     "job": 99,
    //     "systemuser": 999999,
    //     "systemtime": "2017-05-18 20:30:21"
    // },
    // {
    //     "patientno": 100000000453,
    //     "recorddate": "2013-04-28 00:00:00",
    //     "edustatus": 20,
    //     "marrystatus": 20,
    //     "job": 10,
    //     "systemuser": 999999,
    //     "systemtime": "2017-05-16 18:46:34"
    // },
    // {
    //     "patientno": 100000000456,
    //     "recorddate": "2015-10-09 00:00:00",
    //     "edustatus": 30,
    //     "marrystatus": 20,
    //     "job": 99,
    //     "systemuser": 999999,
    //     "systemtime": "2018-07-11 13:06:13"
    // }
]

export default {
    setup () {
        const $q = useQuasar()
        const port = '8000'
        const stringOptions = []
        const options = ref(stringOptions)
        const model = ref('')
        var tablenames
        let tablecolumn = ref([])
        let tabledata = ref([])
        let list_column = ref([
            {
                name: 'Default ',
                label: 'Default',
                align: 'center',
            },
            { name: 'Default 1 ', align: 'center', label: 'Default 1', },
            { name: 'Default 2  ', align: 'center', label: 'Default 2 ' },
        ])

        const tables_url = 'http://127.0.0.1:' + port + '/api/v1/gettablenames'

        const { axioss } = option()
        // 存所有的資料庫
        async function gettables () {
            tablenames = await axioss(tables_url)
        }

        // 每個資料庫他的column
        async function tablecolumn_function (table) {
            let tables_columns = 'http://127.0.0.1:8000/api/v1/gettable_column/' + table
            tablecolumn.value = await axioss(tables_columns)
            list_column.value = []
            tablecolumn.value.forEach(function (parameter, idx) {
                list_column.value.push({
                    name: parameter,
                    required: true,
                    label: parameter,
                    align: 'center',
                    field: parameter,
                    sortable: true
                })
            })
        }

        // 每個資料庫他的rows
        async function table_data_function (table) {
            let tabe_data_url = 'http://127.0.0.1:8000/api/v1/gettable_data/' + table
            tabledata.value = await axioss(tabe_data_url)
            console.log(tabledata.value.length)
        }


        async function filterFn (val, update) {
            let new_stringOptions = await axioss(tables_url)
            if (val === '') {
                update(() => {
                    options.value = new_stringOptions
                })
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                options.value = new_stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
            })
        }

        // 儲存成csv
        function wrapCsvValue (val, formatFn) {
            let formatted = formatFn !== void 0
                ? formatFn(val)
                : val

            formatted = formatted === void 0 || formatted === null
                ? ''
                : String(formatted)

            formatted = formatted.split('"').join('""')
            /**
             * Excel accepts \n and \r in strings, but some other CSV parsers do not
             * Uncomment the next two lines to escape new lines
             */
            // .split('\n').join('\\n')
            // .split('\r').join('\\r')
            return `"${formatted}"`
        }

        function exportTable () {
            const content = [list_column.value.map(col => wrapCsvValue(col.label))].concat(
                tabledata.value.map(row => list_column.value.map(col => wrapCsvValue(
                    typeof col.field === 'function'
                        ? col.field(row)
                        : row[col.field === void 0 ? col.name : col.field],
                    col.format
                )).join(','))
            ).join('\r\n')

            const status = exportFile(
                'table-export.csv',
                content,
                'text/csv'
            )

            if (status !== true) {
                $q.notify({
                    message: 'Browser denied file download...',
                    color: 'negative',
                    icon: 'warning'
                })
            }
        }

        onMounted(() => {
            gettables()
        }),

            watch(model, () => {
                console.log('model換', model.value)
                tablecolumn_function(model.value)
                table_data_function(model.value)
            })

        return {
            filter: ref(''),
            columns,
            rows,

            model,
            stringOptions,
            options,
            filterFn,
            list_column, tabledata,

            exportTable

        }
    }
}
</script>