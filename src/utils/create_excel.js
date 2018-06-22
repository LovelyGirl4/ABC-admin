import XLSX from 'xlsx';
var FileSaver = require('file-saver');

// Sheetjs create excel file
const customerHeader = {
    header: ['用户昵称', '性别', '手机号', '银行日均存款（万元）（30万）', '已有贷款银行家数（家）（30万）',
        '已有银行贷款金额（万元）（30万）', '您的可贷测算额度（万元）（30万）', '您的姓名（30万）', '您的联系方式（30万）', '您所处乡镇（30万）',
        '您的推荐人（如无可不填写）（30万）', '所有银行日均（日常）存款（万元）（50万）', '已有保证（信用）贷款（万元）（50万）',
        '家庭对外担保余额（万元）（50万）', '在几家银行贷款（家）（50万）', '您的可贷测算额度（万元）（50万）', '您的姓名（50万）', '您的联系方式（50万）',
        '您所处乡镇（50万）', '您的推荐人（如无可不填写）（50万）'
    ]
};

const newBook = () => XLSX.utils.book_new();
const generateCustomersWorkSheet = (data) => {
    /* make worksheet */
    let ws = XLSX.utils.json_to_sheet(data, customerHeader);
    return ws;
};

const bookOptions = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
};
const s2ab = (s) => {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
};
const writeWorkBook = (data, types) => {
    let wb = newBook();
    const keys = Object.keys(data);
    keys.forEach(k => {
        /* Add the sheet name to the list */
        wb.SheetNames.push(k);
        /* Load the worksheet object */
        if (types === 'customer') {
            wb.Sheets[k] = generateCustomersWorkSheet(data[k]);
        }
    });
    // workbook info
    // const {FirstName, MiddleName, Surname} = originData.customers[0];
    // wb.Author = MiddleName ? `${FirstName} ${MiddleName} ${Surname}` : `${FirstName} ${Surname}`;
    wb.CreatedDate = new Date();
    return wb;
};
const generateExcel = (data, filename, types) => {
    let wb = writeWorkBook(data, types);
    let wopts = bookOptions;
    let wbout = XLSX.write(wb, wopts);
    FileSaver.saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), filename);
};

const jsonCustomersData = (data) => {
    const {users, wx_profiles, ExamsProfile} = data;
    const {answers, questions} = ExamsProfile;
    let obj = {};
    const customers = users.map(u => {
        const wx_profile = wx_profiles.filter(wx => u.unionid === wx.unionid)[0];
        const questionsArr = questions.map(q => {
            const answer = answers.filter(a => a.question_id === q.id && a.answered_by_id === u.id)[0];
            obj[q.content + `${q.exam_id === 1 ? '（30万）' : '（50万）' }`] = answer && answer.content;
            return {
                ...q,
                content: q.content + `${q.exam_id === 1 ? '（30万）' : '（50万）' }`,
                answer: answer && answer.content
            };
        });
        return {
            ...obj,
            '用户昵称': wx_profile.nick_name,
            '性别': wx_profile.sex === 1 ? '男' : '女',
            '手机号': u.mobile
        };
    });
    return {users: customers};
};

// jsonOrdersDate 笔误 =》 jsonOrdersData
export {
    jsonCustomersData,
    generateExcel
};
