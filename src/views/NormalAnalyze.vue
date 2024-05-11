<template>
    <a-button @click="() => openFile()">打开</a-button>
    <a-modal width="600px" :closable="false" :open="open" @cancel="() => open = false" @ok="() => analyse()">
        <a-tabs>
            <a-tab-pane v-for="e in tableData" :key="e.name" :tab="e.name">
                <a-table size="small" :pagination="false" :columns="tableHead" :dataSource="e.data"></a-table>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>

<script setup lang="js">
import xlsx from "node-xlsx";
import { ref } from "vue";

const PASS_SCORE = 60
const TOP_SCORE = 92.5
const TWO_TOP_SCORE = TOP_SCORE * 2
const CARE_SCORE_PERCENT = 0.8

const fields = {
    '年级': 'grade', '班级': 'class', '学生姓名': 'name', '语文': 'chinese', '数学': 'math', '英语': 'english', '两科总分': 'total'
}
const open = ref(false)
const excelData = ref([])
const tableHead = ref([])
const tableData = ref([])

const pickerOpts = {
    types: [{ description: "Excel", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] } }],
    excludeAcceptAllOption: true,
    multiple: false,
};

function openFile() {
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
        .then(() => open.value = true)
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

    let [grade_chinese_score, grade_math_score, grade_total_score] = [[], [], []]
    let [grade_total_count, grade_two_total_score, grade_two_pass_count, grade_two_top_count, grade_two_care_count,
        grade_three_pass_count] = [0, 0, 0, 0, 0, 0]
    let [grade_chinese_total_score, grade_chinese_pass_count, grade_chinese_top_count, grade_chinese_care_count] = [0, 0, 0, 0]
    let [grade_math_total_score, grade_math_pass_count, grade_math_top_count, grade_math_care_count] = [0, 0, 0, 0]
    let [grade_english_total_score, grade_english_pass_count] = [0, 0]

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
    const chinese_care_score = grade_chinese_score.sort(sortFunc)[care_score_index]
    const math_care_score = grade_math_score.sort(sortFunc)[care_score_index]
    const two_care_score = grade_total_score.sort(sortFunc)[care_score_index]

    console.log('care_score:', chinese_care_score, math_care_score, two_care_score)

    for (let i = 0; i < sheets.length; i++) {
        const { name, data } = sheets[i]

        let class_total_count = 0
        let [two_total_score, two_pass_count, two_top_count, two_care_count, three_pass_count] = [0, 0, 0, 0, 0]
        let [chinese_total_score, chinese_pass_count, chinese_top_count, chinese_care_count] = [0, 0, 0, 0]
        let [math_total_score, math_pass_count, math_top_count, math_care_count] = [0, 0, 0, 0]
        let [english_total_score, english_pass_count] = [0, 0]

        for (let j = 0; j < data.length; j++) {
            let [grade, className, name, chinese, math, english, total] = data[j]

            if (!total) { total = english }

            if (typeof chinese !== 'number' || typeof math !== 'number') { continue }

            class_total_count++
            two_total_score += total
            chinese_total_score += chinese
            math_total_score += math
            english_total_score += english

            if (chinese >= PASS_SCORE) {
                chinese_pass_count++;
                if (chinese >= TOP_SCORE) { chinese_top_count++ }
                if (math >= PASS_SCORE) {
                    two_pass_count++
                    if (total >= TWO_TOP_SCORE) { two_top_count++ }
                    if (english && english >= PASS_SCORE) { three_pass_count++ }
                }
            }
            if (math >= PASS_SCORE) { math_pass_count++; if (math >= TOP_SCORE) { math_top_count++ } }
            if (english && english >= PASS_SCORE) { english_pass_count++ }

            if (chinese <= chinese_care_score) { chinese_care_count++ }
            if (math <= math_care_score) { math_care_count++ }
            if (total <= two_care_score) { two_care_count++ }
        }

        // 全校统计
        grade_total_count += class_total_count
        grade_two_total_score += two_total_score
        grade_two_pass_count += two_pass_count
        grade_two_top_count += two_top_count
        grade_two_care_count += two_care_count
        grade_three_pass_count += three_pass_count

        grade_chinese_total_score += chinese_total_score
        grade_chinese_pass_count += chinese_pass_count
        grade_chinese_top_count += chinese_top_count
        grade_chinese_care_count += chinese_care_count

        grade_math_total_score += math_total_score
        grade_math_pass_count += math_pass_count
        grade_math_top_count += math_top_count
        grade_math_care_count += math_care_count

        grade_english_total_score += english_total_score
        grade_english_pass_count += english_pass_count

        // 两科及格人数,两科及格率,两科平均分,两科关爱率162,特优率
        const two_total_avg = round(two_total_score / class_total_count / 2)
        const two_pass_rate = round(two_pass_count / class_total_count * 100)
        const two_care_rate = round((1 - two_care_count / class_total_count) * 100)
        const two_top_rate = round(two_top_count / class_total_count * 100)

        const chinese_total_avg = round(chinese_total_score / class_total_count)
        const chinese_pass_rate = round(chinese_pass_count / class_total_count * 100)
        const chinese_care_rate = round((1 - chinese_care_count / class_total_count) * 100)
        const chinese_top_rate = round(chinese_top_count / class_total_count * 100)

        const math_total_avg = round(math_total_score / class_total_count)
        const math_pass_rate = round(math_pass_count / class_total_count * 100)
        const math_care_rate = round((1 - math_care_count / class_total_count) * 100)
        const math_top_rate = round(math_top_count / class_total_count * 100)

        // console.table(name, class_total_count,
        //     two_pass_count,
        //     two_pass_rate,
        //     two_total_avg,
        //     two_care_rate,
        //     two_top_rate)

        // console.table(name, class_total_count,
        //     chinese_pass_count,
        //     chinese_pass_rate,
        //     chinese_total_avg,
        //     chinese_care_rate,
        //     chinese_top_rate)

        console.table(name, class_total_count,
            math_pass_count,
            math_pass_rate,
            math_total_avg,
            math_care_rate,
            math_top_rate)

        // console.table(name, class_total_count, english_pass_count)
    }

    const grade_two_total_avg = round(grade_two_total_score / grade_total_count / 2)
    const grade_two_pass_rate = round(grade_two_pass_count / grade_total_count * 100)
    const grade_two_top_rate = round(grade_two_top_count / grade_total_count * 100)
    const grade_two_care_rate = round((1 - grade_two_care_count / grade_total_count) * 100)

    const grade_chinese_total_avg = round(grade_chinese_total_score / grade_total_count)
    const grade_chinese_pass_rate = round(grade_chinese_pass_count / grade_total_count * 100)
    const grade_chinese_top_rate = round(grade_chinese_top_count / grade_total_count * 100)
    const grade_chinese_care_rate = round((1 - grade_chinese_care_count / grade_total_count) * 100)

    const grade_math_total_avg = round(grade_math_total_score / grade_total_count)
    const grade_math_pass_rate = round(grade_math_pass_count / grade_total_count * 100)
    const grade_math_top_rate = round(grade_math_top_count / grade_total_count * 100)
    const grade_math_care_rate = round((1 - grade_math_care_count / grade_total_count) * 100)

    // console.table('校平', grade_total_count,
    //     grade_two_pass_count,
    //     grade_two_pass_rate,
    //     grade_two_total_avg,
    //     grade_two_care_rate,
    //     grade_two_top_rate)

    // console.table('校平', grade_total_count,
    //     grade_chinese_pass_count,
    //     grade_chinese_pass_rate,
    //     grade_chinese_total_avg,
    //     grade_chinese_care_rate,
    //     grade_chinese_top_rate)

    console.table('校平', grade_total_count,
        grade_math_pass_count,
        grade_math_pass_rate,
        grade_math_total_avg,
        grade_math_care_rate,
        grade_math_top_rate)

    open.value = false
}

function round(num) {
    return Math.round(num * 100) / 100;
}
</script>