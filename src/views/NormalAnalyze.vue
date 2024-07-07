<template>
    <a-row :gutter="[0, 16]">
        <a-col :span="24">
            <a-alert banner closable message="注意：本工具无后台服务，不会上传任何信息和文件，请放心使用。最近更新：新增关爱平均分" />
        </a-col>
        <a-col :span="24">
            <a-space wrap>
                <a-button ref="ref1" type="primary" @click="() => upload()">1. 导入</a-button>
                <a-button ref="ref2" type="primary" @click="() => analyse()">2. 分析</a-button>
                <a-button ref="ref3" type="primary" @click="() => download()">3. 下载</a-button>
                <a-button type="link" @click="() => { open = true; current = 0 }">帮助</a-button>
            </a-space>
        </a-col>
        <a-col :span="12">
            <div style="width:600px;">
                <a-tabs>
                    <a-tab-pane v-for="e in tableData" :key="e.name" :tab="e.name">
                        <a-table size="small" :pagination="false" :columns="tableHead" :dataSource="e.data"></a-table>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-col>
        <a-col :span="12">
            <div v-if="done" style="width:600px;">
                <a-tabs>
                    <a-tab-pane v-for="e in resultData" :key="e.key" :tab="e.name">
                        <a-table size="small" :pagination="false" :columns="resultHead" :dataSource="e.data"></a-table>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-col>
    </a-row>

    <a-tour v-model:current="current" v-bind="{ open, steps, onClose: () => open = false }" />
</template>

<script setup>
import { useScoreAnalyze } from '@/components/base/ScoreAnalyze';
import { ref } from 'vue';

const { done, tableHead, tableData, resultHead, resultData, upload, analyse, download } = useScoreAnalyze()

const open = ref(false);
const ref1 = ref(null);
const ref2 = ref(null);
const ref3 = ref(null);
const current = ref(0);
const steps = [
    {
        title: '导入',
        description: '上传年级的成绩Excel文件。',
        target: () => ref1.value && ref1.value.$el,
    },
    {
        title: '分析',
        description: '分析各个班级和全校的成绩指标。',
        target: () => ref2.value && ref2.value.$el,
    },
    {
        title: '下载',
        description: '下载分析结果Excel文件。',
        target: () => ref3.value && ref3.value.$el,
    },
];
</script>