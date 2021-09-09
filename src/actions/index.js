import { types as T } from './action_types'

// set route path
export function setInvoiceDate(data) {
    return {
        type: T.SET_INVOICE_DATE,
        data
    }
}

export function setInvoiceDueDate(data) {
    return {
        type: T.SET_INVOICE_DUE_DATE,
        data
    }
}

// set image url
export function setInvoiceLogo(data) {
    return {
        type: T.SET_INVOICE_LOGO,
        data
    }
}

// set invoice title
export function setInvoicePageData(data) {
    return {
        type: T.SET_INVOICE_PAGE_DATA,
        data
    }
}

export function setInvoiceTableData(data) {
    return {
        type: T.SET_INVOICE_TABLE_DATA,
        data
    }
}

export function setInvoiceSummary(data) {
    return {
        type: T.SET_INVOICE_SUMMARY,
        data
    }
}

export function updateInvoiceTotal(data) {
    return {
        type: T.UPDATE_INVOICE_TOTAL,
        data
    }
}

export function addNewItem(data) {
    return {
        type: T.ADD_NEW_ITEM,
        data
    }
}

export function setInvoiceCurrency(data) {
    return {
        type: T.SET_INVOICE_CURRENCY,
        data
    }
}