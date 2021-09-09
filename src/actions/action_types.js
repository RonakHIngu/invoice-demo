// actions for local data set
const simpleTypes = [
    "SET_INVOICE_DATE",
    "SET_INVOICE_DUE_DATE",
    "SET_INVOICE_LOGO",
    "SET_INVOICE_PAGE_DATA",
    "SET_INVOICE_TABLE_DATA",
    "SET_INVOICE_SUMMARY",
    "UPDATE_INVOICE_TOTAL",
    "ADD_NEW_ITEM",
    "SET_INVOICE_CURRENCY"
].reduce((prev, cur) => {
    prev[cur] = cur
    return prev
}, {})

export const types = { ...simpleTypes }