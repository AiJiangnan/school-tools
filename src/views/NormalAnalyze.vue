<template>
    <a-button @click="() => open()">打开</a-button>
</template>

<script setup lang="js">
import xlsx from "node-xlsx"

const pickerOpts = {
    types: [{ description: "Excel", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] } }],
    excludeAcceptAllOption: true,
    multiple: false,
};

function open() {
    window.showOpenFilePicker()
        .then(([fileHandle]) => fileHandle.getFile())
        .then(file => file.arrayBuffer())
        .then(buffer => console.info(xlsx.parse(buffer)))
}
</script>