import { DatePicker, Space } from "antd";
import { compose } from "../../config/util";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import { withRouter } from "react-router-dom";
import moment from "moment";

class DatePickerCmp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storageData: JSON.parse(localStorage.getItem("invoiceStorage")),
        };
    }

    state = {
        invoiceDate: "",
        invoiceDueDate: "",
        date: new Date(),
    };
    
    onChange = (date, dateString, id) => {
        if (id === "invoiceDate") {
            let data = { invoiceDate: dateString };
            this.props.setInvoiceDate(data);
            const { invoiceStorage } = this.props;
            this.props.setInvoicePageData({ ...this.state });
            localStorage.setItem("invoiceStorage", JSON.stringify(invoiceStorage));
        } else {
            let data = { invoiceDueDate: dateString };
            this.props.setInvoiceDueDate(data);
            const { invoiceStorage } = this.props;
            this.props.setInvoicePageData({ ...this.state });
            localStorage.setItem("invoiceStorage", JSON.stringify(invoiceStorage));
        }
    };

    componentDidMount() {
        let inNumber = localStorage.getItem("clickedInvoice");
        if (inNumber === null || inNumber === "" || inNumber === undefined) {
            this.setState({ data: [] });
        } else {
            var invoiceStorage = localStorage.getItem("invoiceStorage");
            let obj = JSON.parse(invoiceStorage);
            if (this.state.invoiceDate == null && this.state.invoiceDueDate == null) {
                this.setState({
                    invoiceDate: "",
                    invoiceDueDate: "",
                });
            } else {
                this.setState({
                    invoiceDate: obj.invoiceDate,
                    invoiceDueDate: obj.invoiceDueDate,
                });
            }
        }
    }
    componentDidUpdate() {
        return false;
    }

    render() {
        const { storageData } = this.state;
        if (this.state.invoiceDate == null && this.state.invoiceDueDate == null) {
            return (
                <DatePicker
                    className={this.props.className}
                    onChange={(date, dateString) =>
                        this.onChange(date, dateString, this.props.id)
                    }
                />
            );
        } else {
            return (
                <Space direction="vertical">
                    {this.props.className === "invoice-date" && (
                        <DatePicker
                            className={this.props.className}
                            value={moment(storageData.invoiceDate)}
                            onChange={(date, dateString) =>
                                this.onChange(date, dateString, this.props.id)
                            }
                        />
                    )}
                    {this.props.className === "due-date" && (
                        <DatePicker
                            className={this.props.className}
                            value={moment(storageData.invoiceDueDate)}
                            onChange={(date, dateString) =>
                                this.onChange(date, dateString, this.props.id)
                            }
                        />
                    )}
                </Space>
            );
        }
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
)(DatePickerCmp);