import React from "react";
import "./index.less";
import {
    Row,
    Col,
    Card,
    Button,
    Divider,
    PageHeader
} from "antd";
import BaseLayout from "../../component/layout/index";

export default class MyInvoice extends React.Component {
    state = {
        counter: 0,
        localInvoice: [],
        obj: ""
    };

    componentDidMount() {
        var invoiceStorage = localStorage.getItem("invoiceStorage");

        let obj = JSON.parse(invoiceStorage);
        this.setState({ obj: obj })

        let arr = [];
        for (let i = 0; i < parseInt(localStorage.getItem("templateCounter")); i++) {
            let o = { invoicenumber: obj[i] };
            arr.push(o);
        }
        this.setState({
            localInvoice: arr,
        });
    }

    redirectToTargetDashboard = () => {
        this.props.history.push("/dashboard");
    };

    clearlocalstorage = () => {
        localStorage.clear();
        window.location.reload(false);
    };

    moveToDashboard = (inNumber) => {
        localStorage.setItem("clickedInvoice", inNumber);
        this.props.history.push("/");
    };

    render() {
        const { localInvoice } = this.state;

        return (
            <div>
                <BaseLayout>
                    <div className="container">
                        <Row>
                            <Col md={24} sm={16}>
                                <div className="site-page-header-ghost-wrapper">
                                    <PageHeader
                                        ghost={false}
                                        onBack={() => window.history.back()}
                                        title="My Invoice"
                                        subTitle="We automatically save any invoices that you draft to your device."
                                    ></PageHeader>
                                    <Card
                                        title="Saved Invoice"
                                        style={{ alignContent: "center", marginTop: "15px" }}
                                        extra={
                                            <Row gutter={[8, 8]} style={{ margin: "0px" }}>
                                                <Col>
                                                    <Button
                                                        type="primary"
                                                        ghost
                                                        onClick={() => this.redirectToTargetDashboard()}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        onClick={() => this.clearlocalstorage()}
                                                        danger
                                                    >
                                                        Remove Invoice
                                                    </Button>
                                                </Col>
                                            </Row>
                                        }
                                    >
                                        <Row>
                                            {localInvoice && localInvoice.length > 0 ? (
                                                localInvoice.map((invoice, index) => (
                                                    <>
                                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                                            <div onClick={() => this.moveToDashboard()}>
                                                                {" "}
                                                                <Card
                                                                    style={{
                                                                        width: 230,
                                                                        height: 150,
                                                                        marginBottom: 10,
                                                                        textAlign: "center",
                                                                        padding: 30,
                                                                    }}
                                                                >
                                                                    <h3 className="drft-data">{this.state.obj.invoicePageData && this.state.obj.invoicePageData.name_plural}{this.state.obj.invoicePageData && this.state.obj.invoicePageData.symbol}{this.state.obj.invoiceSummary && this.state.obj.invoiceSummary.total}<br></br></h3>
                                                                    {this.state.obj.invoicePageData && this.state.obj.invoicePageData.billShipToValue}
                                                                </Card>
                                                                <br />
                                                            </div>
                                                        </Col>
                                                    </>
                                                ))
                                            ) : (
                                                    <p>
                                                        <center style={{ marginLeft: 550 }}>
                                                            No Invoice found!!
                                                    </center>
                                                    </p>
                                                )}
                                        </Row>
                                        <Divider></Divider>
                                        <Row>
                                            <Col md={24} sm={24}>
                                                <p className="col-red">
                                                    These invoices are stored on your device, and not
                                                    online.Clearing your browser's cache could cause you
                                                    to lose these invoices. We recommend hanging on to a
                                                    copy of each invoice you generate.
                                                </p>
                                            </Col>
                                        </Row>
                                    </Card>

                                    <Card
                                        title="Explore Invoice Templates"
                                        style={{ alignContent: "center", marginTop: "15px" }}
                                    ></Card>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </BaseLayout>
            </div>
        );
    }
}