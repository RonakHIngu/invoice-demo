import React from 'react'
import "./index.less"
import { Row, Col, Card, Button, PageHeader } from 'antd';
import BaseLayout from '../layout/index'

export default class DownloadInvoice extends React.Component {
    redirectToTargetDashboard = () => {
        this.props.history.push('/dashboard')
    }
    redirectToMyInvoice = () => {
        this.props.history.push('/my-invoice')
    }
    render() {
        return (
            <div>
                <BaseLayout>
                    <div className="container">
                        <Row>
                            <Col md={4} sm={4} />
                            <Col md={16} sm={16}>
                                <Card>
                                    <Row>
                                        <Col md={24} sm={24}>
                                            <PageHeader
                                                className="site-page-header"
                                                title="Thank you for invoicing with us!"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6} sm={6}>
                                        </Col>
                                        <Col md={24} sm={24} className="ant-page-header-heading-sub-title-custom">
                                            <div className="message-success">
                                                Your invoice has been generated! If the invoice did not open automatically then you can find it in your <b>Downloads</b> folder.
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={24} sm={24} className="ant-page-header-heading-sub-title-custom">
                                            <p style={{ margin: 20 }}>
                                                A copy has also been saved to your device. You can return to the My Invoices page any time to make changes to your invoice. It is strongly recommended that you retain a copy of the generated PDF for your records.
                                                What's next
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={8} sm={8}>
                                            <Button className="comman-css" type="primary" ghost shape="square" size={'large'} onClick={() => { this.redirectToTargetDashboard() }}>Edit This InVoice</Button>
                                        </Col>
                                        <Col md={8} sm={8}>
                                            <Button className="success-btn w-50" className="comman-css" type="primary" ghost shape="square" size={'large'} onClick={() => { this.redirectToMyInvoice() }}>Go To My Invoice</Button>
                                        </Col>
                                        <Col md={8} sm={8}>
                                            <Button className="success-btn btn-green w-100" type="primary" shape="square" size={'large'} onClick={() => { this.redirectToTargetDashboard() }}>
                                                New Invoice
                                        </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className="row">
                                            <div className="success-sub-title"><h2>Need more features?</h2></div>
                                            <div className="success-text">
                                                <p>
                                                    Invoiced makes invoicing and getting paid as simple as possible. Your invoices are stored securely online, we notify you when a client views an invoice, and you can accept online payments. Did we mention that it's free?
                                                    </p>
                                                <a href=""><div className="success-btn w-50 border-btn">Get Better Invoicing</div></a>
                                            </div>
                                            <div className="success-sub-title inline-title"><h2>Love using Invoice Generator? </h2><h5>Tell your friends!</h5></div>
                                            <div className="flex-btn">
                                                <a href="mailto:?subject=Check%20out%20this%20free%20invoicing%20service&amp;body=Hello%2C%0A%0AI%20wanted%20to%20share%20a%20free%20invoicing%20service%20I%20use%20that%20you%20might%20find%20helpful.%0A%0AInvoiced%20Lite%20-%20https%3A%2F%2Finvoice-generator.com%0A%0ACheers!" className="success-btn email-btn">
                                                    Email
                                                    </a>
                                                <a href="#" className="success-btn email-btn">
                                                    Twitter
                                                    </a>
                                            </div>
                                        </div>
                                    </Row>
                                </Card>
                            </Col>
                            <Col md={4} sm={4}>
                            </Col>
                        </Row>
                    </div>
                </BaseLayout>
            </div>
        )
    }
}