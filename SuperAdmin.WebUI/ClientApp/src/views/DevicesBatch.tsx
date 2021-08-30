import React from "react";
import {
    Grid,
    Row,
    Col,
    SplitButton,
    DropdownButton,
    MenuItem,

} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { toast } from 'react-toastify';
import { ICompany, IDeviceBatchProps, IdeviceState, IUserPermissions } from 'Interface';
import { RootState } from "reducers";
import { connect } from "react-redux";
import * as actions from 'action/company';
import * as deviceActions from 'action/device';
import { LoaderComponent } from "components/Loader";
import Dropzone from 'react-dropzone';
import "assets/css/fileUploader.css";
import ReactTooltip from "react-tooltip";
import { isPermittedComponent, BOMTypesList, BOMFileFormatList } from "utils";
import { dashboardRoutes } from "constants/routes";
import { NOT_ALLOWED } from "constants/index";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";


class DevicesBatch extends React.Component<IDeviceBatchProps, any> {
    constructor(props: IDeviceBatchProps) {
        super(props);
        this.state = {
            companyId: this.props.userInfo ? this.props.userInfo.customer_Id : -1,
            companyName: this.props.userInfo ? this.props.userInfo.customerId : '',

            deviceBatch: '',
            devicesBatchList: [],

            formatsList: BOMFileFormatList,
            choosenFormat: '.csv',

            files: [],
            isFileValid: false,
            valid: false,

            bomTypes: BOMTypesList,
            selectedBOMType: 'Smart Fan Box'
        };
    }


    componentWillMount() {

        if (this.props.companies && this.props.companies.length === 0) {
            this.props.getAllCompanies();
        }
        if (this.props.devicesBatchList && this.props.devicesBatchList.length === 0) {
            this.props.getDeviceBatchList();
        }
    }

    noPermissionOverlay = (message: string) => {
        return <div className="overlay">
            <div className="overlay-opacity" onClick={() => { }} />
            <Grid>
                <Row>
                    <Col md={3} xs={2}></Col>
                    <Col md={7} xs={8}> <div className="filter-child"><h4>{message}</h4></div></Col>
                    <Col md={2} xs={2}></Col>
                </Row>
            </Grid>

        </div>
    }

    handleInputChange = (e: any) => {
        let key: string = e.currentTarget.name;
        this.setState({ [key]: e.currentTarget.value } as Pick<IdeviceState, keyof IdeviceState>)
    }


    onSelectCompany = (company: any) => {
        let selectedId = company.id, selectedName = company.name;
        this.setState({
            companyName: selectedName,
            companyId: selectedId
        });
    }

    onSelectDeviceBatch = (device: any) => {
        this.setState({
            deviceBatch: device.batchId
        });
    }


    onSelectFormat = (selected: any) => {
        this.setState({
            choosenFormat: selected.id
        });
    }





    isValidState = () => {
        this.setState({
            valid: this.state.isFileValid
        });
    };



    onDrop = (acceptedFiles: any[]) => {

        this.setState({ files: [...this.state.files, ...acceptedFiles] });
        acceptedFiles.forEach((file: any) => {
        });
        this.setState({ isFileValid: true }, this.isValidState);
    };

    handleUpload = () => {

        let data = {
            companyId: this.state.companyName.toString(),
            deviceBatch: this.state.deviceBatch,
            fileformat: this.state.choosenFormat,
            bomType: this.state.selectedBOMType
        }
        let file = this.state.files[0];
        var formData = new FormData();
        formData.append("file", file)
        this.props.uploadBOM(data, formData);
        this.setState({ files: [] });
    }

    getFileSelectionButtonState = () => {
        return this.state.companyId == -1 || this.state.deviceBatch == '' || this.state.files.length >= 1 || this.props.isUploadingBOM;
    }

    render() {
        return (
            <div className="content  not-permitted">
                {this.props.componentPermissions && this.props.componentPermissions.canInsert ? '' : this.noPermissionOverlay("Sorry, You don't have permission to upload BOM")}

                <Grid fluid>


                    <Card
                        title="Upload BOM"
                        content={
                            <div>
                                <Row >
                                    <div id="fileUploaderSection">
                                        <Col md={3} xs={12}>
                                            <DropdownToolTip
                                                title={this.state.companyName !== '' ? this.state.companyName : 'Select User'}
                                                id={`split-button-devices-BOM-user`}
                                                className={"dropdown-70 text-cut"}
                                                list={this.props.companies && this.props.companies}
                                                onSelectOption={this.onSelectCompany}
                                                tooltipID={'devices-BOM-user'}
                                                label={'User'}
                                                direction={"bottom"}
                                                required={true}
                                                menuItemIdkey={"id"}
                                                menuItemIdName={"name"}
                                            >
                                            </DropdownToolTip>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <DropdownToolTip
                                                title={this.state.deviceBatch !== '' ? this.state.deviceBatch : 'Select Device Batch'}
                                                id={`split-button-devices-BOM-deviceBatch`}
                                                className={"dropdown-70 text-cut"}
                                                list={this.props.devicesBatchList && this.props.devicesBatchList}
                                                onSelectOption={this.onSelectDeviceBatch}
                                                tooltipID={'devices-BOM-deviceBatch'}
                                                label={'Device Batch'}
                                                direction={"bottom"}
                                                required={true}
                                                menuItemIdkey={"batchId"}
                                                menuItemIdName={"batchName"}
                                            >
                                            </DropdownToolTip>
                                        </Col>
                                        <Col md={3} xs={12} className="custom-dropdown">
                                            <DropdownToolTip
                                                title={this.state.choosenFormat !== '' ? this.state.choosenFormat : 'Choose File Format'}
                                                id={`split-button-devices-BOM-format`}
                                                className={"dropdown-70 text-cut"}
                                                list={this.state.formatsList && this.state.formatsList}
                                                onSelectOption={this.onSelectFormat}
                                                tooltipID={'devices-BOM-format'}
                                                label={'File Format'}
                                                direction={"bottom"}
                                                required={true}
                                                menuItemIdkey={"id"}
                                                menuItemIdName={"value"}
                                            >
                                            </DropdownToolTip>
                                        </Col>
                                        <Col md={3} xs={12} className="custom-dropdown">
                                            <DropdownToolTip
                                                title={this.state.selectedBOMType !== '' ? this.state.selectedBOMType : 'Select BOM Type'}
                                                id={`split-button-devices-BOM-bomType`}
                                                className={"dropdown-70 text-cut"}
                                                list={this.state.bomTypes && this.state.bomTypes}
                                                onSelectOption={(type: any) => { this.setState({ selectedBOMType: type.id }) }}
                                                tooltipID={'devices-BOM-bomType'}
                                                label={'BOM Type'}
                                                direction={"bottom"}
                                                required={true}
                                                menuItemIdkey={"id"}
                                                menuItemIdName={"value"}
                                            >
                                            </DropdownToolTip>
                                        </Col>
                                        <Col md={12} xs={12} className={"text-right pd-30 float-right"}>

                                            <Dropzone
                                                data-tip
                                                data-for='file-select-btn'
                                                className={
                                                    "filedropzone " +
                                                    (this.getFileSelectionButtonState() ? "disabled" : "buttonColor")
                                                }
                                                multiple={false}
                                                onDrop={this.onDrop}
                                                accept={".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"}
                                                disabled={this.getFileSelectionButtonState() ? true : false}
                                            >
                                                <i className="fa fa-file-text-o" aria-hidden="true"></i> Select File
                                            </Dropzone>
                                            <ReactTooltip id='file-select-btn' effect='solid' place='top'>
                                                <span>Select Batch File</span>
                                            </ReactTooltip>

                                            <Button data-tip
                                                onClick={this.handleUpload}
                                                data-for='file-upload-btn'
                                                className={
                                                    "upload-btn buttonColor " +
                                                    (this.state.files.length < 1 || this.props.isUploadingBOM ? "disabledBtn" : "")
                                                }
                                                disabled={this.state.files.length < 1 || this.props.isUploadingBOM ? true : false}
                                            >
                                                <i className="fa fa-upload" aria-hidden="true"></i> Upload
                                            </Button>
                                            <ReactTooltip id='file-upload-btn' effect='solid' place='top'>
                                                <span>Upload Batch File</span>
                                            </ReactTooltip>
                                        </Col>
                                    </div>
                                </Row>


                                <div>
                                    {/* <Row> */}
                                        <Col md={12} xs={12} className={"file-place-holder"}>
                                            {this.state.files.length ?
                                                this.state.files.map((f: any) => (

                                                    <div className="ui card file-card">
                                                        <div className="content">
                                                            <Col md={12} xs={12} className="remove-padding-left remove-padding-right">
                                                                <Col md={2} xs={3} className="remove-padding-left"> <i className="fa fa-file-excel-o excel-color"></i></Col>
                                                                <Col md={9} xs={7} className="mt-5 text-wrap"> <span >{f.name}</span></Col>
                                                                <Col md={1} xs={2} className="mt-5 float-right clearBtn" onClick={() => { this.setState({ files: [] }) }} > <i className="fa fa-times"></i></Col>
                                                            </Col>
                                                        </div>
                                                    </div>

                                                )) : this.props.isUploadingBOM ? <LoaderComponent /> : <div className={"pd-50"}>Uploaded Files will be shown here</div>}

                                        </Col>


                                    {/* </Row> */}
                                </div>
                                {/* <div className="clearfix" /> */}
                            </div>
                        }
                    />
                </Grid>
            </div>
        );
    }
}


const mapStateToProps = (state: RootState) => ({
    companies: state.Company ? state.Company.CompaniesList : [] as any[], //Company dropdown List
    devicesBatchList: state.Device && state.Device.devicesBatchList ? state.Device.devicesBatchList : [] as any[],
    isUploadingBOM: state.Device ? state.Device.isUploadingBOM : false,
    addDeviceAlertStatus: state.Alerts ? state.Alerts.addDeviceAlertStatus : 'not assigned',
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions,
    userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null

})



const mapDispatchToProps = {
    getAllCompanies: actions.getCompanyList,
    getDeviceBatchList: deviceActions.getDeviceBatchList,
    uploadBOM: deviceActions.uploadBOM
}


export default connect(mapStateToProps, mapDispatchToProps)(DevicesBatch);
