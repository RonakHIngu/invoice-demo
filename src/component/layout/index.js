import React from "react";
import { Layout, Menu } from "antd";
import "./index.less";
const { Header, Content } = Layout;

export default class BaseLayout extends React.Component {
    render() {
        return (
            <Layout>
                <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="1">Invoice Generator</Menu.Item>
                    </Menu>
                </Header>
                <Content className={this.props.className}>
                    <div className="site-layout-content">{this.props.children}</div>
                </Content>
            </Layout>
        );
    }
}
