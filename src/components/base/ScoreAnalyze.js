import { message } from "ant-design-vue";
import xlsx from "node-xlsx";
import { ref } from "vue";

const [PASS_SCORE, TOP_SCORE, TWO_TOP_SCORE, CARE_SCORE_PERCENT] = [60, 92.5, 92.5 * 2, 0.2]
const subject = ['chinese', 'math', 'english', 'two', 'three']
const fields = {
    '年级': 'grade', '班级': 'class', '学生姓名': 'name', '语文': 'chinese', '数学': 'math', '英语': 'english', '两科总分': 'two'
}

function round(params) {
    return Math.round(params * 100) / 100;
}

class ClassInfo {

    constructor(name) {
        this.name = name || '' // 班级名称
        this.count = 0 // 班级人数
        this.chinese = new ClassScore() // 语文成绩
        this.math = new ClassScore() // 数学成绩
        this.english = new ClassScore() // 英语成绩
        this.two = new ClassScore() // 语数两科成绩
        this.three = new ClassScore() // 语数外三科成绩
    }

    plusCount() {
        this.count++
    }

    plus(info) {
        subject.forEach(e => {
            this[e].plusScore(info[e].score)
            this[e].plusPassCount(info[e].passCount)
            this[e].plusTopCount(info[e].topCount)
        })
    }

    calc() {
        subject.forEach(e => {
            this[e].calc(this.count)
        })
        this.two.average = round(this.two.average / 2)
        this.three.average = round(this.three.average / 3)
    }
}

class ClassScore {

    constructor() {
        this.score = 0 // 总分数
        this.passCount = 0 // 及格数
        this.topCount = 0 // 特优数
        this.careScore = 0 // 关爱平均分
        this.average = 0 // 平均分
        this.passRate = 0 // 及格率
        this.topRate = 0 // 特优率
        this.careStu = [] // 关爱学生列表
    }

    plusScore(score) {
        this.score += score
    }

    plusPassCount(count) {
        this.passCount += (count === undefined ? 1 : count)
    }

    plusTopCount(count) {
        this.topCount += (count === undefined ? 1 : count)
    }

    pushCareStu(stu) {
        this.careStu.push(stu)
    }

    calc(count) {
        this.calcCareScore()
        this.average = round(this.score / count)
        this.passRate = round(this.passCount / count * 100)
        this.topRate = round(this.topCount / count * 100)
    }

    calcCareScore() {
        if (this.careStu.length === 0) {
            return
        }

        this.careStu = this.careStu
            .sort((a, b) => a[3] - b[3])
            .slice(0, Math.round(this.careStu.length * CARE_SCORE_PERCENT))

        let total = 0
        for (let i = 0; i < this.careStu.length; i++) {
            total += this.careStu[i][3];
        }

        this.careScore = round(total / this.careStu.length)
    }

}

export function useScoreAnalyze() {
    const done = ref(false)
    const excelData = ref([])
    const tableHead = ref([])
    const tableData = ref([])
    const resultHead = ref([
        { title: '班级', dataIndex: 'class', },
        { title: '人数', dataIndex: 'count', },
        { title: '平均分', dataIndex: 'average', },
        { title: '及格人数', dataIndex: 'passCount', },
        { title: '及格率', dataIndex: 'passRate', },
        { title: '关爱平均分', dataIndex: 'careScore', },
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
    const careResult = ref([
        { key: 'chinese', name: '语文关爱生', data: [] },
        { key: 'math', name: '数学关爱生', data: [] },
        { key: 'english', name: '英语关爱生', data: [] },
        { key: 'two', name: '两科关爱生', data: [] },
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
            .then(data => preHandle(data))
    }

    function preHandle(params) {
        // Excel元数据
        excelData.value = params

        // 表头行
        const head_row = params[0].data[0]
        if (head_row.length !== 5 && head_row.length !== 6) {
            console.error(head_row)
            message.error('成绩数据格式错误！')
        }

        // 元数据表格
        tableHead.value = [
            { title: '序号', dataIndex: 'no', customRender: ({ index }) => `${index + 1}`, },
            ...head_row.map(e => { return { title: e, dataIndex: fields[e] } }),
            { title: '两科总分', dataIndex: 'two' },
        ]
        tableData.value = params.map(parseTable)
        done.value = false
    }

    function parseTable(sheet) {
        const _sheet = { ...sheet }

        // 表头行
        const head = sheet.data[0]
        _sheet.data.shift()

        // 数据行：数组转对象
        _sheet.data = _sheet.data.map(r => {
            const _row = {}
            r.forEach((e, i) => _row[fields[head[i]]] = e);

            // 计算两科总分
            if (typeof _row.chinese === 'number' && typeof _row.math === 'number') {
                _row.two = _row.chinese + _row.math
            } else {
                _row.two = _row.chinese
            }
            // 增加两科部分
            r.push(_row.two)

            return _row
        })
        return _sheet
    }

    function analyse() {

        if (done.value) {
            message.warn('已经分析完成，请下载结果！')
            return
        }

        if (excelData.value.length === 0) {
            message.warn('请先上传成绩文件！')
            return
        }

        const sheets = excelData.value
        resultData.value.forEach(e => e.data = [])
        careResult.value.forEach(e => e.data = [])

        const grade = new ClassInfo('校平')

        // 第二次遍历：分析成绩
        for (let i = 0; i < sheets.length; i++) {
            const { data } = sheets[i]

            const clazz = new ClassInfo()

            for (let j = 0; j < data.length; j++) {
                let [gradeName, className, name, chinese, math, ...english_and_two] = data[j]

                // 过滤没有语文、数学分数的学生
                if (typeof chinese !== 'number' || typeof math !== 'number') { continue }

                let english, two
                // 区分低年级没有英语科目
                if (english_and_two.length === 1) {
                    [english, two] = [0, english_and_two[0]]
                } else if (english_and_two.length === 2) {
                    [english, two] = english_and_two
                }

                clazz.name = className
                clazz.plusCount()
                clazz.chinese.plusScore(chinese)
                clazz.math.plusScore(math)
                clazz.english.plusScore(english)
                clazz.two.plusScore(two)

                if (chinese >= PASS_SCORE) {
                    clazz.chinese.plusPassCount()
                    if (chinese >= TOP_SCORE) { clazz.chinese.plusTopCount() }
                    if (math >= PASS_SCORE) {
                        clazz.two.plusPassCount()
                        if (two >= TWO_TOP_SCORE) { clazz.two.plusTopCount() }
                        if (english && english >= PASS_SCORE) { clazz.three.plusPassCount() }
                    }
                }
                if (math >= PASS_SCORE) {
                    clazz.math.plusPassCount()
                    if (math >= TOP_SCORE) { clazz.math.plusTopCount() }
                }

                if (english) {
                    if (english >= PASS_SCORE) {
                        clazz.english.plusPassCount()
                    }
                }

                clazz.chinese.pushCareStu([gradeName, className, name, chinese])
                clazz.math.pushCareStu([gradeName, className, name, math])
                if (english) { clazz.english.pushCareStu([gradeName, className, name, english]) }
                clazz.two.pushCareStu([gradeName, className, name, two])

                grade.plusCount()
            }

            grade.plus(clazz)
            clazz.calc()

            // 导出班级分析结果
            subject.forEach((e, i) => {
                // 导出分析结果
                resultData.value[i].data.push({ class: clazz.name, count: clazz.count, ...clazz[e] })
                // 导出关爱学生列表
                if (i < 4) {
                    careResult.value[i].data.push(...clazz[e].careStu)

                }
            })
        }

        grade.calc()

        // 导出校平分析结果
        subject.forEach((e, i) => { resultData.value[i].data.unshift({ class: grade.name, count: grade.count, ...grade[e] }) })

        done.value = true
    }

    function download() {
        const sheets = []

        resultData.value.forEach(sheet => {
            const data = [resultHead.value.map(e => e.title)]
            sheet.data.forEach(e =>
                data.push([e.class, e.count, e.average, e.passCount, e.passRate, e.careScore, e.topCount, e.topRate]))
            sheets.push({ name: sheet.name, data })
        })

        const careHead = ['语文', '数学', '英语', '两科']
        careResult.value.forEach((sheet, i) => {
            const data = ['年级', '班级', '姓名', careHead[i]]
            sheets.push({ name: careHead[i] + '关爱生', data: [data, ...sheet.data] })
        })

        const buffer = xlsx.build(sheets)

        downloadFile(new File([buffer], 'result.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
    }

    function downloadFile(file) {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(file);
        elem.download = file.name;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }

    return { done, tableHead, tableData, resultHead, resultData, upload, analyse, download }
}