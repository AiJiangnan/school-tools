<template>
    <a-row :gutter="[0, 16]">
        <a-col :span="24">
            <a-alert banner closable message="注意：本工具无后台服务，不会上传任何信息和文件，请放心使用。最近更新：新增关爱平均分" />
        </a-col>
        <a-col :span="24">
            <a-space wrap>
                <a-button ref="ref1" type="primary" @click="() => upload()">1. 导入</a-button>
                <a-button ref="ref2" type="primary" @click="() => analyse()">2. 分析</a-button>
                <a-button type="link" @click="() => { open = true }">帮助</a-button>
            </a-space>
        </a-col>
        <a-col :span="24">
            <div style="width:800px;">
                <a-tabs>
                    <a-tab-pane v-for="e in excelData" :key="e.sheet" :tab="e.sheet">
                        <a-table size="small" :pagination="false" :columns="tableHead" :dataSource="e.data"></a-table>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-col>
    </a-row>
    <a-drawer :open="done" size="large" title="成绩分析结果" @close="() => done = false">
        <template #extra>
            <a-button ref="ref3" type="primary" @click="() => download()">3. 下载</a-button>
        </template>
        <a-alert banner closable type="success" message="注意：更多详细分析结果点击下载。" />
        <a-tabs>
            <a-tab-pane v-for="e in resultData" :key="e.key" :tab="e.name">
                <a-table size="small" :pagination="false" :columns="resultHead" :dataSource="e.data"></a-table>
            </a-tab-pane>
        </a-tabs>
    </a-drawer>
    <a-modal :open="open" width="800px" :footer="null" @cancel="() => open = false">
        <a-typography>
            <a-typography-title :level="2">帮助文档</a-typography-title>
            <a-typography-title :level="3">1. 导入</a-typography-title>
            <a-typography-paragraph>
                第一步：点击导入按钮，导入各班级成绩的Excel文档，文件格式必须为<a-typography-text strong type="danger"> .xlsx
                </a-typography-text>，数据表格必须包含列：
            </a-typography-paragraph>
            <a-typography-paragraph>
                <a-typography-text strong type="danger">年级、班级、学生姓名、语文、数学、英语（可选）</a-typography-text>
            </a-typography-paragraph>
            <a-typography-paragraph>
                不计排名规则：只有当语文、数学其中一个成绩不为数字时，不会计入统计中；如果语文、数学都有成绩，英语没有成绩时，会计算错误，当存在这种情况时，需要确定成绩是否计入排名。
            </a-typography-paragraph>
            <a-typography-paragraph>
                导入成绩后，可以通过切换标签页，查看各个班级的各科成绩情况，并且支持对各科进行排序。
            </a-typography-paragraph>
            <a-image src="/1.png" />
            <a-typography-title :level="3">2. 分析</a-typography-title>
            <a-typography-paragraph>
                第二步：点击分析按钮，分析班级各个指标，结果弹窗展示，切换标签页面查看每个班级的情况。
            </a-typography-paragraph>
            <a-image src="/2.png" />
            <a-typography-title :level="3">3. 下载</a-typography-title>
            <a-typography-paragraph>
                第三步：点击下载按钮，下载各个班级详情的分析结果，包含各个班级的各个指标，以及关爱学生名单。
            </a-typography-paragraph>
            <a-image src="/3.png" />
        </a-typography>
    </a-modal>
</template>

<script setup>
import { useScoreAnalyze } from '@/components/base/ScoreAnalyze';
import { ref } from 'vue';

const { done, tableHead, excelData, resultHead, resultData, upload, analyse, download } = useScoreAnalyze()

const open = ref(false);
</script>