import { message } from "ant-design-vue";
import { ref } from "vue";
import { read, utils, writeFileXLSX } from "xlsx";

const [PASS_SCORE, TOP_SCORE, TWO_TOP_SCORE, CARE_SCORE_PERCENT] = [60, 92.5, 92.5 * 2, 0.2]
const subject = ['chinese', 'math', 'english', 'two', 'three']

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
    const tableHead = ref([
        { title: '序号', dataIndex: 'no', customRender: ({ index }) => `${index + 1}`, },
        { title: '年级', dataIndex: 'grade' },
        { title: '班级', dataIndex: 'class' },
        { title: '学生姓名', dataIndex: 'name' },
        { title: '语文', dataIndex: 'chinese', sorter: (a, b) => a.chinese - b.chinese },
        { title: '数学', dataIndex: 'math', sorter: (a, b) => a.math - b.math },
        { title: '英语', dataIndex: 'english', sorter: (a, b) => a.english - b.english },
        { title: '两科总分', dataIndex: 'two', sorter: (a, b) => a.two - b.two },
    ])
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
            .then(buffer => read(buffer))
            .then(wb => preHandle(wb))
    }

    function preHandle(wb) {

        excelData.value = wb.SheetNames.map(sheet => {
            const json = utils.sheet_to_json(wb.Sheets[sheet])
            const data = json.map(({ 年级: grade, 班级: clazz, 学生姓名: name, 语文: chinese, 数学: math, 英语: english }) => {

                const two = (typeof chinese === 'number' && typeof math === 'number') ? (chinese + math) : chinese

                return { grade, class: clazz, name, chinese, math, english, two }
            })
            return { sheet, data }
        })

        done.value = false
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

        resultData.value.forEach(e => e.data = [])
        careResult.value.forEach(e => e.data = [])

        const gradeInfo = new ClassInfo('校平')

        // 第二次遍历：分析成绩
        const sheets = excelData.value
        for (let i = 0; i < sheets.length; i++) {
            const { data } = sheets[i]

            const classInfo = new ClassInfo()

            for (let j = 0; j < data.length; j++) {
                let { grade, class: className, name, chinese, math, english, two } = data[j]
                english = english || 0

                // 过滤没有语文、数学分数的学生
                if (typeof chinese !== 'number' || typeof math !== 'number') { continue }

                classInfo.name = className
                classInfo.plusCount()
                classInfo.chinese.plusScore(chinese)
                classInfo.math.plusScore(math)
                classInfo.english.plusScore(english)
                classInfo.two.plusScore(two)

                if (chinese >= PASS_SCORE) {
                    classInfo.chinese.plusPassCount()
                    if (chinese >= TOP_SCORE) { classInfo.chinese.plusTopCount() }
                    if (math >= PASS_SCORE) {
                        classInfo.two.plusPassCount()
                        if (two >= TWO_TOP_SCORE) { classInfo.two.plusTopCount() }
                        if (english && english >= PASS_SCORE) { classInfo.three.plusPassCount() }
                    }
                }
                if (math >= PASS_SCORE) {
                    classInfo.math.plusPassCount()
                    if (math >= TOP_SCORE) { classInfo.math.plusTopCount() }
                }

                if (english) {
                    if (english >= PASS_SCORE) {
                        classInfo.english.plusPassCount()
                    }
                }

                classInfo.chinese.pushCareStu([grade, className, name, chinese])
                classInfo.math.pushCareStu([grade, className, name, math])
                if (english) { classInfo.english.pushCareStu([grade, className, name, english]) }
                classInfo.two.pushCareStu([grade, className, name, two])

                gradeInfo.plusCount()
            }

            gradeInfo.plus(classInfo)
            classInfo.calc()

            // 导出班级分析结果
            subject.forEach((e, i) => {
                // 导出分析结果
                resultData.value[i].data.push({ class: classInfo.name, count: classInfo.count, ...classInfo[e] })
                // 导出关爱学生列表
                if (i < 4) {
                    careResult.value[i].data.push(...classInfo[e].careStu)

                }
            })
        }

        gradeInfo.calc()

        // 导出校平分析结果
        subject.forEach((e, i) => { resultData.value[i].data.unshift({ class: gradeInfo.name, count: gradeInfo.count, ...gradeInfo[e] }) })

        done.value = true
    }

    function download() {
        if (!done.value) {
            message.warning('请先分析成绩！')
            return
        }

        const wb = utils.book_new()

        resultData.value.forEach(sheet => {
            const data = [resultHead.value.map(e => e.title)]
            sheet.data.forEach(e =>
                data.push([e.class, e.count, e.average, e.passCount, e.passRate, e.careScore, e.topCount, e.topRate]))
            utils.book_append_sheet(wb, utils.aoa_to_sheet(data), sheet.name)
        })

        const careHead = ['语文', '数学', '英语', '两科']
        careResult.value.forEach((sheet, i) => {
            const data = [['年级', '班级', '姓名', careHead[i]], ...sheet.data]
            utils.book_append_sheet(wb, utils.aoa_to_sheet(data), `${careHead[i]}关爱生`)
        })

        writeFileXLSX(wb, 'result.xlsx')
    }

    return { done, tableHead, excelData, resultHead, resultData, upload, analyse, download }
}