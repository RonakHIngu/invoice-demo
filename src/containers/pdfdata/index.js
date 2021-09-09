import React from 'react'
import "./index.less"
import { Row, Col, Card, Input, Table } from 'antd';
import BaseLayout from '../../component/layout/index'

export default class Pdfdata extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: <Input style={{ color: 'black' }} className="table-input" defaultValue="Item" disabled />,
                dataIndex: 'item',
                width: '30%',
                editable: true,
            },
            {
                title: <Input style={{ color: 'black' }} className="table-input" defaultValue="Quantity" disabled />,
                dataIndex: 'quantity',
                editable: true,
            },
            {
                title: <Input style={{ color: 'black' }} className="table-input" defaultValue="Rate" disabled />,
                dataIndex: 'rate',
                editable: true,
            },
            {
                title: <Input style={{ color: 'black' }} className="table-input" defaultValue="Amount" disabled />,
                dataIndex: 'amount',
                editable: false,
            },
        ];

    }

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
            invoiceTitle: 'INVOICE',
            invoiceNumber: '',
            invoiceFrom: '',
            billToTitle: 'Bill To',
            billToValue: '',
            billShipToTitle: 'Ship To',
            billShipToValue: '',
            notesTitle: 'Notes',
            invoiceDate: 'Date',
            invoiceDueDate: 'Due Date',
            notes: '',
            discountValue: '0',
            taxValue: '0',
            shippingValue: '0',
            imgurl: '',
            invoiceDateInput: '',
            invoiceDueDateInput: '',
            subTotalValue: '',
            totalValue: '',
            discount: 'Discount %',
            tax: 'Tax %',
            shipping: 'Shipping',
            total: 'Total',
            subTotal: 'SubTotal',
            setTerms: '',
            termsPlaceHolder: "Terms and Condition - late fees, payment methods, delivery schedule",
            termsTitle: "Terms & conditions",
            termsData: [{
                terms: "Terms & conditions"
            }],
        },
        entities: {},
    };
    componentDidMount() {
        let inNumber = localStorage.getItem('clickedInvoice');
        if (inNumber === null || inNumber === "" || inNumber === undefined) {
            this.setState({ data: [], setTerms: this.state.invoicePageData.termsData })
        } else {
            var invoiceStorage = localStorage.getItem('invoiceStorage');
            let obj = JSON.parse(invoiceStorage);
            this.setState({
                invoicePageData: {
                    ...this.state.invoicePageData,
                    invoiceTitle: obj.invoicePageData.invoiceTitle,
                    invoiceNumber: obj.invoicePageData.invoiceNumber,
                    invoiceFrom: obj.invoicePageData.invoiceFrom,
                    billToTitle: obj.invoicePageData.billToTitle,
                    billToValue: obj.invoicePageData.billToValue,
                    billShipToTitle: obj.invoicePageData.billShipToTitle,
                    billShipToValue: obj.invoicePageData.billShipToValue,
                    notesTitle: obj.invoicePageData.notesTitle,
                    notes: obj.invoicePageData.notes,
                    termsTitle: obj.invoicePageData.termsTitle,
                    discountValue: obj.invoiceSummary.discount,
                    taxValue: obj.invoiceSummary.tax,
                    shippingValue: obj.invoiceSummary.shipping,
                    imgurl: obj.invoiceLogo,
                    invoiceDateInput: obj.invoiceDate,
                    invoiceDueDateInput: obj.invoiceDueDate,
                    subTotalValue: obj.invoiceSummary.subTotal,
                    totalValue: obj.invoiceSummary.total,
                    setTerms: obj.newData
                }
            });
        }
    }
    componentDidUpdate() {
        return false
    }
    // handleChange = (e, field, key) => {
    //     switch (field) {
    //         case 'invoiceTitle':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     invoiceTitle: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'invoiceNumber':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     invoiceNumber: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'invoiceFrom':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     invoiceFrom: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'billToTitle':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     billToTitle: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'billToValue':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     billToValue: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'billShipToTitle':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     billShipToTitle: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'billShipToValue':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     billShipToValue: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'notesTitle':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     notesTitle: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'notes':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     notes: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'footer':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     footersData: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'termsTitle':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     termsTitle: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'terms':
    //             let newData = [...this.state.invoicePageData.termsData]; //get object from array
    //             let index = newData.findIndex(obj => obj.key === key); // match index
    //             newData[index].terms = e.target.value; // update value at index
    //             this.setState({ newData });
    //             break;
    //         case 'invoiceDate':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     invoiceDate: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'invoiceDueDate':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     invoiceDueDate: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'item':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     item: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'discount':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     discount: e.target.value
    //                 }
    //             });
    //             break;
    //         case 'tax':
    //             this.setState({
    //                 invoicePageData: {
    //                     ...this.state.invoicePageData,
    //                     tax: e.target.value
    //                 }
    //             });
    //             break;
    //         default:
    //             break;
    //     }
    //     let entities = this.state.entities;
    //     entities[e.target.name] = e.target.value;
    //     this.setState({
    //         entities
    //     });
    // }

    render() {
        const { termsData } = { ...this.state.invoicePageData }

        var invoiceStorage = localStorage.getItem('invoiceStorage');
        let obj = JSON.parse(invoiceStorage);
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
        const renderExtraTerms = () => {
            return termsData.length && termsData.length > 0 ? termsData.map((item, index) => {
                return (
                    <div key={index}>
                        <Row gutter={[16, 8]}>
                            <Col md={23}>
                                <label>{(index+1) + '.'} {item.terms}</label>
                            </Col>
                        </Row>
                    </div>
                );
            }) : ''
        }
        return (
            <div>
                <BaseLayout>
                    <div className="container">
                        <Card style={{ width: 1000, marginLeft: 220 }}>
                            <Row>
                                <Col md={10} sm={10}>
                                    <div>
                                        <img style={{ width: 160, height: 160 }} src={this.state.invoicePageData.imgurl} />
                                    </div>
                                </Col>
                                <Col md={8} sm={8}></Col>
                                <Col md={6} sm={6}>
                                    <div className="pdf-title"><label>{this.state.invoicePageData.invoiceTitle}</label></div>
                                    <div className="pdf-invoice-number"><label style={{ textAlign: 'end' }}>{this.state.invoicePageData.invoiceNumber}</label></div>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 30 }}>
                                <Col md={12} sm={12}>
                                    <div className="who-invoice-this">
                                        <Row gutter={[8, 16]}>
                                            <Col md={6} sm={12}>
                                                <div><label>{this.state.invoicePageData.invoiceFrom}</label></div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="bill-ship-to">
                                        <Row gutter={[8, 16]}>
                                            <Col md={6} sm={12}>
                                                <div style={{ fontWeight: 'bold' }}><label>{this.state.invoicePageData.billToTitle}</label></div>
                                                <div><label>{this.state.invoicePageData.billToValue}</label></div>
                                            </Col>
                                            <Col md={6} sm={12}>
                                                <div style={{ fontWeight: 'bold' }}><label>{this.state.invoicePageData.billShipToTitle}</label></div>
                                                <div><label>{this.state.invoicePageData.billShipToValue}</label></div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col md={12} sm={12}>
                                    <Row justify="end" gutter={[16, 16]} align="middle">
                                        <Col>
                                            <div><label>{this.state.invoicePageData.invoiceDate}</label></div>
                                        </Col>
                                        <Col>
                                            <div><label>{this.state.invoicePageData.invoiceDateInput}</label></div>
                                        </Col>
                                    </Row>
                                    <Row justify="end" gutter={[16, 16]} align="middle">
                                        <Col>
                                            <div><label>{this.state.invoicePageData.invoiceDueDate}</label></div>
                                        </Col>
                                        <Col>
                                            <div><label>{this.state.invoicePageData.invoiceDueDateInput}</label></div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={24} sm={24}>
                                    <Table
                                        bordered
                                        dataSource={obj.dataSource}
                                        columns={columns}
                                    />
                                </Col>
                            </Row>
                            <section>
                                <div className="invoice-summary">
                                    <Row justify="end">
                                        <Col md={8} sm={12}>
                                            <Card type="inner" title="Invoice Summary">
                                                <div className="inner-content">
                                                    <Row>
                                                        <Col md={16} sm={16}>
                                                            <div><label>{this.state.invoicePageData.subTotal}</label></div>
                                                        </Col>
                                                        <Col md={8} sm={8}>
                                                            <div><label>{this.state.invoicePageData.subTotalValue}</label></div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={16} sm={16}>
                                                            <div><label>{this.state.invoicePageData.discount}</label></div>
                                                        </Col>
                                                        <Col md={8} sm={8}>
                                                            <div><label>{this.state.invoicePageData.discountValue}</label></div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={16} sm={16}>
                                                            <div><label>{this.state.invoicePageData.tax}</label></div>
                                                        </Col>
                                                        <Col md={8} sm={8}>
                                                            <div><label>{this.state.invoicePageData.taxValue}</label></div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={16} sm={16}>
                                                            <div><label>{this.state.invoicePageData.shipping}</label></div>
                                                        </Col>
                                                        <Col md={8} sm={8}>
                                                            <div><label>{this.state.invoicePageData.shippingValue}</label></div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={16} sm={16}>
                                                            <div><label>{this.state.invoicePageData.total}</label></div>
                                                        </Col>
                                                        <Col md={8} sm={8}>
                                                            <div><label>{this.state.invoicePageData.totalValue}</label></div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </section>
                            <div className="add-notes">
                                <Row>
                                    <Col md={6} sm={12}>
                                        <div><label>{this.state.invoicePageData.notesTitle}</label>:</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{ marginTop: 10 }} md={6} sm={12}>
                                        <div><label>{this.state.invoicePageData.notes}</label></div>
                                    </Col>
                                </Row>
                            </div>
                            <div style={{ marginTop: 20 }} className="terms-conditions">
                                <Row>
                                    <Col md={24} sm={12}>
                                        <Card type="inner">
                                            <div><label>{this.state.invoicePageData.termsTitle}</label></div>
                                            <div>
                                                {renderExtraTerms()}
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </div>
                </BaseLayout>
            </div >
        )
    }
}