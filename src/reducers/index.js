import { types as T } from "../actions/action_types";
const initialState = {
    invoiceStorage: {
        dataSource: [
            {
                key: 0,
                item: '',
                quantity: 0,
                rate: 0,
                amount: 0
            },
        ],
        itemsCount: 1,
        invoiceSummary: {
            subTotal: 0,
            discount: 0,
            tax: 0,
            shipping: 0,
            total: 0,
        },
        currency: {
            name: "USD",
            symbol: "$",
        },
    },
};

export default function reducer(state = initialState, action) {
    // reducer action and set according in to reducer state
    switch (action.type) {
        case T.SET_INVOICE_DATE:
            return {
                ...state,
                invoiceStorage: Object.assign(state.invoiceStorage, action.data),
            };
        case T.SET_INVOICE_DUE_DATE:
            return {
                ...state,
                invoiceStorage: Object.assign(state.invoiceStorage, action.data),
            };
        case T.SET_INVOICE_LOGO:
            return {
                ...state,
                invoiceStorage: Object.assign(state.invoiceStorage, action.data),
            };
        case T.SET_INVOICE_TITLE:
            return {
                ...state,
                invoiceStorage: Object.assign(state.invoiceStorage, action.data),
            };
        case T.SET_INVOICE_PAGE_DATA:
            return {
                ...state,
                invoiceStorage: Object.assign(state.invoiceStorage, action.data),
            };
        case T.SET_INVOICE_TABLE_DATA:
            return {
                ...state,
                invoiceStorage: {
                    ...state.invoiceStorage,
                    dataSource: action.data,
                },
            };
        case T.SET_INVOICE_SUMMARY:
            return {
                ...state,
                invoiceStorage: {
                    ...state.invoiceStorage,
                    itemsCount: state.invoiceStorage.dataSource.length,
                    invoiceSummary: {
                        ...state.invoiceStorage.invoiceSummary,
                        ...action.data,
                    },
                },
            };
        case T.UPDATE_INVOICE_TOTAL:
            return {
                ...state,
                invoiceStorage: Object.assign(
                    state.invoiceStorage.invoiceSummary,
                    action.data
                ),
            };
        case T.ADD_NEW_ITEM:
            return {
                ...state,
                invoiceStorage: {
                    ...state.invoiceStorage,
                    dataSource: [...state.invoiceStorage.dataSource, action.data],
                    itemsCount: state.invoiceStorage.itemsCount + 1,
                },
            };
        case T.SET_INVOICE_CURRENCY:
            return {
                ...state,
                invoiceStorage: {
                    ...state.invoiceStorage,
                    currency: {
                        ...state.invoiceStorage.currency,
                        name: action.data.name,
                        symbol: action.data.symbol
                    }
                },
            };
        default:
            return state;
    }
}