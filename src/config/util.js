export const reduceRight = (fn, initial, list) => {
    var ret = initial;

    for (let i = list.length - 1; i >= 0; i--) {
        ret = fn(list[i], ret);
    }

    return ret;
};

export const compose = (...args) => {
    return reduceRight((cur, prev) => {
        return (x) => cur(prev(x));
    }, (x) => x, args);
};

const invoiceSummary = {
    subTotal: 0,
    discounted: 0,
    discountedValue: 0,
    total: 0,
    taxedAmount: 0,
    shipping: 0,
    tax: 0,
};

export const calculateTotal = (data) => {
    console.log("calculateTotal : ", data);
    try {
        if (data.key === "subTotal") {
            invoiceSummary.subTotal = data.value;
            invoiceSummary.total = (invoiceSummary.subTotal - invoiceSummary.discounted + invoiceSummary.taxedAmount + invoiceSummary.shipping).toFixed(2);
        } else if (data.key === "discount") {
            if(data.percent == "%"){
                invoiceSummary.discounted = ((invoiceSummary.subTotal * data.value) / 100).toFixed(2);
            } else {
                invoiceSummary.discounted = data.value;
            }
            invoiceSummary.discountedValue = invoiceSummary.subTotal - invoiceSummary.discounted;
            invoiceSummary.total = (invoiceSummary.discountedValue + invoiceSummary.taxedAmount + invoiceSummary.shipping).toFixed(2);
            localStorage.setItem("discountedValue", parseInt(invoiceSummary.discounted));
        } else if (data.key === "tax") {
            invoiceSummary.tax = data.value;
            if(data.percenttax == "%"){
                invoiceSummary.taxedAmount = (invoiceSummary.subTotal * data.value) / 100;
            } else {
                invoiceSummary.taxedAmount = data.value;
            }
            invoiceSummary.total = (invoiceSummary.subTotal - invoiceSummary.discounted + invoiceSummary.taxedAmount + invoiceSummary.shipping).toFixed(2);
            localStorage.setItem("taxedAmount", parseInt(invoiceSummary.taxedAmount));
        } else if (data.key === "shipping") {
            invoiceSummary.shipping = data.value;
            invoiceSummary.total = invoiceSummary.subTotal - invoiceSummary.discounted + invoiceSummary.taxedAmount + invoiceSummary.shipping;
        } else if (data.key === "handleDelete") {
            let calSubTotal = (invoiceSummary.subTotal - data.value[0].amount).toFixed(2);
            invoiceSummary.subTotal = calSubTotal;
            invoiceSummary.total = (invoiceSummary.subTotal - invoiceSummary.discounted + invoiceSummary.taxedAmount + invoiceSummary.shipping).toFixed(2);
        } else {
            return 0;
        }
        return invoiceSummary.total;
    } catch (error) {
        console.error("error : ", error);
    }
};

export const formatter = (number, currency) => {
    if (currency) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 2 }).format(parseFloat(number).toFixed(2))
    } else {
        return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 0 }).format(parseFloat(number).toFixed(2))
    }
}