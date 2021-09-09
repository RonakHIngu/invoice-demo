import React from "react";
import { Row, Col, Card, Input, InputNumber, Button, Divider, Modal, Select } from "antd";
import BaseLayout from "../../component/layout/index";
import Avatar from "../../component/upload/upload";
import DatePickerCmp from "../../component/date-picker";
import InvoiceItems from "../../component/invoice-item-table/index";
import { DownloadOutlined, PlusSquareOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import "./index.less";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import { withRouter } from "react-router-dom";
import { calculateTotal, compose } from "../../config/util";
import currancylist from "../../containers/dashboard/currency.json";
import Pdf from "react-to-pdf";
const ref = React.createRef();

const { Option } = Select;

class Dashboard extends React.Component {
    // constructor(props) {
    //     super(props);
    // }
    state = {
        loading: false,
        count: 0,
        data: [],
        termsCount: 0,
        setTerms: [],
        isModalVisible: false,
        isModalVisibleEmail: false,
        invoicePageData: {
            errors: {},
            invoiceTitle: "INVOICE",
            invoiceNumber: "",
            invoiceFrom: "",
            billToTitle: "Bill To",
            billToValue: "",
            billShipToTitle: "Ship To",
            billShipToValue: "",
            notesTitle: "Notes",
            invoiceDate: "Date",
            invoiceDueDate: "Due Date",
            notes: "",
            discount: 0,
            tax: 0,
            shipping: 0,
            subTotal: "SubTotal",
            taxInput: "Tax",
            subTotalInput: "SubTotal",
            discountInput: "Discount",
            shippingInput: "Shipping",
            invoiceDateInput: "",
            invoiceDueDateInput: "",
            imageUrl: "",
            name_plural: "USD",
            symbol: "$",
            total: "total",
            discountValue: 0,
            taxValue: 0,
            shippingValue: 0,
            totalValue: 2000,
            subTotalValue: 2000,
            termsPlaceHolder: "Terms and Condition - late fees, payment methods, delivery schedule",
            termsTitle: "Terms & conditions",
            termsData: [
                {
                    terms: "Terms & conditions"
                }
            ],
        },
        entities: {},
        ready: false,
        invoiceStorage: {},
        discountedValue: 0,
        taxedAmount: 0,
        tableheader: {},
        getinstantdata: {},
        DiscountHideShow: false,
        TaxHideShow: false,
        ShippingHideShow: false,
        percent: "%",
        percenttax: "%",
        isActivePdf: false
    };

    onChange = async (value) => {
        await this.setState({
            invoicePageData: {
                ...this.state.invoicePageData,
                name_plural: value,
            },
        });
        let v_data = currancylist.filter(function (currncy_value) {
            return currncy_value.code === value;
        });
        await this.setState({
            invoicePageData: {
                ...this.state.invoicePageData,
                symbol: v_data[0].symbol,
            },
        });
    };

    showModalEmail = () => {
        this.setState({ isModalVisibleEmail: true });
    };

    handleOkEmail = () => {
        this.setState({ isModalVisibleEmail: false });
    };

    handleCancelEmail = () => {
        this.setState({ isModalVisibleEmail: false });
    };

    showModal = () => {
        this.setState({ isModalVisible: true });
    };

    handleOk = () => {
        this.setState({ isModalVisible: false });
    };

    handleCancel = () => {
        this.setState({ isModalVisible: false });
    };

    redirectToTarget = () => {
        this.props.history.push("/my-invoice");
    };

    redirectToTargetDownload = () => {
        this.props.history.push("/download-invoice");
    };

    async componentDidMount() {
        let inNumber = localStorage.getItem("clickedInvoice");
        if (inNumber === null || inNumber === "" || inNumber === undefined) {
            this.setState({
                data: [],
                setTerms: this.state.invoicePageData.termsData,
            });
        } else {
            var invoiceStorage = localStorage.getItem("invoiceStorage");
            let obj = JSON.parse(invoiceStorage);
            await this.setState({
                invoiceStorage: JSON.parse(localStorage.getItem("invoiceStorage")),
            });
            await this.setState({
                discountedValue: JSON.parse(localStorage.getItem("discountedValue")),
            });
            await this.setState({
                taxedAmount: JSON.parse(localStorage.getItem("taxedAmount")),
            });
            await this.setState({
                tableheader: JSON.parse(localStorage.getItem("tableheader")),
            });

            this.setState({
                invoicePageData: {
                    ...this.state.invoicePageData,
                    invoiceTitle: obj.invoicePageData && obj.invoicePageData.invoiceTitle ? obj.invoicePageData.invoiceTitle : "INVOIVCE",
                    invoiceNumber: obj.invoicePageData && obj.invoicePageData.invoiceNumber ? obj.invoicePageData.invoiceNumber : "5",
                    invoiceFrom: obj.invoicePageData && obj.invoicePageData.invoiceFrom ? obj.invoicePageData.invoiceFrom : "Joy",
                    billToTitle: obj.invoicePageData && obj.invoicePageData.billToTitle ? obj.invoicePageData.billToTitle : "Bill To",
                    billToValue: obj.invoicePageData && obj.invoicePageData.billToValue ? obj.invoicePageData.billToValue : "",
                    billShipToTitle: obj.invoicePageData && obj.invoicePageData.billShipToTitle ? obj.invoicePageData.billShipToTitle : "Ship To",
                    billShipToValue: obj.invoicePageData && obj.invoicePageData.billShipToValue ? obj.invoicePageData.billShipToValue : "",
                    notesTitle: obj.invoicePageData && obj.invoicePageData.notesTitle ? obj.invoicePageData.notesTitle : "Notes",
                    notes: obj.invoicePageData && obj.invoicePageData.notes ? obj.invoicePageData.notes : "",
                    termsTitle: obj.invoicePageData && obj.invoicePageData.termsTitle ? obj.invoicePageData.termsTitle : "Terms & Conditions",
                    discountValue: obj.invoiceSummary.discount ? obj.invoiceSummary.discount : 0,
                    taxValue: obj.invoiceSummary.tax ? obj.invoiceSummary.tax : 0,
                    shippingValue: obj.invoiceSummary.shipping ? obj.invoiceSummary.shipping : 0,
                    imageUrl: obj.invoiceLogo ? obj.invoiceLogo : null,
                    invoiceDateInput: obj.invoiceDate ? obj.invoiceDate : "",
                    invoiceDueDateInput: obj.invoiceDueDate ? obj.invoiceDueDate : "",
                    subTotalValue: obj.invoiceSummary.subTotal ? obj.invoiceSummary.subTotal : 2000,
                    totalValue: obj.invoiceSummary.total ? obj.invoiceSummary.total : 2000,
                    setTerms: obj.newData ? obj.newData : "",
                    subTotalInput: obj.entities && obj.entities.subTotalInput ? obj.entities.subTotalInput : "SubTotal",
                    discountInput: obj.entities && obj.entities.discountInput ? obj.entities.discountInput : "Discount",
                    taxInput: obj.entities && obj.entities.taxInput ? obj.entities.taxInput : "Tax",
                    shippingInput: obj.entities && obj.entities.shippingInput ? obj.entities.shippingInput : "Shipping",
                    termsData: obj.termsData ? obj.termsData : [],
                },
            });
        }
    }
    componentDidUpdate() {
        return false;
    }
    transfer = () => {
        this.props.history.push("/download-invoice");
    };
    handleAdd = (values) => {
        const termsAdd = {
            terms: "",
        };
        switch (values) {
            case "terms":
                const { termsData } = { ...this.state.invoicePageData };
                this.state.invoicePageData.termsData.push(termsAdd);
                this.setState({ termsData });
                break;
            case "invoiceSummary":
                this.state.data.push(this.state.count + 1);
                this.setState({ data: this.state.data });
                break;
            default:
                break;
        }
    };

    delete = (category, index) => {
        switch (category) {
            case "terms":
                this.state.termsData.splice(index, 1);
                this.setState({ termsData: this.state.termsData });
                break;
            case "invoiceSummary":
                this.state.data.splice(index, 1);
                this.setState({ data: this.state.data });
            default:
                break;
        }
    };

    // handle save invoice page data
    handleSave = async () => {
        let templateCounter = localStorage.getItem("templateCounter") || 0;
        localStorage.setItem("templateCounter", parseInt(templateCounter) + 1);

        const { invoiceStorage } = this.props;
        await this.props.setInvoicePageData({ ...this.state });

        await localStorage.setItem(
            "invoiceStorage",
            JSON.stringify(invoiceStorage)
        );
        if (this.validateemployee()) {
            let entities = {};
            entities["invoiceTitle"] = "";
            this.setState({ entities: entities });
            alert("Invoice Details Save Successully");
        }
        this.setState({
            isButtonDisabled: true,
        });
        var data = localStorage.getItem("invoiceStorage");
        let obj = JSON.parse(data);
        this.setState({
            discountedValue: JSON.parse(localStorage.getItem("discountedValue")),
        });
        if(localStorage.getItem("taxedAmount") && localStorage.getItem("taxedAmount") != "NaN"){
            console.log(localStorage.getItem("taxedAmount"))
            this.setState({
                taxedAmount: JSON.parse(localStorage.getItem("taxedAmount")),
            });
        }
        this.setState({
            tableheader: JSON.parse(localStorage.getItem("tableheader")),
        });
        this.setState({
            invoiceStorage: JSON.parse(localStorage.getItem("invoiceStorage")),
        });
        this.setState({
            invoicePageData: {
                ...this.state.invoicePageData,
                invoiceTitle: obj.invoicePageData.invoiceTitle ? obj.invoicePageData.invoiceTitle : "INVOIVCE",
                invoiceNumber: obj.invoicePageData.invoiceNumber ? obj.invoicePageData.invoiceNumber : "5",
                invoiceFrom: obj.invoicePageData.invoiceFrom ? obj.invoicePageData.invoiceFrom : "Joy",
                billToTitle: obj.invoicePageData.billToTitle ? obj.invoicePageData.billToTitle : "Bill To",
                billToValue: obj.invoicePageData.billToValue ? obj.invoicePageData.billToValue : "",
                billShipToTitle: obj.invoicePageData.billShipToTitle ? obj.invoicePageData.billShipToTitle : "Ship To",
                billShipToValue: obj.invoicePageData.billShipToValue ? obj.invoicePageData.billShipToValue : "",
                notesTitle: obj.invoicePageData.notesTitle ? obj.invoicePageData.notesTitle : "Notes",
                notes: obj.invoicePageData.notes ? obj.invoicePageData.notes : "",
                termsTitle: obj.invoicePageData.termsTitle ? obj.invoicePageData.termsTitle : "Terms & Conditions",
                discountValue: obj.invoiceSummary.discount ? obj.invoiceSummary.discount : 0,
                taxValue: obj.invoiceSummary.tax ? obj.invoiceSummary.tax : 0,
                shippingValue: obj.invoiceSummary.shipping ? obj.invoiceSummary.shipping : 0,
                imageUrl: obj.imageUrl ? obj.imageUrl : "",
                invoiceDateInput: obj.invoiceDate ? obj.invoiceDate : "",
                invoiceDueDateInput: obj.invoiceDueDate ? obj.invoiceDueDate : "",
                subTotalValue: obj.invoiceSummary.subTotal ? obj.invoiceSummary.subTotal : 2000,
                totalValue: obj.invoiceSummary.total ? obj.invoiceSummary.total : 2000,
                setTerms: obj.newData ? obj.newData : "",
                subTotalInput: obj.entities.subTotalInput ? obj.entities.subTotalInput : "SubTotal",
                discountInput: obj.entities.discountInput ? obj.entities.discountInput : "Discount",
                taxInput: obj.entities.taxInput ? obj.entities.taxInput : "Tax",
                shippingInput: obj.entities.shippingInput ? obj.entities.shippingInput : "Shipping",
                termsData: obj.termsData ? obj.termsData : [],
            },
        });
    };

    handleChange = (e, field, key) => {
        switch (field) {
            case "invoiceTitle":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        invoiceTitle: e.target.value,
                    },
                });
                break;
            case "invoiceNumber":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        invoiceNumber: e.target.value,
                    },
                });
                break;
            case "invoiceFrom":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        invoiceFrom: e.target.value,
                    },
                });
                break;
            case "billToTitle":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        billToTitle: e.target.value,
                    },
                });
                break;
            case "billToValue":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        billToValue: e.target.value,
                    },
                });
                break;
            case "billShipToTitle":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        billShipToTitle: e.target.value,
                    },
                });
                break;
            case "billShipToValue":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        billShipToValue: e.target.value,
                    },
                });
                break;
            case "notesTitle":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        notesTitle: e.target.value,
                    },
                });
                break;
            case "notes":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        notes: e.target.value,
                    },
                });
                break;
            case "footer":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        footersData: e.target.value,
                    },
                });
                break;
            case "termsTitle":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        termsTitle: e.target.value,
                    },
                });
                break;
            case "terms":
                let newData = [...this.state.invoicePageData.termsData]; //get object from array
                newData[key].terms = e.target.value; // update value at index
                this.setState({ newData });
                break;
            case "invoiceDate":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        invoiceDate: e.target.value,
                    },
                });
                break;
            case "invoiceDueDate":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        invoiceDueDate: e.target.value,
                    },
                });
                break;
            case "invoiceDueDate":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        invoiceDueDate: e.target.value,
                    },
                });
                break;
            case "item":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        item: e.target.value,
                    },
                });
                break;
            case "discount":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        discount: e.target.value,
                    },
                });
                break;
            case "tax":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        tax: e.target.value,
                    },
                });
                break;

            case "subTotalInput":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        subTotalInput: e.target.value,
                    },
                });
                break;
            case "discountInput":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        discountInput: e.target.value,
                    },
                });
                break;
            case "taxInput":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        taxInput: e.target.value,
                    },
                });
                break;
            case "shippingInput":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        shippingInput: e.target.value,
                    },
                });
                break;
            default:
                break;
        }
        let entities = this.state.entities;
        entities[e.target.name] = e.target.value;
        this.setState({
            entities,
        });
    };

    validateemployee() {
        let entities = this.state.entities;
        let errors = {};
        let IsValid = true;

        if (!entities["invoiceTitle"]) {
            IsValid = false;
            errors["invoiceTitle"] = "invoiceTitle is Required";
        }
        if (!entities["invoiceNumber"]) {
            IsValid = false;
            errors["invoiceNumber"] = "invoiceNumber is Required";
        }

        if (!entities["invoiceDate"]) {
            IsValid = false;
            errors["invoiceDate"] = "invoiceDate is Required";
        }

        if (!entities["invoiceDueDate"]) {
            IsValid = false;
            errors["invoiceDueDate"] = "invoiceDueDate is Required";
        }

        if (!entities["invoiceFrom"]) {
            IsValid = false;
            errors["invoiceFrom"] = "invoiceFrom is Required";
        }
        if (!entities["invoiceBillTo"]) {
            IsValid = false;
            errors["invoiceBillTo"] = "invoice bill to is Required";
        }

        if (!entities["invoiceBillToInput"]) {
            IsValid = false;
            errors["invoiceBillToInput"] = "invoice bill to input is required";
        }
        this.setState({
            errors: errors,
        });
        return IsValid;
    }

    handleInvoiceSummaryInput = async (e, field) => {
        let value = e.target.value;
        switch (field) {
            case "discount":
                let discountValue = value && value != "" ? parseFloat(value) : 0;
                this.props.invoiceStorage.invoiceSummary.discount = discountValue;
                let discountData = {
                    key: "discount",
                    percent: this.state.percent,
                    value: discountValue
                };

                let totalAmount_1 = await calculateTotal(discountData);
                this.props.invoiceStorage.invoiceSummary.total = totalAmount_1;
                await this.props.setInvoiceSummary(
                    this.props.invoiceStorage.invoiceSummary
                );
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        discountValue: discountValue,
                    },
                });
                break;
            case "tax":
                let taxValue = value && value != "" ? parseFloat(value) : 0;
                this.props.invoiceStorage.invoiceSummary.tax = taxValue;
                let taxData = {
                    key: "tax",
                    percenttax: this.state.percenttax,
                    value: taxValue,
                };
                let totalAmount_2 = await calculateTotal(taxData);
                this.props.invoiceStorage.invoiceSummary.total = totalAmount_2;
                await this.props.setInvoiceSummary(
                    this.props.invoiceStorage.invoiceSummary
                );
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        taxValue: taxValue,
                    },
                });
                break;
            case "shipping":
                let shippingValue = value ? parseFloat(value) : 0;
                this.props.invoiceStorage.invoiceSummary.shipping = (shippingValue === "" ? 0 : shippingValue);
                let shippingData = {
                    key: "shipping",
                    value: shippingValue,
                };
                let totalAmount_3 = await calculateTotal(shippingData);
                this.props.invoiceStorage.invoiceSummary.total = totalAmount_3;
                await this.props.setInvoiceSummary(
                    this.props.invoiceStorage.invoiceSummary
                );
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        shippingValue: shippingValue,
                    },
                });
                break;
            case "name_plural":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        name_plural: e.target.value,
                    },
                });
                break;
            case "symbol":
                this.setState({
                    invoicePageData: {
                        ...this.state.invoicePageData,
                        symbol: e.target.value,
                    },
                });
                break;
            default:
                break;

        }
    };

    handleChangeDiscount = async (val) => {
        this.setState({ percent: val });
        localStorage.setItem("percent", JSON.stringify(val));
        let discountData = {
            key: "discount",
            percent: val,
            value: this.props.invoiceStorage.invoiceSummary.discount,
        };

        let totalAmount_1 = await calculateTotal(discountData);
        this.props.invoiceStorage.invoiceSummary.total = totalAmount_1;
        await this.props.setInvoiceSummary(
            this.props.invoiceStorage.invoiceSummary
        );
    }

    handleChangeTax = async (val) => {
        this.setState({ percenttax: val });
        localStorage.setItem("percenttax", JSON.stringify(val));
        
        let taxData = {
            key: "tax",
            percenttax: val,
            value: this.props.invoiceStorage.invoiceSummary.tax,
        };
        let totalAmount_2 = await calculateTotal(taxData);
        this.props.invoiceStorage.invoiceSummary.total = totalAmount_2;
        await this.props.setInvoiceSummary(
            this.props.invoiceStorage.invoiceSummary
        );
    }

    toggle() {
        this.setState(
            (prevState) => ({
                ready: false,
            }),

            () => {
                setTimeout(() => {
                    this.setState({ ready: true });
                }, 1);
            }
        );
        this.handleSave();
    }
    showpdffile = () => {
        this.setState({ isActivePdf: true });
    }

    DiscountHideShow() {
        this.setState({ DiscountHideShow: !this.state.DiscountHideShow });
    }

    TaxHideShow() {
        this.setState({ TaxHideShow: !this.state.TaxHideShow });
    }

    ShippingHideShow() {
        this.setState({ ShippingHideShow: !this.state.ShippingHideShow });

    }

    render() {
        const { data, isModalVisible, isModalVisibleEmail } = this.state;
        const {
            termsData,
            termsPlaceHolder,
            termsTitle,
            notesTitle,
            invoiceTitle,
            invoiceNumber,
            invoiceFrom,
            billToTitle,
            billToValue,
            billShipToTitle,
            billShipToValue
        } = { ...this.state.invoicePageData };
        const { subTotal, total } = {
            ...this.props.invoiceStorage.invoiceSummary,
        };
        const terms = "terms";
        const invoiceSummary = "invoiceSummary";
        const { DiscountHideShow, TaxHideShow, ShippingHideShow, isActivePdf } = this.state;

        const renderData = () => {
            return data.length && data.length > 0
                ? data.map((item, index) => {
                    return (
                        <div key={index}>
                            <Row>
                                <Col md={16} sm={16}>
                                    <Input className="calculation-input" />
                                </Col>

                                <Col md={6} sm={6}>
                                    <InputNumber
                                        className="bill remove-border"
                                        placeholder="0%"
                                        defaultValue={0}
                                        onChange={(value) => {
                                            this.handleInvoiceSummaryInput(value, "dummy");
                                        }}
                                    />
                                    {/* <Input className="bill" /> */}
                                </Col>
                                <Col md={2} style={{ marginTop: "4px", paddingLeft: "10px" }}>
                                    <Button
                                        type="primary"
                                        icon={<CloseOutlined />}
                                        size={"small"}
                                        onClick={() => this.delete(invoiceSummary, index)}
                                    ></Button>
                                </Col>
                            </Row>
                        </div>
                    );
                })
                : "";
        };

        const renderExtraTerms = () => {
            return termsData.length && termsData.length > 0
                ? termsData.map((item, index) => {
                    return (
                        <div key={index}>
                            <Row gutter={[16, 8]}>
                                <Col md={23}>
                                    <Input
                                        value={item.terms}
                                        prefix={(index+1) + "."}
                                        placeholder={termsPlaceHolder}
                                        onChange={(e) => {
                                            this.handleChange(e, "terms", index);
                                        }}
                                    // onBlur={this.saveData()}
                                    />
                                </Col>
                                <Col md={1} style={{ marginTop: "4px" }}>
                                    <Button
                                        className={"btnCloseTerms"}
                                        type="primary"
                                        icon={<CloseOutlined />}
                                        size={"small"}
                                        onClick={() => this.delete(terms, index)}
                                    ></Button>
                                </Col>
                            </Row>
                        </div>
                    );
                })
                : null;
        };

        return (
            <BaseLayout>
                <div className="container">
                    <Row>
                        <Col md={20} sm={20}>
                            <div className="page-content">
                                <Card>
                                    <Row>
                                        <Col md={12} sm={12}>
                                            <Avatar />
                                        </Col>
                                        <Col md={12} sm={12}>
                                            <Row justify="end" gutter={[16, 16]}>
                                                <Col>
                                                    <Input
                                                        value={this.state.invoicePageData.invoiceTitle}
                                                        name="invoiceTitle"
                                                        className="invoice-title-input text-right"
                                                        onChange={(e) => {
                                                            this.handleChange(e, "invoiceTitle");
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row justify="end" gutter={[16, 16]}>
                                                <Col>
                                                    <Input
                                                        value={this.state.invoicePageData.invoiceNumber}
                                                        name="invoiceNumber"
                                                        addonBefore="#"
                                                        defaultValue=""
                                                        placeholder="Invoice No.(Required)"
                                                        onChange={(e) => {
                                                            this.handleChange(e, "invoiceNumber");
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row justify="end" gutter={[16, 16]} align="middle">
                                                <Col>
                                                    <span>
                                                        <Input
                                                            value={this.state.invoicePageData.invoiceDate}
                                                            name="invoiceDate"
                                                            className="custom-input"
                                                            defaultValue="Date"
                                                            onChange={(e) => {
                                                                this.handleChange(e, "invoiceDate");
                                                            }}
                                                        />
                                                    </span>
                                                </Col>
                                                <Col>
                                                    <DatePickerCmp
                                                        className="invoice-date"
                                                        id="invoiceDate"
                                                    />
                                                </Col>
                                            </Row>
                                            <Row justify="end" gutter={[16, 16]} align="middle">
                                                <Col>
                                                    <span>
                                                        <Input
                                                            value={this.state.invoicePageData.invoiceDueDate}
                                                            name="invoiceDueDate"
                                                            className="custom-input"
                                                            defaultValue="Due date"
                                                            onChange={(e) => {
                                                                this.handleChange(e, "invoiceDueDate");
                                                            }}
                                                        />
                                                    </span>
                                                </Col>
                                                <Col>
                                                    <DatePickerCmp
                                                        className="due-date"
                                                        id="invoiceDueDate"
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <div className="who-invoice-this">
                                        <Row gutter={[8, 16]}>
                                            <Col md={6} sm={12}>
                                                <Input
                                                    value={this.state.invoicePageData.invoiceFrom}
                                                    name="invoiceFrom"
                                                    placeholder="Invoice from? (Required)"
                                                    onChange={(e) => {
                                                        this.handleChange(e, "invoiceFrom");
                                                    }}
                                                // onBlur={this.saveData()}
                                                />
                                                {/* <div className="validation-class-2">{this.state.errors.invoicePageData.invoiceFrom}</div> */}
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="bill-ship-to">
                                        <Row gutter={[8, 16]}>
                                            <Col md={6} sm={12}>
                                                <Input
                                                    value={this.state.invoicePageData.billToTitle}
                                                    name="billToTitle"
                                                    className="bill"
                                                    defaultValue="Bill To"
                                                    onChange={(e) => {
                                                        this.handleChange(e, "billToTitle");
                                                    }}
                                                />

                                                <Input
                                                    value={this.state.invoicePageData.billToValue}
                                                    name="billToValue"
                                                    placeholder="Invoice To? (Required)"
                                                    onChange={(e) => {
                                                        this.handleChange(e, "billToValue");
                                                    }}
                                                // onBlur={this.saveData()}
                                                />
                                                {/* <div className="validation-class-2">{this.state.errors.invoicePageData.billToValue}</div> */}
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <Input
                                                    value={this.state.invoicePageData.billShipToTitle}
                                                    className="bill"
                                                    defaultValue="Ship To"
                                                    onChange={(e) => {
                                                        this.handleChange(e, "billShipToTitle");
                                                    }}
                                                // onBlur={this.saveData()}
                                                />
                                                <Input
                                                    value={this.state.invoicePageData.billShipToValue}
                                                    placeholder="Ship To? (Required)"
                                                    onChange={(e) => {
                                                        this.handleChange(e, "billShipToValue");
                                                    }}
                                                // onBlur={this.saveData()}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    {/* Table Component */}
                                    <div className="invoice-items">
                                        <InvoiceItems
                                            currancy={this.state.invoicePageData.name_plural}
                                            symbol={this.state.invoicePageData.symbol}
                                        />
                                    </div>
                                    {/* End Table Component */}
                                    <section>
                                        <div className="invoice-summary">
                                            <Row justify="end">
                                                <Col md={12} sm={14}>
                                                    <Card type="inner" title="Invoice Summary">
                                                        <div className="inner-content">
                                                            <Row>
                                                                <Col md={8} sm={8} >
                                                                    <Input
                                                                        className="calculation-input"
                                                                        name="subTotalInput"
                                                                        value={
                                                                            this.state.invoicePageData.subTotalInput
                                                                                ? this.state.invoicePageData.subTotalInput
                                                                                : "SubTotal"
                                                                        }
                                                                        onChange={(e) => {
                                                                            this.handleChange(e, "subTotalInput");
                                                                        }}
                                                                    />
                                                                </Col>
                                                                <Col md={4} sm={4} style={{ marginLeft: 15, marginTop: 5 }}>
                                                                    <Input
                                                                        style={{ textAlign: "end" }}
                                                                        value={
                                                                            this.state.invoicePageData.name_plural
                                                                        }
                                                                        onChange={(e) => {
                                                                            this.handleChange(e, "name_plural");
                                                                        }}
                                                                        disabled
                                                                    ></Input>
                                                                </Col>
                                                                <Col md={3} sm={3} style={{ marginLeft: 2, marginTop: 5 }}>
                                                                    <Input
                                                                        style={{ textAlign: "end" }}
                                                                        value={this.state.invoicePageData.symbol}
                                                                        onChange={(e) => {
                                                                            this.handleChange(e, "symbol");
                                                                        }}
                                                                        disabled
                                                                    ></Input>
                                                                </Col>
                                                                <Col md={7} sm={7} style={{ marginTop: 5, marginLeft: 2 }}>
                                                                    <Input
                                                                        className="bill remove-border"
                                                                        placeholder="0.00"
                                                                        value={subTotal}
                                                                        disabled
                                                                    />
                                                                </Col>
                                                            </Row>

                                                            {DiscountHideShow && (
                                                                <Row>
                                                                    <Col md={10} sm={10}>
                                                                        <Input
                                                                            className="calculation-input"
                                                                            name="discountInput"
                                                                            value={
                                                                                this.state.invoicePageData.discountInput
                                                                                    ? this.state.invoicePageData
                                                                                        .discountInput
                                                                                    : "Discount"
                                                                            }
                                                                            onChange={(e) => {
                                                                                this.handleChange(e, "discountInput");
                                                                            }}
                                                                        />

                                                                    </Col>

                                                                    <Col md={6} sm={6}>
                                                                        <Input
                                                                            className="bill"
                                                                            value={
                                                                                this.state.invoicePageData.discountValue
                                                                            }
                                                                            onChange={(e) => {
                                                                                this.handleInvoiceSummaryInput(e, "discount");
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col md={4} sm={4}>
                                                                        <Select style={{ width: 50, marginLeft: 5 }} value={this.state.percent} onChange={this.handleChangeDiscount} >
                                                                            <Option value={this.state.invoicePageData.symbol} >{this.state.invoicePageData.symbol}</Option>
                                                                            <Option value="%">%</Option>
                                                                        </Select>
                                                                    </Col>
                                                                    <Col md={2} sm={2}>
                                                                        <Button
                                                                            shape="square"
                                                                            onClick={() => this.DiscountHideShow()}
                                                                            className="ant-btn-dashed-custom-close"
                                                                            icon={<CloseOutlined />}
                                                                        >
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            )}
                                                            {!DiscountHideShow && (
                                                                <Button
                                                                    type="dashed"
                                                                    shape="square"
                                                                    size={"large"}
                                                                    onClick={() => this.DiscountHideShow()}
                                                                    className="ant-btn-dashed-custom"
                                                                    icon={<PlusOutlined />}
                                                                >
                                                                    Discount
                                                                </Button>
                                                            )}

                                                            {TaxHideShow && (
                                                                <Row>
                                                                    <Col md={10} sm={10}>
                                                                        <Input
                                                                            className="calculation-input"
                                                                            name="taxInput"
                                                                            value={this.state.invoicePageData.taxInput ? this.state.invoicePageData.taxInput : "Tax"}
                                                                            onChange={(e) => {
                                                                                this.handleChange(e, "taxInput");
                                                                            }}
                                                                        />
                                                                    </Col>

                                                                    <Col md={6} sm={6}>
                                                                        <Input
                                                                            defaultValue="0"
                                                                            className="bill"
                                                                            value={this.state.invoicePageData.taxValue}
                                                                            onChange={(e) => {
                                                                                this.handleInvoiceSummaryInput(e, "tax");
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col md={4} sm={4}>
                                                                        <Select style={{ width: 50, marginLeft: 5 }} value={this.state.percenttax} onChange={this.handleChangeTax} >
                                                                            <Option value={this.state.invoicePageData.symbol} >{this.state.invoicePageData.symbol}</Option>
                                                                            <Option value="%">%</Option>
                                                                        </Select>
                                                                    </Col>
                                                                    <Col md={2} sm={2}>
                                                                        <Button
                                                                            shape="square"
                                                                            onClick={() => this.TaxHideShow()}
                                                                            className="ant-btn-dashed-custom-close"
                                                                            icon={<CloseOutlined />}
                                                                        >
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            )}
                                                            {!TaxHideShow && (
                                                                <Button
                                                                    type="dashed"
                                                                    shape="square"
                                                                    size={"large"}
                                                                    onClick={() => this.TaxHideShow()}
                                                                    className="ant-btn-dashed-custom"
                                                                    icon={<PlusOutlined />}
                                                                >
                                                                    Tax
                                                                </Button>
                                                            )}
                                                            {ShippingHideShow && (
                                                                <Row>
                                                                    <Col md={7} sm={7} >
                                                                        <Input
                                                                            defaultValue="0"
                                                                            className="calculation-input"
                                                                            name="shippingInput"
                                                                            value={
                                                                                this.state.invoicePageData.shippingInput
                                                                                    ? this.state.invoicePageData
                                                                                        .shippingInput
                                                                                    : "Shipping"
                                                                            }
                                                                            onChange={(e) => {
                                                                                this.handleChange(e, "shippingInput");
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col md={5} sm={5} style={{ marginLeft: 25, marginTop: 5 }}>
                                                                        <Input
                                                                            style={{ textAlign: "end" }}
                                                                            value={
                                                                                this.state.invoicePageData.name_plural
                                                                            }
                                                                            onChange={(e) => {
                                                                                this.handleInvoiceSummaryInput(e, "name_plural");
                                                                            }}
                                                                            disabled
                                                                        ></Input>
                                                                    </Col>
                                                                    <Col md={3} sm={3} style={{ marginLeft: 10, marginTop: 5 }}>
                                                                        <Input
                                                                            style={{ textAlign: "end" }}
                                                                            value={this.state.invoicePageData.symbol}
                                                                            onChange={(e) => {
                                                                                this.handleInvoiceSummaryInput(e, "symbol");
                                                                            }}
                                                                            disabled
                                                                        ></Input>
                                                                    </Col>
                                                                    <Col md={3} sm={3} style={{ marginLeft: 10, marginTop: 5 }}>
                                                                        <Input
                                                                            className="bill"
                                                                            defaultValue="0"
                                                                            value={
                                                                                this.state.invoicePageData.shippingValue
                                                                            }
                                                                            onChange={(e) => {
                                                                                this.handleInvoiceSummaryInput(e, "shipping");
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col md={2} sm={2} >
                                                                        <Button
                                                                            shape="square"
                                                                            onClick={() => this.ShippingHideShow()}
                                                                            className="ant-btn-dashed-custom-close-shipping"
                                                                            icon={<CloseOutlined />}
                                                                        >
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            )}
                                                            {!ShippingHideShow && (
                                                                <Button
                                                                    type="dashed"
                                                                    shape="square"
                                                                    size={"large"}
                                                                    onClick={() => this.ShippingHideShow()}
                                                                    className="ant-btn-dashed-custom"
                                                                    icon={<PlusOutlined />}
                                                                >
                                                                    Shipping
                                                                </Button>
                                                            )}
                                                            {renderData()}
                                                            <Divider></Divider>
                                                            <Row>
                                                                <Col md={8} sm={8}>
                                                                    <Input
                                                                        className="calculation-input"
                                                                        defaultValue="Total"
                                                                        disabled
                                                                    />
                                                                </Col>
                                                                <Col md={4} sm={4} style={{ marginLeft: 15, marginTop: 5 }}>
                                                                    <Input
                                                                        style={{ textAlign: "end" }}
                                                                        value={
                                                                            this.state.invoicePageData.name_plural
                                                                        }
                                                                        onChange={(e) => {
                                                                            this.handleInvoiceSummaryInput(e, "name_plural");
                                                                        }}
                                                                        disabled
                                                                    ></Input>
                                                                </Col>
                                                                <Col md={3} sm={3} style={{ marginLeft: 2, marginTop: 5 }}>
                                                                    <Input
                                                                        style={{ textAlign: "end" }}
                                                                        value={this.state.invoicePageData.symbol}
                                                                        onChange={(e) => {
                                                                            this.handleInvoiceSummaryInput(e, "symbol");
                                                                        }}
                                                                        disabled
                                                                    ></Input>
                                                                </Col>
                                                                <Col md={7} sm={7} style={{ marginTop: 5, marginLeft: 2 }}>
                                                                    <Input
                                                                        className="bill"
                                                                        placeholder="0.00"
                                                                        value={total}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <Divider style={{ marginLeft: "0px" }}></Divider>
                                                        {/* Temporary commented - Do not remove
                                                        <div className="actions-items">
                                                                <Button type="dashed" block icon={<PlusSquareOutlined />} onClick={() => this.handleAdd(invoiceSummary)}>
                                                                        Add More Fields
                                                                </Button>
                                                        </div>*/}
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>
                                    </section>

                                    <div className="add-notes">
                                        <Row>
                                            <Col md={6} sm={12}>
                                                <Input
                                                    className="bill remove-border marginBottom-10"
                                                    defaultValue="Notes"
                                                    value={notesTitle}
                                                    onChange={(e) => {
                                                        this.handleChange(e, "notesTitle");
                                                    }}
                                                // onBlur={this.saveData()}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={24}>
                                                <textarea
                                                    value={this.state.invoicePageData.notes}
                                                    className="elem-title"
                                                    placeholder="Notes - any relevant information not already covered"
                                                    onChange={(e) => {
                                                        this.handleChange(e, "notes");
                                                    }}
                                                ></textarea>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="terms-conditions">
                                        <Row>
                                            <Col md={24} sm={12}>
                                                <Card type="inner">
                                                    <Input
                                                        className="terms-and-notes"
                                                        style={{ width: "100%", marginBottom: 10, fontWeight: 1000 }}
                                                        defaultValue="Terms & Condition"
                                                        value={termsTitle}
                                                        onChange={(e) => {
                                                            this.handleChange(e, "termsTitle");
                                                        }}
                                                    // onBlur={this.saveData()}
                                                    />
                                                    <div>{renderExtraTerms()}</div>
                                                    <Divider style={{ marginLeft: "0px" }}></Divider>
                                                    <div className="actions-items">
                                                        <Button
                                                            type="dashed"
                                                            block
                                                            icon={<PlusSquareOutlined />}
                                                            onClick={() => this.handleAdd(terms)}
                                                        >
                                                            Add More Fields
                                                        </Button>
                                                    </div>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>
                                    <Divider></Divider>
                                </Card>
                            </div>
                        </Col>

                        <Col md={4} sm={4}>
                            <div className="invoice-nav-button">
                                <Row gutter={[0, 24]} justify="end">
                                    <Col md={22}>
                                        {" "}
                                        <Button
                                            style={{ marginRight: 10, width: 220 }}
                                            type="primary"
                                            shape="square"
                                            size={"large"}
                                            onClick={() => {
                                                this.showModalEmail();
                                            }}
                                        >
                                            Send Invoice
                                        </Button>
                                        <Modal
                                            title="Send Invoice"
                                            visible={isModalVisibleEmail}
                                            onOk={() => {
                                                this.handleOkEmail();
                                            }}
                                            onCancel={() => {
                                                this.handleCancelEmail();
                                            }}
                                        >
                                            <Row style={{ marginBottom: 20 }}>
                                                <Col md={4} sm={4}>
                                                    <div style={{ marginTop: 10 }}>
                                                        <p>
                                                            <strong>To*</strong>
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col md={20} sm={20}>
                                                    <Input
                                                        addonBefore="vcs"
                                                        defaultValue="Your Client Email address"
                                                    />
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={4} sm={4}>
                                                    <div style={{ marginTop: 10 }}>
                                                        <p>
                                                            <strong>From*</strong>
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col md={20} sm={20}>
                                                    <Input
                                                        addonBefore="fdfxvx"
                                                        defaultValue="Your Email address"
                                                    />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginTop: 20 }}>
                                                <Col md={4} sm={4}>
                                                    <div style={{ marginTop: 10 }}>
                                                        <p>
                                                            <strong>Subjecct</strong>
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col md={20} sm={20} style={{ marginTop: 10 }}>
                                                    <p>ffsdffds fdsfdsfsdfs f dsf sdfs</p>
                                                </Col>
                                            </Row>

                                            <Row style={{ marginTop: 20 }}>
                                                <Col md={4} sm={4}>
                                                    <div style={{ marginTop: 10 }}>
                                                        <p>
                                                            <strong>Message</strong>
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col md={20} sm={20} style={{ marginTop: 10 }}>
                                                    <textarea
                                                        className="textarea-email"
                                                        defaultValue="Hi vcv,

                                                            A new invoice has been created on your account. You may find a PDF of your invoice attached.

                                                            Thank you for your business!

                                                            With Regards,
                                                            - cxzczc"
                                                    ></textarea>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={4} sm={4}></Col>

                                                <Col md={6} sm={6} style={{ marginTop: 20 }}>
                                                    <iframe
                                                        src="https://www.google.com/recaptcha/api2/anchor?ar=1&amp;k=6LeRWiYUAAAAAOxjwUZQ9Plq7kinBk8KFvI7TWxh&amp;co=aHR0cHM6Ly9pbnZvaWNlLWdlbmVyYXRvci5jb206NDQz&amp;hl=en&amp;v=qc5B-qjP0QEimFYUxcpWJy5B&amp;size=normal&amp;cb=m2nbn097mlg0"
                                                        width="304"
                                                        height="78"
                                                        role="presentation"
                                                        name="a-jixo6ai86xgs"
                                                        frameborder="0"
                                                        scrolling="no"
                                                        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups-to-escape-sandbox"
                                                    ></iframe>
                                                </Col>
                                            </Row>
                                        </Modal>
                                    </Col>
                                </Row>
                                <Row gutter={[0, 24]} justify="end" className="comman-css">
                                    <Col md={22}>
                                        <Pdf targetRef={ref} filename="invoice.pdf" >
                                            {({ toPdf }) => <Button type="dashed"
                                                shape="square"
                                                icon={<DownloadOutlined />}
                                                size={"large"} onClick={() => { this.handleSave(); setTimeout(() => { this.setState({ isActivePdf: !isActivePdf }) }, 1000); setTimeout(() => { toPdf() }, 1000); setTimeout(() => { this.transfer() }, 1000); }} disabled={
                                                    // !imageUrl.length > 0 ||
                                                    !invoiceTitle.length > 0 ||
                                                    !invoiceNumber.length > 0 ||
                                                    !invoiceFrom.length > 0 ||
                                                    !billToTitle.length > 0 ||
                                                    !billToValue.length > 0 ||
                                                    !billShipToTitle.length > 0 ||
                                                    !billShipToValue.length > 0
                                                }>Download pdf</Button>}
                                        </Pdf>

                                    </Col>
                                </Row>
                                <Row gutter={[0, 24]} justify="end">
                                    <Col md={22} className="comman-css">
                                        <Button
                                            className="comman-css"
                                            type=""
                                            shape="square"
                                            size={"large"}
                                            onClick={() => {
                                                this.showModal();
                                            }}
                                        >
                                            Currency:{this.state.invoicePageData.name_plural}
                                        </Button>
                                        <Modal
                                            title="Select Currancy"
                                            visible={isModalVisible}
                                            onOk={() => {
                                                this.handleOk();
                                            }}
                                            onCancel={() => {
                                                this.handleCancel();
                                            }}
                                        >
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="Select a person"
                                                optionFilterProp="children"
                                                value={this.state.invoicePageData.name_plural}
                                            >
                                                filterOption=
                                                {(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                                {currancylist.map((option, index) => (
                                                    <option key={index} value={option.code}>
                                                        {option.name_plural}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Modal>
                                    </Col>
                                </Row>
                                <Row gutter={[0, 24]} justify="end">
                                    <Col md={22}>
                                        <Button
                                            className="comman-css"
                                            type=""
                                            shape="square"
                                            size={"large"}
                                            onClick={() => {
                                                this.handleSave();
                                            }}
                                            disabled={this.state.isButtonDisabled}
                                        >
                                            Save Template
                                        </Button>
                                    </Col>
                                </Row>
                                <Row gutter={[0, 24]} justify="end">
                                    <Col md={22}>
                                        <Button
                                            className="comman-css"
                                            type="dashed"
                                            shape="square"
                                            size={"large"}
                                            onClick={() => {
                                                this.redirectToTarget();
                                            }}
                                        >
                                            {" "}
                                            My Invoice
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>

                </div>
                {isActivePdf && <div className="containers" ref={ref}>
                    <div className="invoice-row">
                        <div className="invoice-col-6">
                            <div className="logo">
                                <div className="">
                                    <img src={
                                        this.state.invoicePageData.imageUrl
                                            ? this.state.invoicePageData.imageUrl
                                            : null
                                    } className="" alt="logo" width="200px" />
                                </div>
                            </div>
                        </div>
                        <div className="invoice-col-6">
                            <div className="invoice-title">
                                <h1>{this.state.invoicePageData.invoiceTitle
                                    ? this.state.invoicePageData.invoiceTitle
                                    : "INVOICE"}</h1>
                            </div>
                            <div className="invoice-number">{this.state.invoicePageData.invoiceNumber
                                ? this.state.invoicePageData.invoiceNumber
                                : ""}</div>
                        </div>
                    </div>
                    <div className="invoice-row invoice-bill">
                        <div className="invoice-col-6 ">
                            <div className=" flex-row">
                                <div className="bill-block w-50">
                                    <div className="label">{this.state.invoicePageData.billToTitle
                                        ? this.state.invoicePageData.billToTitle
                                        : "Bill To"} :</div>
                                    <div className="i-text">{this.state.invoicePageData.billToValue
                                        ? this.state.invoicePageData.billToValue
                                        : null}
                                    </div>
                                </div>
                                <div className="ship-block w-50">
                                    <div className="label">{this.state.invoicePageData.billShipToTitle
                                        ? this.state.invoicePageData.billShipToTitle
                                        : "Ship To"} :</div>
                                    <div className="i-text">{this.state.invoicePageData.billShipToValue
                                        ? this.state.invoicePageData.billShipToValue
                                        : null}</div>
                                </div>
                            </div>
                        </div>
                        <div className="invoice-col-6 ">
                            <div className="Date-block">
                                <div className="flex-row row-margin ">
                                    <div className="label">{this.state.invoicePageData.invoiceDate
                                        ? this.state.invoicePageData.invoiceDate
                                        : "Date"}
                                    </div>
                                    <div className="date">{this.state.invoicePageData.invoiceDateInput}</div>
                                </div>
                                <div className="flex-row row-margin ">
                                    <div className="label"> {this.state.invoicePageData.invoiceDueDate
                                        ? this.state.invoicePageData.invoiceDueDate
                                        : "Due Date"}{" "}</div>
                                    <div className="date">{this.state.invoicePageData.invoiceDueDateInput}</div>
                                </div>
                                <div className="flex-row row-margin    balance-due">
                                    <div className="label">Balance Due:</div>
                                    <div className="balance"><b>{this.state.invoicePageData.name_plural
                                        ? this.state.invoicePageData.name_plural
                                        : "USD"}&nbsp;

                                        {this.state.invoicePageData.symbol
                                            ? this.state.invoicePageData.symbol
                                            : "$"}&nbsp; </b>
                                        {this.state.invoicePageData.totalValue}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="invoice-row">
                        <div className="border-table price-table">
                            <div className="price-table-row first-row">
                                <div className="name"> {this.state.tableheader.item
                                    ? this.state.tableheader.item
                                    : "Item"}</div>
                                <div className="quat">{this.state.tableheader.quantity
                                    ? this.state.tableheader.quantity
                                    : "Quantity"}</div>
                                <div className="quat">{this.state.tableheader.rate
                                    ? this.state.tableheader.rate
                                    : "Rate"}</div>
                                <div className="right-align amount ">{this.state.tableheader.amount
                                    ? this.state.tableheader.amount
                                    : "Amount"}</div>
                            </div>
                            {this.state.invoiceStorage.dataSource
                                ? this.state.invoiceStorage.dataSource &&
                                this.state.invoiceStorage.dataSource.length > 0 &&
                                this.state.invoiceStorage.dataSource.map((data, index) => {
                                    return (
                                        <div className="price-table-row" key={index}>
                                            <div className="name">{data.item ? data.item : null}</div>
                                            <div className="quat light">{data.quantity ? data.quantity : null}</div>
                                            <div className="quat light">{data.rate ? data.rate : null}</div>
                                            <div className="right-align amount ">{data.amount ? data.amount : null}</div>
                                        </div>
                                    );
                                })
                                : null}
                            <div className="price-table-row border-bottom-0 margin-top" style={{ color: "#777" }}>
                                <div className="name border-right-0"> </div>
                                <div className="quat text-right " style={{ textAlign: "start" }}>

                                    {this.state.invoicePageData.subTotalInput
                                        ? this.state.invoicePageData.subTotalInput
                                        : "SubTotal"}:
                                        </div>
                                <div className="right-align amount    " style={{ textAlign: "start" }}>
                                    {this.state.invoicePageData.name_plural
                                        ? this.state.invoicePageData.name_plural
                                        : "USD"}&nbsp;

                                        {this.state.invoicePageData.symbol
                                        ? this.state.invoicePageData.symbol
                                        : "$"}&nbsp;
                                        {this.state.invoicePageData.subTotalValue
                                        ? this.state.invoicePageData.subTotalValue
                                        : 2000}</div>
                            </div>

                            <div className="price-table-row border-bottom-0" >
                                <div className="name border-right-0"> </div>
                                <div className="quat text-right" style={{ textAlign: "start" }}>
                                    {this.state.invoicePageData.discountInput
                                        ? this.state.invoicePageData.discountInput
                                        : "Discount"} {this.state.percent ? this.state.percent : "%"}
                                        :</div>
                                <div className="right-align amount " style={{ textAlign: "start" }}>
                                    {this.state.discountedValue ? this.state.discountedValue : 0}
                                </div>
                            </div>
                            <div className="price-table-row border-bottom-0">
                                <div className="name border-right-0"> </div>
                                <div className="quat text-right" style={{ textAlign: "start" }}>
                                    {this.state.invoicePageData.taxInput
                                        ? this.state.invoicePageData.taxInput
                                        : "Tax"} {this.state.percent ? this.state.percent : "%"}
                                         :</div>
                                <div className="right-align amount " style={{ textAlign: "start" }}>
                                    {this.state.taxedAmount ? this.state.taxedAmount : 0}
                                </div>
                            </div>
                            <div className="price-table-row border-bottom-0">
                                <div className="name border-right-0"> </div>
                                <div className="quat text-right" style={{ textAlign: "start" }}>
                                    {this.state.invoicePageData.shippingInput
                                        ? this.state.invoicePageData.shippingInput
                                        : "Shipping"}:</div>
                                <div className="right-align amount " style={{ textAlign: "start" }}>

                                    <b>{this.state.invoicePageData.name_plural
                                        ? this.state.invoicePageData.name_plural
                                        : "USD"}&nbsp;

                                        {this.state.invoicePageData.symbol
                                            ? this.state.invoicePageData.symbol
                                            : "$"}&nbsp; </b>
                                    {this.state.invoicePageData.shippingValue
                                        ? this.state.invoicePageData.shippingValue
                                        : 0}</div>
                            </div>
                            <div className="price-table-row border-bottom-0">
                                <div className="name border-right-0"> </div>
                                <div className="quat text-right" style={{ textAlign: "start" }}>{this.state.invoicePageData.total}:</div>
                                <div className="right-align amount " style={{ textAlign: "start" }}>
                                    <b>{this.state.invoicePageData.name_plural
                                        ? this.state.invoicePageData.name_plural
                                        : "USD"}&nbsp;

                                        {this.state.invoicePageData.symbol
                                            ? this.state.invoicePageData.symbol
                                            : "$"}&nbsp; </b>
                                    {this.state.invoicePageData.totalValue
                                        ? this.state.invoicePageData.totalValue
                                        : 2000}</div>
                            </div>
                            <div className="price-table-row border-bottom-0">
                                <div className="name border-right-0"> </div>
                                <div className="quat text-right " style={{ textAlign: "start" }}> Amount Paid:</div>
                                <div className="right-align amount border-right-0" style={{ textAlign: "start" }}><b>{this.state.invoicePageData.symbol}</b>{this.state.invoicePageData.totalValue}</div>
                            </div>
                        </div>
                    </div>
                    <div className="invoice-row">
                        <div className="notes-block">
                            <div className="label">     {this.state.invoicePageData.notesTitle
                                ? this.state.invoicePageData.notesTitle
                                : "Notes"}</div>
                            <div className="text"> {this.state.invoicePageData.notes
                                ? this.state.invoicePageData.notes
                                : null}</div>
                        </div>
                    </div>
                    <div className="invoice-row">
                        <div className="notes-block">
                            <div className="label"> {this.state.invoicePageData.termsTitle
                                ? this.state.invoicePageData.termsTitle
                                : "Terms & Conditions"}</div>
                            <div className="text">

                                {this.state.invoicePageData.termsData
                                    ? !!this.state.invoicePageData.termsData &&
                                    this.state.invoicePageData.termsData.length > 0 &&
                                    this.state.invoicePageData.termsData.map((data, index) => {
                                        return (
                                            <ul>
                                                <li key ={index}>
                                                    {(index+1) + "."}
                                                    {data.terms ? data.terms : null}
                                                </li>
                                            </ul>
                                        );
                                    })
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
                }
            </BaseLayout>
        );
    }
}
export default compose(
    connect(
        (state) => ({
            invoiceStorage: state.invoiceStorage,
        }),
        (dispatch) => bindActionCreators({ ...actions }, dispatch)
    ),
    withRouter
)(Dashboard);