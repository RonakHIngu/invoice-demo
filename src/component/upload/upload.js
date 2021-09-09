import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";
import "./upload.less";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import { withRouter } from "react-router-dom";
import { compose } from "../../config/util";

class Avatar extends React.Component {
    state = {
        loading: false,
        imageUrl: "default.jpg",
        selectedFile: null,
        selectedFileList: [],
    };
    componentDidMount() {
        this.setState({
            imageUrl: "default.jpg",
        });
        let inNumber = localStorage.getItem("clickedInvoice");
        if (inNumber === null || inNumber === "" || inNumber === undefined) {
            this.setState({
                imageUrl: "default.jpg",
            });
        } else {
            var invoiceStorage = localStorage.getItem("invoiceStorage");
            let obj = JSON.parse(invoiceStorage);
            this.setState({
                imageUrl: obj.invoiceLogo ? obj.invoiceLogo : "default.jpg",
            });
        }
    }
    componentDidUpdate() {
        return false;
    }
    saveData = () => {
        const { invoiceStorage } = this.props;
        this.props.setInvoicePageData({ ...this.state });
        localStorage.setItem("invoiceStorage", JSON.stringify(invoiceStorage));
    };
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    handleChange = (info) => {
        if (info.file.status === "uploading") {
            this.setState({
                loading: true,
                selectedFile: info.file,
                selectedFileList: info.fileList,
            });
            return;
        }

        if (info.file.status === "done") {
            this.getBase64(info.file.originFileObj, (imageUrl) => {
                let data = { invoiceLogo: imageUrl };
                this.props.setInvoiceLogo(data);
                this.setState({
                    imageUrl: imageUrl,
                    loading: false,
                });
            });
        }

        if (info.file.status === "error") {
            this.setState({
                loading: false,
                selectedFile: null,
                selectedFileList: [],
            });
            return;
        }
    };

    customRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    beforeUpload = (file) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }

        return isJpgOrPng && isLt2M;
    };

    handlePreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    handleRemove = async (file) => {
        this.state.selectedFileList.splice(0, 1);
    };

    render() {
        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Add Your Logo</div>
            </div>
        );
        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                fileList={this.state.selectedFileList}
                customRequest={this.customRequest}
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
                onPreview={this.handlePreview}
                onRemove={this.handleRemove}
                value={this.state.imageUrl}
                onBlur={this.saveData()}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                    uploadButton
                )}
            </Upload>
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
)(Avatar);