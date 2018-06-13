import { createSelector } from 'reselect';
import R from 'ramda';

const modelState = state => state.models;
const regionState = state => state.regions;
const brandState = state => state.brands;

export const modelSelector = createSelector(
    modelState,
    regionState,
    brandState,
    (model, region, brand) => {
        return {
            model: R.map(m => {
                return {
                    ...m,
                    region: R.find(R.propEq('id', m.region_id))(region),
                    brand: R.find(R.propEq('id', m.brand_id))(brand),
                };
            })(model)
        };
    }
);

export const inquiryListSelector = createSelector(
    state => state.data,
    state => state.ui,
    state => state.filter,
    ({ inquiries, brands, models, products, users, quotes, customers }, ui, filter) => {
        return {
            inquiries: R.filter(
                inquiry => R.propEq('state', filter)(inquiry)
            )(R.map(
                inquiry => ({
                    ...inquiry,
                    brand: { ...R.find(R.propEq('id', inquiry.brand_id))(brands) },
                    model: { ...R.find(R.propEq('id', inquiry.model_id))(models) },
                    product: { ...R.find(R.propEq('id', inquiry.product_id))(products) },
                    user: { ...R.find(R.propEq('id', inquiry.user_id))(users) },
                    customers: customers,
                    quotes: inquiry.quote_ids && inquiry.quote_ids.map((id, index) => {
                        return {...quotes.filter(quote => quote.id === id)[0], key: index};
                    }).sort((a, b) => Date.parse(b.creation_time) - Date.parse(a.creation_time))
                })
            )(inquiries)),
            ui,
        };
    }
);

const getLastQuote = (targetQuotes) => {
    let lastQuote = targetQuotes[0];
    if (lastQuote && lastQuote.purchase_price_us_dollars === 0) {
        // lastQuote.purchase_price_us_dollars === 0说明是客户还价的那条quote。
        lastQuote = {...targetQuotes[1], price: targetQuotes[0].price, note: targetQuotes[0].note, quantity: targetQuotes[0].quantity,
            creation_time: targetQuotes[0].creation_time, unit: targetQuotes[0].unit, exchange_rate: targetQuotes[0].exchange_rate};
    }
    return lastQuote;
};
const getLastQuoteHasRemark = (targetQuotes) => {
    const hasRemark = targetQuotes.filter(quote => quote.note != '')[0];
    return hasRemark;
};
export const filterInquiriesWithQuotes = (inquiry, filterType, productNotes) => {
    const {inquiries, products, quotes, users, models, brands, customers, suppliers, car_models} = inquiry;
    if (inquiries && models) {
        // 过滤，filterType === ‘draft’ || filterType instanceof Array
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
        // 生成ant design表格需求的格式 inquiries=>filtered。
        const formatedData = filtered.map((d, i) => {
            // 通过brand_id & model_id，过滤出车型
            let carMake = [];
            let carMakeCode = [];
            if (d.brand_id) {
                const b = brands.filter((brand) => {
                    return brand.id == d.brand_id;
                })[0];
                carMake.push(b.name);
                carMakeCode.push(b.id);
            }
            if (d.car_model_id) {
                const m = car_models.filter(c => {
                    return c.id == d.car_model_id;
                })[0];
                carMake.push(m.name);
                carMakeCode.push(m.id);
            }
            if (d.model_id) {
                const model = models.filter(m => {
                    return m.id == d.model_id;
                })[0];
                carMake.push(model.trim);
                carMakeCode.push(model.model_id);
            }
            // 通过product_id，过滤出产品名称
            let productName;
            let productNumbers;
            if (d.product_id) {
                const product = products.filter((p) => {
                    return p.id === d.product_id;
                })[0];
                productName = product && product.name;
                productNumbers = product && product.numbers;
            }

            // find target quotes
            const quoteIDs = d.quote_ids;
            let targetQuotes = [{
                id: 0,
                key: '00',
                user_id: d.user_id,
                creation_time: d.sent_at,
                price: '-',
                quantity: d.quantity,
                unit: d.unit,
                note: d.note,
                profit_margin: 0,
                purchase_price: 0,
                purchase_price_us_dollars: 0,
                exchange_rate: 0,
                state: 'approved',
                approval_note: d.approval_note
            }];
            if (quoteIDs) {
                // 遍历quotes，如果quote在quoteIDs里，就给targetQuotes Unshift一条quote
                // 以后也可以用last_quote_id来判断
                quotes.forEach((quote) => {
                    const id = quote.id;
                    if (quoteIDs.indexOf(id) >= 0) {
                        targetQuotes.unshift(quote);
                    }
                });
            }
            targetQuotes = targetQuotes.sort((a, b) => Date.parse(b.creation_time) - Date.parse(a.creation_time));
            // const lastQuote = targetQuotes[0];
            const lastQuote = getLastQuote(targetQuotes);
            const lastQuoteHasRemark = getLastQuoteHasRemark(targetQuotes);
            const quoteType = lastQuote && lastQuote.quote_type ? lastQuote.quote_type : customers[0].QuoteType;
            const purchasePriceUSDollars = lastQuote ? lastQuote.purchase_price_us_dollars : 0;
            const quotePrice = lastQuote && lastQuote.price !== '-' ? lastQuote.price : 0;
            let profitMargin = 0;
            if (purchasePriceUSDollars) {
                if (quoteType === 0) {
                    profitMargin = (Math.round((1 - Number(purchasePriceUSDollars) / Number(quotePrice)) * 1000) / 1000 * 100).toFixed(2);
                } else {
                    profitMargin = (Math.round((Number(quotePrice) / Number(purchasePriceUSDollars) - 1) * 1000) / 1000 * 100).toFixed(2);
                }
            }
            const productNote = productNotes.filter(p => {
                return Number(p.product_id) === Number(d.product_id) && Number(p.user_id) === Number(d.user_id);
            });
            return {
                key: i,
                sn: {
                    value: i + 1
                },
                name: {
                    value: d.name
                },
                carMake: {
                    value: carMake
                },
                inquiry_note: {
                    value: d.note
                },
                images: {
                    value: d.images
                },
                productID: {
                    value: d.product_id === null ? '' : d.product_id.toString()
                },
                productNumbers: {
                    value: productNumbers === undefined ? [] : productNumbers
                },
                productName: {
                    value: productName === undefined ? '' : productName
                },
                productNote: {
                    value: productNote.length > 0 && productNote[0].content
                },
                id: { // inquiryID
                    value: d.id
                },
                inquiryID: d.id,
                refCode: {
                    editable: false,
                    value: d.number
                },
                quantity: {
                    editable: false,
                    value: lastQuote ? lastQuote.quantity.toString() : d.quantity.toString()
                },
                unit: {
                    editable: false,
                    value: lastQuote ? lastQuote.unit : d.unit
                },
                remark: {
                    editable: false,
                    value: lastQuoteHasRemark ? lastQuoteHasRemark.note : d.note
                },
                quoteType: {
                    value: quoteType,
                },
                price: {
                    editable: false,
                    value: quotePrice
                },
                profitMargin: {
                    editable: false,
                    value: isNaN(profitMargin) ? 0 : profitMargin
                },
                purchasePrice: {
                    editable: false,
                    value: lastQuote ? lastQuote.purchase_price : 0
                },
                purchasePriceUSDollars: {
                    editable: false,
                    value: purchasePriceUSDollars
                },
                exchangeRate: {
                    editable: false,
                    value: lastQuote ? lastQuote.exchange_rate : 0
                },
                amount: {
                    value: lastQuote ? lastQuote.price * lastQuote.quantity : 0
                },
                date: {
                    value: lastQuote ? lastQuote.creation_time : d.update_time
                },
                status: {
                    value: d.state
                },
                approvalNote: {
                    value: lastQuote ? lastQuote.approval_note : '',
                },
                quotes: {
                    value: targetQuotes.map((quote, index) => ({
                        ...quote,
                        key: index
                    }))
                },
                userID: {
                    value: d.user_id
                },
                user: {
                    value: users.filter(user => user.id === d.user_id)[0].Email
                },
                customers: {
                    value: customers
                },
                lastQuoteID: {
                    value: d.last_quote_id
                },
                approval: {
                    value: lastQuote ? lastQuote.state : null
                },
                supplier: {
                    editable: false,
                    value: lastQuote ? lastQuote.supplier_id : ''
                },
                suppliers: {
                    value: suppliers
                },
                is_quoted: {
                    value: d.is_quoted
                }
            };
        });
        return formatedData;
    }
};

export const inquiryListSelectorMulti = createSelector(
    state => state.data,
    state => state.ui,
    state => state.filter,
    ({ inquiries, brands, models, products, users, quotes }, ui, filter) => {
        return {
            inquiries: R.filter(
                inquiry => {
                    let flag = false;
                    filter.forEach((f) => {
                        if (R.propEq('state', f)(inquiry)) {
                            flag = true;
                        }
                    });
                    return flag;
                }
            )(R.map(
                inquiry => ({
                    ...inquiry,
                    brand: { ...R.find(R.propEq('id', inquiry.brand_id))(brands) },
                    model: { ...R.find(R.propEq('id', inquiry.model_id))(models) },
                    product: { ...R.find(R.propEq('id', inquiry.product_id))(products) },
                    user: { ...R.find(R.propEq('id', inquiry.user_id))(users) },
                })
            )(inquiries)),
            ui,
        };
    }
);

export const inquirySelector = createSelector(
    state => state.form.inquiry,
    state => state.inquiry.ui,
    state => state.brand.data.dataSource,
    state => state.model.data.dataSource,
    state => state.product.data.dataSource,
    state => state.customer.data.dataSource,
    state => state.user.data.dataSource,
    state => state.form.profile,
    (inquiry, ui, brands, models, products, customer, users, profile) => {
        const user = { ...R.find(R.propEq('user_id', inquiry.user_id))(customer) };
        return {
            inquiry: {
                ...inquiry,
                brand: { ...R.find(R.propEq('id', inquiry.brand_id))(brands) },
                model: { ...R.find(R.propEq('id', inquiry.model_id))(models) },
                product: { ...R.find(R.propEq('id', inquiry.product_id))(products) },
                user,
                waiter: { ...R.find(R.propEq('user_id', user.waiter_id))(users) },
            },
            ui,
            users,
            profile
        };
    }
);
