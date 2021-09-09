import React from 'react'
import { Row, Col } from 'antd'
// css for this component
import './not_found.less'
// if component not found then display this component
class NotFound extends React.Component {
    render() {
        return (
            <Row>
                <Col
                    sm={{ span: 12, offset: 6 }}
                    xs={{ span: 22, offset: 1 }}
                    className="coming-soon-container"
                >
                    Not Found
                </Col>
            </Row>
        )
    }
}

export default NotFound
