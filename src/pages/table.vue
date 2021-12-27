<template>
    <div class="q-pa-md">
        <q-table title="Socialhumdim" :rows="rows" :columns="columns" row-key="name" />
    </div>
</template>

<script>
const columns = [
    {
        name: 'PatientNo ',
        required: true,
        label: 'PatientNo',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'RecordDate ', align: 'center', label: 'RecordDate', field: 'RecordDate ', sortable: true },
    { name: 'EduStatus ', label: 'EduStatus ', field: 'EduStatus', sortable: true },
    { name: 'MarryStatus', label: 'MarryStatus', field: 'MarryStatus' },
    { name: 'Job', label: 'Job', field: 'Job' },
    { name: 'SystemUser', label: 'SystemUser', field: 'SystemUser' },
    { name: 'SystemTime', label: 'SystemTime', field: 'SystemTime' },

]

const rows = []
export default {
    setup () {
        return {
            columns,
            rows
        }
    },
}
</script>