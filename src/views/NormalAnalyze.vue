<template>
    <a-row>
        <a-col :span="24">
            <a-space wrap>
                <a-button type="primary" @click="() => upload()">导入</a-button>
                <a-button type="primary" @click="() => analyse()">分析</a-button>
                <a-button type="primary" @click="() => download()">下载</a-button>
            </a-space>
        </a-col>
    </a-row>
    <a-row>
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
            <div style="width:600px;">
                <div>关爱分数：语文：{{ careScore.chinese }} 数学：{{ careScore.math }} 两科：{{ careScore.total }}</div>
                <a-tabs>
                    <a-tab-pane v-for="e in resultData" :key="e.key" :tab="e.name">
                        <a-table size="small" :pagination="false" :columns="resultHead" :dataSource="e.data"></a-table>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-col>
    </a-row>
</template>

<script setup>
import { message } from "ant-design-vue";
import xlsx from "node-xlsx";
import { reactive, ref } from "vue";

const PASS_SCORE = 60
const TOP_SCORE = 92.5
const TWO_TOP_SCORE = TOP_SCORE * 2
const CARE_SCORE_PERCENT = 0.8

const fields = {
    '年级': 'grade', '班级': 'class', '学生姓名': 'name', '语文': 'chinese', '数学': 'math', '英语': 'english', '两科总分': 'total'
}
const excelData = ref([])
const tableHead = ref([])
const tableData = ref([])
const careScore = ref({ chinese: 0, math: 0, total: 0 })
const resultHead = ref([
    { title: '班级', dataIndex: 'class', },
    { title: '人数', dataIndex: 'count', },
    { title: '平均分', dataIndex: 'average', },
    { title: '及格人数', dataIndex: 'passCount', },
    { title: '及格率', dataIndex: 'passRate', },
    { title: '关爱人数', dataIndex: 'careCount', },
    { title: '关爱率', dataIndex: 'careRate', },
    { title: '特优人数', dataIndex: 'topCount', },
    { title: '特优率', dataIndex: 'topRate', },
])
const resultData = ref([
    { key: 'chinese', name: '语文', data: [] },
    { key: 'math', name: '数学', data: [] },
    { key: 'english', name: '英语', data: [] },
    { key: 'two', name: '两科', data: [] },
    { key: 'three', name: '三科', data: [] },
])

const pickerOpts = {
    types: [{ description: "Excel", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] } }],
    excludeAcceptAllOption: true,
    multiple: false,
};

function upload() {
    return window.showOpenFilePicker(pickerOpts)
        .then(([fileHandle]) => fileHandle.getFile())
        .then(file => file.arrayBuffer())
        .then(buffer => xlsx.parse(buffer))
        .then(data => {
            excelData.value = data

            const head_row = data[0].data[0]

            tableHead.value = [
                { title: '序号', dataIndex: 'no', customRender: ({ index }) => `${index + 1}`, },
                ...head_row.map(e => { return { title: e, dataIndex: fields[e] } }),
                { title: '两科总分', dataIndex: 'total' },
            ]
            tableData.value = data.map(parseTable)
        })
}

function parseTable(sheet) {
    const _sheet = { ...sheet }
    const head = sheet.data[0]

    _sheet.data.shift()
    _sheet.data = _sheet.data.map(r => {
        const _row = {}
        r.forEach((e, i) => _row[fields[head[i]]] = e);

        // 计算两科总分
        if (typeof _row.chinese === 'number' && typeof _row.math === 'number') {
            _row.total = _row.chinese + _row.math
        } else {
            _row.total = _row.chinese
        }
        r.push(_row.total)

        return _row
    })
    return _sheet
}

function analyse() {
    const sheets = excelData.value
    resultData.value.forEach(e => e.data = [])

    let [grade_chinese_score, grade_math_score, grade_total_score] = [[], [], []]

    let grade = {
        name: '校平',
        // 年级总人数
        count: 0,
        // 年级关爱线
        care: { chinese: 0, math: 0, total: 0 },
        // 年级语文、数学、两科成绩数据
        score: { chinese: [], math: [], total: [] },
        // 年级语文统计：总分数、及格数、特优数、关爱数
        chinese: {
            score: 0, passCount: 0, topCount: 0, careCount: 0,
            average: 0, passRate: 0, topRate: 0, careRate: 0,
        },
        // 年级数学统计：总分数、及格数、特优数、关爱数
        math: {
            score: 0, passCount: 0, topCount: 0, careCount: 0,
            average: 0, passRate: 0, topRate: 0, careRate: 0,
        },
        // 年级英语统计：总分数、及格数
        english: {
            score: 0, passCount: 0,
            average: 0, passRate: 0,
        },
        // 年级两科统计：总分数、及格数、特优数、关爱数
        two: {
            score: 0, passCount: 0, topCount: 0, careCount: 0,
            average: 0, passRate: 0, topRate: 0, careRate: 0,
        },
        // 年级三科统计：及格数
        three: { passCount: 0, passRate: 0, },
    }

    // 计算关爱线
    for (let i = 0; i < sheets.length; i++) {
        const { data } = sheets[i]
        for (let j = 0; j < data.length; j++) {
            let [_grade, _className, _name, chinese, math, english, total] = data[j]
            if (!total) { total = english }
            if (typeof chinese !== 'number' || typeof math !== 'number') { continue }
            grade_chinese_score.push(chinese)
            grade_math_score.push(math)
            grade_total_score.push(total)
        }
    }

    const sortFunc = (a, b) => b - a
    const care_score_index = parseInt(CARE_SCORE_PERCENT * grade_chinese_score.length)
    grade.care.chinese = grade_chinese_score.sort(sortFunc)[care_score_index]
    grade.care.math = grade_math_score.sort(sortFunc)[care_score_index]
    grade.care.total = grade_total_score.sort(sortFunc)[care_score_index]
    careScore.value = grade.care

    for (let i = 0; i < sheets.length; i++) {
        const { name, data } = sheets[i]

        let clazz = {
            // 班级名称
            name: '',
            // 班级总人数
            count: 0,
            // 班级语文统计：总分数、及格数、特优数、关爱数
            chinese: {
                score: 0, passCount: 0, topCount: 0, careCount: 0,
                average: 0, passRate: 0, topRate: 0, careRate: 0,
            },
            // 班级数学统计：总分数、及格数、特优数、关爱数
            math: {
                score: 0, passCount: 0, topCount: 0, careCount: 0,
                average: 0, passRate: 0, topRate: 0, careRate: 0,
            },
            // 班级英语统计：总分数、及格数
            english: {
                score: 0, passCount: 0,
                average: 0, passRate: 0,
            },
            // 班级两科统计：总分数、及格数、特优数、关爱数
            two: {
                score: 0, passCount: 0, topCount: 0, careCount: 0,
                average: 0, passRate: 0, topRate: 0, careRate: 0,
            },
            // 班级三科统计：及格数
            three: { passCount: 0, passRate: 0, },
        }

        for (let j = 0; j < data.length; j++) {
            let [gradeName, className, name, chinese, math, english, total] = data[j]

            if (!total) { total = english, english = 0 }

            if (typeof chinese !== 'number' || typeof math !== 'number') { continue }

            clazz.name = className
            clazz.count++
            clazz.two.score += total
            clazz.chinese.score += chinese
            clazz.math.score += math
            clazz.english.score += english

            if (chinese >= PASS_SCORE) {
                clazz.chinese.passCount++
                if (chinese >= TOP_SCORE) { clazz.chinese.topCount++ }
                if (math >= PASS_SCORE) {
                    clazz.two.passCount++
                    if (total >= TWO_TOP_SCORE) { clazz.two.topCount++ }
                    if (english && english >= PASS_SCORE) { clazz.three.passCount++ }
                }
            }
            if (math >= PASS_SCORE) { clazz.math.passCount++; if (math >= TOP_SCORE) { clazz.math.topCount++ } }
            if (english && english >= PASS_SCORE) { clazz.english.passCount++ }

            if (chinese <= grade.care.chinese) { clazz.chinese.careCount++ }
            if (math <= grade.care.math) { clazz.math.careCount++ }
            if (total <= grade.care.total) { clazz.two.careCount++ }
        }

        grade.count += clazz.count
        grade.two.score += clazz.two.score
        grade.two.passCount += clazz.two.passCount
        grade.two.topCount += clazz.two.topCount
        grade.two.careCount += clazz.two.careCount
        grade.three.passCount += clazz.three.passCount

        grade.chinese.score += clazz.chinese.score
        grade.chinese.passCount += clazz.chinese.passCount
        grade.chinese.topCount += clazz.chinese.topCount
        grade.chinese.careCount += clazz.chinese.careCount

        grade.math.score += clazz.math.score
        grade.math.passCount += clazz.math.passCount
        grade.math.topCount += clazz.math.topCount
        grade.math.careCount += clazz.math.careCount

        grade.english.score += clazz.english.score
        grade.english.passCount += clazz.english.passCount

        clazz.two.average = round(clazz.two.score / clazz.count / 2)
        clazz.two.passRate = round(clazz.two.passCount / clazz.count * 100)
        clazz.two.careRate = round((1 - clazz.two.careCount / clazz.count) * 100)
        clazz.two.topRate = round(clazz.two.topCount / clazz.count * 100)
        clazz.three.passRate = round(clazz.three.passCount / clazz.count * 100)

        clazz.chinese.average = round(clazz.chinese.score / clazz.count)
        clazz.chinese.passRate = round(clazz.chinese.passCount / clazz.count * 100)
        clazz.chinese.careRate = round((1 - clazz.chinese.careCount / clazz.count) * 100)
        clazz.chinese.topRate = round(clazz.chinese.topCount / clazz.count * 100)

        clazz.math.average = round(clazz.math.score / clazz.count)
        clazz.math.passRate = round(clazz.math.passCount / clazz.count * 100)
        clazz.math.careRate = round((1 - clazz.math.careCount / clazz.count) * 100)
        clazz.math.topRate = round(clazz.math.topCount / clazz.count * 100)

        clazz.english.average = round(clazz.english.score / clazz.count)
        clazz.english.passRate = round(clazz.english.passCount / clazz.count * 100)

        resultData.value[0].data.push({ class: clazz.name, count: clazz.count, ...clazz.chinese })
        resultData.value[1].data.push({ class: clazz.name, count: clazz.count, ...clazz.math })
        resultData.value[2].data.push({ class: clazz.name, count: clazz.count, ...clazz.english })
        resultData.value[3].data.push({ class: clazz.name, count: clazz.count, ...clazz.two })
        resultData.value[4].data.push({ class: clazz.name, count: clazz.count, ...clazz.three })
    }

    grade.two.average = round(grade.two.score / grade.count / 2)
    grade.two.passRate = round(grade.two.passCount / grade.count * 100)
    grade.two.careRate = round((1 - grade.two.careCount / grade.count) * 100)
    grade.two.topRate = round(grade.two.topCount / grade.count * 100)
    grade.three.passRate = round(grade.three.passCount / grade.count * 100)

    grade.chinese.average = round(grade.chinese.score / grade.count)
    grade.chinese.passRate = round(grade.chinese.passCount / grade.count * 100)
    grade.chinese.careRate = round((1 - grade.chinese.careCount / grade.count) * 100)
    grade.chinese.topRate = round(grade.chinese.topCount / grade.count * 100)

    grade.math.average = round(grade.math.score / grade.count)
    grade.math.passRate = round(grade.math.passCount / grade.count * 100)
    grade.math.careRate = round((1 - grade.math.careCount / grade.count) * 100)
    grade.math.topRate = round(grade.math.topCount / grade.count * 100)

    grade.english.average = round(grade.english.score / grade.count)
    grade.english.passRate = round(grade.english.passCount / grade.count * 100)

    resultData.value[0].data.push({ class: grade.name, count: grade.count, ...grade.chinese })
    resultData.value[1].data.push({ class: grade.name, count: grade.count, ...grade.math })
    resultData.value[2].data.push({ class: grade.name, count: grade.count, ...grade.english })
    resultData.value[3].data.push({ class: grade.name, count: grade.count, ...grade.two })
    resultData.value[4].data.push({ class: grade.name, count: grade.count, ...grade.three })
}

function download() {
    const sheets = []
    resultData.value.forEach(sheet => {
        const data = [['班级', '人数', '平均分', '及格人数', '及格率', '关爱人数', '关爱率', '特优人数', '特优率']]
        sheet.data.forEach(e =>
            data.push([e.class, e.count, e.average, e.passCount, e.passRate, e.careCount, e.careRate, e.topCount, e.topRate]))
        sheets.push({ name: sheet.name, data })
    })

    const buffer = xlsx.build(sheets)
    window.showOpenFilePicker(pickerOpts)
        .then(([fileHandle]) => fileHandle.createWritable())
        .then(w => { w.write(buffer); w.close(); message.success('下载成功！') })
}

function round(num) {
    return Math.round(num * 100) / 100;
}
</script>