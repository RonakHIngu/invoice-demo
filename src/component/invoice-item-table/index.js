import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, Row, Col, Tag } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import { withRouter } from "react-router-dom";
import { compose } from "../../config/util";
import { calculateTotal } from "../../config/util";
import "./index.less";
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    inputType,
    handleSave,
    props,
    ...restProps
}) => {
    // const { symbol, currancy } = { ...this.props.invoiceStorage };
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    const inputNode = <Input prefix={"&"} />;

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (error) {
            console.error("error: ", error);
        }
    };

    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                        height: 30,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
    }

    return <td {...restProps}> {childNode} </td>;
};

class InvoiceItems extends React.Component {
    constructor(props) {
        super(props);
        const { dataSource } = { ...this.props.invoiceStorage };
        let tableheader = {
            item: "item",
            quantity: "quantity",
            rate: "rate",
            amount: "amount",
        };
        let tableheaderq = JSON.parse(localStorage.getItem("tableheader"));
        if (tableheaderq == null) {
            localStorage.setItem("tableheader", JSON.stringify(tableheader));
        } else {
            tableheader = tableheaderq;
        }
        this.state = {
            tableheader: {},
            tableheader,
        };

        this.columns = [
            {
                key: "1",
                title: (
                    <Input
                        className="table-input"
                        defaultValue={this.state.tableheader.item}
                        onChange={(e) => handleAddColumn(e, "1")}
                    />
                ),
                dataIndex: "item",
                width: "30%",
                editable: true,
            },
            {
                key: "2",
                title: (
                    <Input
                        className="table-input"
                        defaultValue={this.state.tableheader.quantity}
                        onChange={(e) => handleAddColumn(e, "2")}
                    />
                ),
                dataIndex: "quantity",
                editable: true,
            },
            {
                key: "3",
                title: (
                    <Input
                        className="table-input"
                        defaultValue={this.state.tableheader.rate}
                        onChange={(e) => handleAddColumn(e, "3")}
                    />
                ),
                dataIndex: "rate",
                key: "rate",
                editable: true,
                render: (value, row, index) => {
                    const { currency } = { ...this.props.invoiceStorage };
                    return <span>{currency.symbol} {value.toLocaleString('en-US')}</span>;
                }
            },
            {
                key: "4",
                title: (
                    <Input
                        className="table-input"
                        defaultValue={this.state.tableheader.amount}
                        onChange={(e) => handleAddColumn(e, "4")}
                    />
                ),

                dataIndex: "amount",
                editable: false,
                render: (value, row, index) => {
                    const { currency } = { ...this.props.invoiceStorage };

                    // do something like adding commas to the value or prefix
                    return <span>{currency.name} {currency.symbol} {value.toLocaleString('en-US')}</span>;
                }
            },
            {
                title: "",
                dataIndex: "delete",
                render: (_, record) =>
                    dataSource.length >= 1 ? (
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => this.handleDelete(record.key)}
                        >
                            <Button
                                type="primary"
                                icon={<CloseOutlined />}
                                size={"small"}
                            ></Button>
                        </Popconfirm>
                    ) : null,
            },
        ];

        const handleAddColumn = (e, key) => {
            let tableheader = JSON.parse(localStorage.getItem("tableheader"));
            if (key === "1") {
                tableheader.item = e.target.value;
            } else if (key === "2") {
                tableheader.quantity = e.target.value;
            } else if (key === "3") {
                tableheader.rate = e.target.value;
            } else if (key === "4") {
                tableheader.amount = e.target.value;
            }
            localStorage.setItem("tableheader", JSON.stringify(tableheader));
        };
    }

    async componentDidMount() {
        const { dataSource, invoiceSummary } = { ...this.props.invoiceStorage };
        let tableheader = localStorage.getItem("tableheader");
        let obj = JSON.parse(tableheader);

        let subTotalValue = 0;
        dataSource &&
            dataSource.length > 0 &&
            dataSource.map((row) => {
                subTotalValue += row.amount;
            });
        invoiceSummary.subTotal = subTotalValue;
        let data = {
            key: "subTotal",
            value: subTotalValue,
        };
        let total = calculateTotal(data);
        this.props.invoiceStorage.invoiceSummary.total = total; // setTotal to reducer state
        this.props.setInvoiceSummary(invoiceSummary);
        this.setState({
            tableheader: obj.tableheader,
        });
    }

    handleDelete = async (key) => {
        try {
            const { dataSource, invoiceSummary } = { ...this.props.invoiceStorage };
            let newData = dataSource.filter((item) => item.key !== key);
            let data = {
                key: "handleDelete",
                value: newData,
            };
            await calculateTotal(data);
            await this.props.setInvoiceTableData(newData);
            await this.calculateInvoiceSummary(newData, invoiceSummary);
        } catch (error) {
            console.error("error ", error);
        }
    };

    handleAdd = (id) => {
        const { itemsCount } = { ...this.props.invoiceStorage };
        const newData = {
            key: itemsCount,
            item: "",
            quantity: 0,
            rate: 0,
            amount: 0,
        };
        this.props.addNewItem(newData);
    };

    handleSave = (row) => {
        const { dataSource, invoiceSummary } = { ...this.props.invoiceStorage };
        const amount = (row.quantity * row.rate).toFixed(2);
        row.amount = amount;
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.props.setInvoiceTableData(newData);
        this.calculateInvoiceSummary(newData, invoiceSummary);
    };

    calculateInvoiceSummary(newData, invoiceSummary) {
        let subTotalValue = 0;
        newData &&
            newData.length > 0 &&
            newData.map((row) => {
                subTotalValue += Number(row.amount);
            });
        invoiceSummary.subTotal = (subTotalValue).toFixed(2);
        let data = {
            key: "subTotal",
            value: subTotalValue,
        };
        let total = calculateTotal(data);
        this.props.invoiceStorage.invoiceSummary.total = total; // setTotal to reducer state
        this.props.setInvoiceSummary(invoiceSummary);
    }

    render() {
        const { dataSource } = { ...this.props.invoiceStorage };
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        return (
            <div>
                <Row>
                    <Col md={24} sm={24}>
                        <Table
                            components={components}
                            rowClassName={() => "editable-row"}
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                        />
                        <Button
                            type="solid"
                            icon={<PlusOutlined />}
                            onClick={this.handleAdd}
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            Add Item
                        </Button>
                    </Col>
                </Row>
            </div>
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
)(InvoiceItems);