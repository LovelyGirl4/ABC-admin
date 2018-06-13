import XLSX from 'xlsx';
var FileSaver = require('file-saver');

// Sheetjs create excel file
const inquiryHeader = {
    header: ['S.N.', 'Inquiry ID', 'Ref.Code', 'Inquiry Name', 'Car Make', 'G-Will Product Ref.Code', 'G-Will Product Name',
        'Quantity', 'Unit', 'Remark', 'Unit Price', 'Approval Note', 'Exchange Rate', 'Profit Margin(%)', 'Purchase Price',
        'Purchase Price USD', 'Amount', 'Quote State', 'Last Updated', 'Status']
};
const ordersHeader = {
    header: ['S.N.', 'Order ID', 'Date', 'Remark', 'Status']
};
const orderHeader = {
    header: ['S.N.', 'Ref. Code', 'G-Will Product Number', 'G-Will Product Name', 'Product ID',
        'Quantity', 'Unit', 'Price', 'Amount', 'Status']
};

const productHeader = {
    header: ['Name', 'Category', 'Supplier_Name', 'ParametersDesc', 'ReferenceCodes', 'Reason']
};

const supplierHeader = {
    header: ['Name', 'ID']
};

const categoryHeader = {
    header: ['Name', 'ID', 'ParentName', 'ParentID']
};

const newBook = () => XLSX.utils.book_new();
const generateInquiriesWorkSheet = (data) => {
    /* make worksheet */
    let ws = XLSX.utils.json_to_sheet(data, inquiryHeader);
    return ws;
};
const generateOrdersWorkSheet = (data) => {
    /* make worksheet */
    let ws = XLSX.utils.json_to_sheet(data, ordersHeader);
    return ws;
};
const generateOrderWorkSheet = (data) => {
    /* make worksheet */
    let ws = XLSX.utils.json_to_sheet(data, orderHeader);
    return ws;
};

const generateProductWorkSheet = (data) => {
    /* make worksheet */
    let ws = XLSX.utils.json_to_sheet(data, productHeader);
    return ws;
};

const generateSupplierWorkSheet = (data) => {
    /* make worksheet */
    let ws = XLSX.utils.json_to_sheet(data, supplierHeader);
    return ws;
};

const generateCategoryWorkSheet = (data) => {
    /* make worksheet */
    let ws = XLSX.utils.json_to_sheet(data, categoryHeader);
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
const writeWorkBook = (data, originData, types) => {
    let wb = newBook();
    const keys = Object.keys(data);
    keys.forEach(k => {
        /* Add the sheet name to the list */
        wb.SheetNames.push(k);
        /* Load the worksheet object */
        if (types === 'inquiry') {
            wb.Sheets[k] = generateInquiriesWorkSheet(data[k]);
        } else if (types === 'orders') {
            wb.Sheets[k] = generateOrdersWorkSheet(data[k]);
        } else if (types === 'order') {
            wb.Sheets[k] = generateOrderWorkSheet(data[k]);
        } else if (types === 'product') {
            wb.Sheets[k] = generateProductWorkSheet(data[k]);
        } else if (types === 'supplier') {
            wb.Sheets[k] = generateSupplierWorkSheet(data[k]);
        } else if (types === 'category') {
            wb.Sheets[k] = generateCategoryWorkSheet(data[k]);
        }
    });
    // workbook info
    // const {FirstName, MiddleName, Surname} = originData.customers[0];
    // wb.Author = MiddleName ? `${FirstName} ${MiddleName} ${Surname}` : `${FirstName} ${Surname}`;
    wb.CreatedDate = new Date();
    return wb;
};
const generateExcel = (data, originData, filename, types) => {
    let wb = writeWorkBook(data, originData, types);
    let wopts = bookOptions;
    let wbout = XLSX.write(wb, wopts);
    FileSaver.saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), filename);
};

// create inquiries excel file
const filterAccordType = (inquiries, filterType) => {
    let filtered;
    if (filterType instanceof Array) {
        filtered = inquiries.filter((i) => {
            return filterType.indexOf(i.state) >= 0;
        });
    } else {
        filtered = inquiries.filter((i) => {
            return i.state === filterType;
        });
    }
    return filtered;
};
// 别问我为什么还有个filterAccordTypeSpecialTreatment
const filterAccordTypeSpecialTreatment = (inquiries, filterType) => {
    let filtered;
    if (filterType instanceof Array) {
        filtered = inquiries.filter((i) => {
            if (i.is_quoted === 0 && filterType.indexOf(i.state) >= 0) {
                return true;
            } else {
                return false;
            }
        });
    } else {
        filtered = inquiries.filter((i) => {
            return i.state === filterType;
        });
    }
    return filtered;
};
const filterAccordTypeWithQuotes = (inquiries, filterType) => {
    let filtered;
    if (filterType instanceof Array) {
        filtered = inquiries.filter((i) => {
            return filterType.indexOf(i.state) >= 0;
        });
    } else {
        filtered = inquiries.filter((i) => {
            return i.state === filterType;
        });
    }
    return filtered;
};
const filterAccordTypeWithQuotesSpecialTreatment = (inquiries, filterType) => {
    let filtered;
    if (filterType instanceof Array) {
        filtered = inquiries.filter((i) => {
            if (i.is_quoted === 1 && filterType.indexOf(i.state) >= 0) {
                return true;
            } else {
                return false;
            }
        });
    } else {
        filtered = inquiries.filter((i) => {
            return i.state === filterType;
        });
    }
    return filtered;
};

const analyzeCarMake = (inquiry, brands, models) => {
    let carMake = [];
    let carMakeCode = [];
    if (inquiry.brand_id) {
        const b = brands.filter((brand) => {
            return brand.id == inquiry.brand_id;
        })[0];
        carMake.push(b.name);
        carMakeCode.push(b.id);
    }
    if (inquiry.model_id) {
        const m = models.filter((model) => {
            return model.id == inquiry.model_id;
        })[0];
        carMake.push(m.model_name, m.engine);
        carMakeCode.push(m.id);
    }
    return {
        carMake,
        carMakeCode
    };
};
const analyzeProduct = (inquiry, products) => {
    let productName;
    let productNumbers;
    if (inquiry.product_id) {
        const product = products.filter((p) => {
            return p.id === inquiry.product_id;
        })[0];
        productName = product && product.name;
        productNumbers = product && product.numbers;
    }
    if (productNumbers) {
        const pn = productNumbers.map(productNumber => `${productNumber.type}: ${productNumber.number}`);
        productNumbers = pn.join('\n\r');
    }
    return {
        productName,
        productNumbers
    };
};
const analyzeQuote = (data, quotes) => {
    const quoteIDs = data.quote_ids;
    let targetQuotes = [];
    if (quoteIDs) {
        // 遍历quotes，如果quote在quoteIDs里，就给targetQuotes Push一条quote
        quotes.forEach((quote) => {
            const id = quote.id;
            if (quoteIDs.indexOf(id) >= 0) {
                targetQuotes.push(quote);
            }
        });
    }
    // quote.id最大的是最新的quote
    targetQuotes.sort((a, b) => b.id - a.id);
    const lastQuote = targetQuotes[0];
    return lastQuote;
};

// sent状态下是['pending_assignment', 'pending_association', 'pending_quotes', 'pending_approval']
// 'pending_quotes'下的quotes为0条的情况。‘pending_approval’下的quotes为1条的情况。（不要问我为什么filterAccordTypeSpecialTreatment）
const filterInquiries = (inquiry, filterType, specialTreatment) => {
    const {inquiries, products, models, brands} = inquiry;
    if (inquiries && models) {
        // 过滤，filterType === ‘draft’ || filterType instanceof Array
        let filtered;
        if (specialTreatment) {
            filtered = filterAccordTypeSpecialTreatment(inquiries, filterType);
        } else {
            filtered = filterAccordType(inquiries, filterType);
        }

        const formatedData = filtered.map((d, i) => {
            // 通过brand_id & model_id，过滤出车型
            const {carMake, carMakeCode} = analyzeCarMake(d, brands, models);

            // 通过product_id，过滤出产品名称
            const {productName, productNumbers} = analyzeProduct(d, products);

            return {
                'S.N.': i + 1,
                'Inquiry ID': d.id,
                'Ref.Code': d.number,
                'Inquiry Name': d.name,
                'Car Make': carMake.join(','),
                'G-Will Product Ref.Code': productNumbers === undefined ? '' : productNumbers.toString(),
                'G-Will Product Name': productName === undefined ? '' : productName,
                'Quantity': d.quantity.toString(),
                'Unit': d.unit,
                'Remark': d.note,
                'Status': d.state,
                'Last Updated': d.update_time,
            };
        });
        return formatedData;
    }
};
const filterInquiriesWithQuotes = (inquiry, filterType, specialTreatment) => {
    const {inquiries, products, models, brands, quotes} = inquiry;
    if (inquiries && models) {
        // 过滤，filterType === ‘draft’ || filterType instanceof Array
        let filtered;
        if (specialTreatment) {
            filtered = filterAccordTypeWithQuotesSpecialTreatment(inquiries, filterType);
        } else {
            filtered = filterAccordTypeWithQuotes(inquiries, filterType);
        }

        const formatedData = filtered.map((d, i) => {
            // 通过brand_id & model_id，过滤出车型
            const {carMake, carMakeCode} = analyzeCarMake(d, brands, models);

            // 通过product_id，过滤出产品名称
            const {productName, productNumbers} = analyzeProduct(d, products);

            //  找到最近的最新的报价
            const recentQuote = analyzeQuote(d, quotes);
            let date;
            if (recentQuote) {
                let temp = new Date(recentQuote.creation_time);
                date = temp.toLocaleString();
            } else {
                let temp = new Date(d.update_time);
                date = temp.toLocaleString();
            }
            return {
                'S.N.': i + 1,
                'Inquiry ID': d.id,
                'Ref.Code': d.number,
                'Inquiry Name': d.name,
                'Car Make': carMake.join(','),
                'G-Will Product Ref.Code': productNumbers === undefined ? '' : productNumbers.toString(),
                'G-Will Product Name': productName === undefined ? '' : productName,
                'Quantity': recentQuote != null ? recentQuote.quantity : d.quantity,
                'Unit': recentQuote != null ? recentQuote.unit : d.unit,
                'Remark': recentQuote != null ? recentQuote.note : d.note,
                'Unit Price': recentQuote != null ? recentQuote.price : d.price,
                'Approval Note': recentQuote && recentQuote.approval_note,
                'Exchange Rate': recentQuote && recentQuote.exchange_rate,
                'Profit Margin(%)': recentQuote && recentQuote.profit_margin,
                'Purchase Price': recentQuote && recentQuote.purchase_price,
                'Purchase Price USD': recentQuote && recentQuote.purchase_price_us_dollars,
                'Amount': recentQuote != null ? Number(recentQuote.quantity) * Number(recentQuote.price) : Number(d.quantity) * Number(d.price),
                'Quote State': recentQuote && recentQuote.state,
                'Status': d.state,
                'Last Updated': date,
            };
        });
        return formatedData;
    }
};

// var ws = XLSX.utils.json_to_sheet([
// 	{S:1,h:2,e:3,e_1:4,t:5,J:6,S_1:7},
// 	{S:2,h:3,e:4,e_1:5,t:6,J:7,S_1:8}
// ], {header:["S","h","e","e_1","t","J","S_1"]});
const jsonInquiriesData = (data) => {
    const mutually_confirmed = filterInquiriesWithQuotes(data, ['admin_confirmed']),
        ordered = filterInquiriesWithQuotes(data, ['ordered']),
        pending_admin_confirm = filterInquiriesWithQuotes(data, ['client_confirmed']),
        pending_approval = filterInquiriesWithQuotes(data, ['pending_approval']),
        pending_association = filterInquiries(data, ['pending_association']),
        pending_customer_confirm = filterInquiriesWithQuotes(data, ['pending_customer_confirm']),
        pending_GWILL_sales_confirm = filterInquiriesWithQuotes(data, ['pending_client_confirm']),
        pending_quotes = filterInquiriesWithQuotes(data, ['pending_quotes']);
    return {
        pending_association,
        pending_quotes,
        pending_approval,
        pending_customer_confirm,
        pending_GWILL_sales_confirm,
        pending_admin_confirm,
        mutually_confirmed,
        ordered,
    };
};


// create orders excel file
const filterOrders = (data, filterType) => {
    let filtered;
    if (filterType instanceof Array) {
        filtered = data.orders.filter((o) => {
            return filterType.indexOf(o.state) >= 0;
        });
    }
    if (filterType === 'all') {
        filtered = data.orders;
    }
    const formatedData = filtered.map((f, i) => {
        return {
            'S.N.': i + 1,
            'Order ID': f.id,
            'Date': f.created_at,
            'Remark': f.note,
            'Status': f.state
        };
    });
    return formatedData;
};
const jsonOrdersDate = (data) => {
    const completedOrders = filterOrders(data, ['completed']),
        confirmedOrders = filterOrders(data, ['confirmed', 'client_validated']),
        deliveredOrders = filterOrders(data, ['delivered', 'client_completed']),
        newOrders = filterOrders(data, ['new', 'client_confirmed']),
        partialDeliveredOrders = filterOrders(data, ['partial_delivered']),
        validatedOrders = filterOrders(data, ['validated']);
    return {
        newOrders,
        confirmedOrders,
        validatedOrders,
        partialDeliveredOrders,
        deliveredOrders,
        completedOrders,
    };
};

// create order excel file
const combineItemAndProduct = (data, order) => {
    const formattedData = data.map((d, i) => {
        const orderItem = d.orderItem;
        const orderProduct = d.orderProduct;
        const productNumbers = orderProduct.numbers.map(productNumber => `${productNumber.type}: ${productNumber.number}`).join('\n\r');
        return {
            'S.N.': i + 1,
            'Ref. Code': orderProduct.numbers[0].number,
            'G-Will Product Number': productNumbers,
            'G-Will Product Name': orderProduct.name,
            'Product ID': orderProduct.id,
            'Quantity': orderItem.Quantity,
            'Unit': orderItem.Unit,
            'Price': orderItem.Price,
            'Amount': orderItem.Quantity * orderItem.Price,
            'Status': orderItem.State
        };
    });
    return addOrder(formattedData, order);
};
// not pure
const addOrder = (orderItems, order) => {
    orderItems.push({
        'S.N.': '',
        'Ref. Code': '',
        'G-Will Product Number': '',
        'G-Will Product Name': '',
        'Product ID': '',
        'Quantity': '',
        'Unit': '',
        'Price': '',
        'Amount': '',
        'Status': ''
    });
    orderItems.push({
        'S.N.': 'Order ID',
        'Ref. Code': 'Date',
        'G-Will Product Number': 'Remark',
        'G-Will Product Name': 'Status',
    });
    orderItems.push({
        'S.N.': order.id,
        'Ref. Code': order.created_at,
        'G-Will Product Number': order.note,
        'G-Will Product Name': order.state,
    });
    return orderItems;
};
const jsonOrderDate = (data, orderID) => {
    const {orders, order_items, products} = data;
    let order = orders.filter(o => o.id == orderID)[0];
    const orderItemIDs = order && order.order_item_ids;
    // 过滤订单商品
    const filteredOrderItems = orderItemIDs.map((itemID) => {
        const orderItem = order_items.filter((item) => {
            return item.id === itemID;
        })[0];
        const orderProduct = products.filter(product => {
            return product.id === orderItem.ProductID;
        })[0];
        return {orderItem, orderProduct};
    });

    let orderItems = combineItemAndProduct(filteredOrderItems, order);
    return {
        orderItems
    };
};

const jsonProductsData = (data) => {
    const newData = data.map((d, index) => {
        let reason;
        if (d.deleted === true) {
            reason = '人为操作删除';
        } else if (d.failed === true) {
            reason = `${d.numbers[0]}在数据库中已存在`;
        }
        return {
            Name: d.product_name,
            Category: d.category.join('>'),
            Supplier_Name: d.supplier.join('\n\r'),
            ParametersDesc: d.refCode.join('\n\r'),
            ReferenceCodes: d.numbers.join('\n\r'),
            Reason: reason
        };
    });
    return {product: newData};
};

const jsonSupplierData = (data) => {
    const newData = data.map(d => {
        return {
            ID: d.id,
            Name: d.name
        };
    });
    return { supplier: newData.sort((a, b) => a.Name.localeCompare(b.Name, 'zh-Hans-CN', { sensitivity: 'accent' }))};
};
const jsonCategoryData = (data) => {
    const newData = data.map(d => {
        const ParentArr = data.filter(p => p.id === d.parent_category_id);
        return {
            ID: d.id,
            Name: d.name,
            ParentID: d.parent_category_id,
            ParentName: ParentArr.length > 0 ? ParentArr[0].name : '一级品类'
        };
    });
    newData.sort((a, b) => {
        if (a.ParentID === b.ParentID) {
            return a.Name.localeCompare(b.Name);
        } else {
            return a.ParentName.localeCompare(b.ParentName);
        }
    });
    return { category: newData };
};

// jsonOrdersDate 笔误 =》 jsonOrdersData
export {
    jsonInquiriesData,
    jsonOrdersDate,
    jsonOrderDate,
    jsonProductsData,
    jsonSupplierData,
    jsonCategoryData,
    generateExcel
};
