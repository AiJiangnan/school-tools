<template>
    <a-form :model="formState">
        <a-row align="middle">
            <a-col :span="10">
                <a-divider orientation="left">汉语</a-divider>
                <a-form-item>
                    <a-textarea v-model:value="formState.from" placeholder="请输入汉语字、词、句" :rows="10" allow-clear
                        @change="() => convert()" />
                </a-form-item>
            </a-col>
            <a-col :span="2">
                <a-row justify="center">
                    <a-space direction="vertical">
                        <a-button type="primary" @click="() => copy(formState.to)">复制</a-button>
                        <a-button type="primary" @click="() => reset()">清空</a-button>
                    </a-space>
                </a-row>
            </a-col>
            <a-col :span="10">
                <a-divider orientation="left">拼音</a-divider>
                <a-form-item>
                    <a-textarea v-model:value="formState.to" :rows="10" />
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>

<script setup>
import copy from 'copy-to-clipboard';
import { pinyin } from 'pinyin-pro';
import { reactive } from 'vue';

const formState = reactive({ from: '', to: '' })

function convert() {
    formState.to = pinyin(formState.from)
}

function reset() {
    formState.from = ''
    formState.to = ''
}
</script>