import XLSX from 'xlsx';
var FileSaver = require('file-saver');

// Sheetjs create excel file
const customerHeader = {
    header: ['用户昵称', '性别', '手机号', '所有银行日均（日常）存款（万元）', '已有保证（信用）贷款（万元）',
        '家庭对外担保余额（万元）', '在几家银行贷款（家）', '银行日均存款（万元）', '已有贷款银行家数（家）',
        '已有银行贷款金额（万元）', '可信额度（万元）', '姓名', '联系方式', '所处乡镇', '推荐人'
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
    console.log('data:', data);
    const {users, wx_profiles, ExamsProfile} = data;
    const {answers} = ExamsProfile;
    const customers = users.map(u => {
        const wx_profile = wx_profiles.filter(wx => u.unionid === wx.unionid)[0];
        const getAnswer = (question_id) => {
            const answer = answers.filter(a => a.question_id === question_id && a.answered_by_id === u.id)[0];
            return answer && answer.content;
        };
        return {
            '用户昵称': wx_profile.nick_name,
            '性别': wx_profile.sex === 1 ? '男' : '女',
            '手机号': u.mobile,
            '所有银行日均（日常）存款（万元）': getAnswer(1),
            '已有保证（信用）贷款（万元）': getAnswer(2),
            '家庭对外担保余额（万元）': getAnswer(3),
            '在几家银行贷款（家）': getAnswer(4),
            '银行日均存款（万元）': getAnswer(6),
            '已有贷款银行家数（家）': getAnswer(7),
            '已有银行贷款金额（万元）': getAnswer(8),
            '可信额度（万元）': getAnswer(10),
            '姓名': getAnswer(11),
            '联系方式': getAnswer(12),
            '所处乡镇': getAnswer(13),
            '推荐人': getAnswer(14)
        };
    });
    return {users: customers};
};

// jsonOrdersDate 笔误 =》 jsonOrdersData
export {
    jsonCustomersData,
    generateExcel
};
