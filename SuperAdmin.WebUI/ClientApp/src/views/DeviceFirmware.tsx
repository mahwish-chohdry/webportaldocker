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
import {ICompany , IDeviceFirmwareProps, IUserPermissions} from 'interface';
import { RootState } from "reducers";
import { connect } from "react-redux";
import * as actions from 'action/company';
import * as deviceActions from 'action/device';
import Dropzone from 'react-dropzone';
import "assets/css/fileUploader.css";
import ReactTooltip from "react-tooltip";
import { LoaderComponent } from "components/Loader";
import { dashboardRoutes } from "constants/routes";
import { isPermittedComponent, firmwareFileFormatList } from "utils";
import { NOT_ALLOWED } from "constants/index";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";

class DeviceFirmware extends React.Component<IDeviceFirmwareProps, any> {
    constructor(props: IDeviceFirmwareProps) {
        super(props);
        this.state = {
            companyId: this.props.userInfo? this.props.userInfo.customer_Id:-1,
            companyName: this.props.userInfo?  this.props.userInfo.customerId:'',

            deviceBatch: '',
            devicesBatchList: [],

            formatsList: firmwareFileFormatList,
            choosenFormat: '.bin',

            files: [],
            isFileValid: false,
            valid: false
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

    handleInputChange = (e: any) => {
        let key: string = e.currentTarget.name;
        this.setState({ [key]: e.currentTarget.value })
    }


    onSelectCompany = (company: any) => {
        this.setState({
            companyName: company.name,
            companyId: company.id
        });
    }

    onSelectDeviceBatch = (selected: any) => {
        this.setState({
            deviceBatch: selected.batchId
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
            fileformat: this.state.choosenFormat
        }
        let file = this.state.files[0];
        var formData = new FormData();
        formData.append("file", file)
        this.props.updateFirmware(data, formData);
        this.setState({files:[]});
    }

    noPermissionOverlay = (message:string) =>{
        return <div className="overlay">
            <div className="overlay-opacity" onClick={()=>{}} />
            <Grid>
                <Row>
                    <Col md={3} xs={2}></Col>
    <Col md={7} xs={8}> <div className="filter-child"><h4>{message}</h4></div></Col>
                    <Col md={2} xs={2}></Col>
                </Row>
            </Grid>
          
          </div>
    }

    render() {
        return (
            <div className="content not-permitted">
                <Grid fluid>
                { this.props.componentPermissions && this.props.componentPermissions.canInsert? '':this.noPermissionOverlay("Sorry, You don't have permission to update firmware")}
                <Card
                        title="Update Firmware"
                        content={
                            <div>
                                <Row >
                                    <div id="fileUploaderSection">
                                        <Col md={3} xs={12}>
                                            <DropdownToolTip
                                               title={this.state.companyName !== '' ? this.state.companyName : 'Select User'}
                                                id={`split-button-devices-firmware-user`}
                                                className={"dropdown-70 text-cut"}
                                                list={this.props.companies && this.props.companies}
                                                onSelectOption={this.onSelectCompany}
                                                tooltipID={'devices-firmware-user'}  
                                                label={'User'}
                                                direction={"bottom"}
                                                required={true}
                                                menuItemIdkey = {"id"}
                                                menuItemIdName = {"name"}
                                                >
                                            </DropdownToolTip>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <DropdownToolTip
                                                title={this.state.deviceBatch !== '' ? this.state.deviceBatch : 'Select Device Batch'}
                                                id={`split-button-devices-firmware-deviceBatch`}
                                                className={"dropdown-70 text-cut"}
                                                list={this.props.devicesBatchList && this.props.devicesBatchList}
                                                onSelectOption={this.onSelectDeviceBatch}
                                                tooltipID={'devices-firmware-deviceBatch'}  
                                                label={'Device Batch'}
                                                direction={"bottom"}
                                                required={true}
                                                menuItemIdkey = {"batchId"}
                                                menuItemIdName = {"batchName"}
                                                >
                                            </DropdownToolTip>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <DropdownToolTip
                                                title={this.state.choosenFormat !== '' ? this.state.choosenFormat : 'Choose File Format'}
                                                id={`split-button-devices-firmware-fileType`}
                                                className={"dropdown-70 text-cut"}
                                                list={this.state.formatsList}
                                                onSelectOption={this.onSelectFormat}
                                                tooltipID={'devices-firmware-fileType'}  
                                                label={'File Format'}
                                                direction={"bottom"}
                                                menuItemIdkey = {"id"}
                                                menuItemIdName = {"value"}
                                                >
                                            </DropdownToolTip>
                                           
                                        </Col>
                                        <Col md={3} xs={12} className={"text-right pd-22"}>

                                            <Dropzone
                                                data-tip
                                                data-for='file-select-btn'
                                                className={
                                                    "filedropzone  " +
                                                    (this.state.companyId == -1 || this.state.deviceBatch == '' || this.state.files.length >= 1 || this.props.isUploadingFirmware? "disabled" : "buttonColor")
                                                }
                                                multiple={false}
                                                onDrop={this.onDrop}
                                                accept={".bin"}
                                                disabled={this.state.companyId == -1 || this.state.deviceBatch == '' || this.state.files.length >= 1 || this.props.isUploadingFirmware? true : false}
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
                                                    (this.state.files.length < 1 || this.props.isUploadingFirmware? "disabledBtn" : "")
                                                }
                                                disabled={this.state.files.length < 1 || this.props.isUploadingFirmware? true : false}
                                            >
                                                <i className="fa fa-upload" aria-hidden="true"></i> Update
                                            </Button>
                                            <ReactTooltip id='file-upload-btn' effect='solid' place='top'>
                                                <span>Update Firmware</span>
                                            </ReactTooltip>
                                        </Col>
                                    </div>
                                </Row>



                                <div>
                                    <Col md={12} xs={12} className={"file-place-holder"}>
                                        {this.state.files.length ?
                                            this.state.files.map((f: any) => (
                                               
                                                    <div className="ui card file-card">
                                                        <div className="content">
                                                            <Col md={12} xs={12} className="remove-padding-left remove-padding-right">
                                                                <Col md={2}  xs={3} className="remove-padding-left remove-padding-right"> <i className="fa fa-cogs file-icon"></i></Col>
                                                                <Col md={9} xs={7} className="mt-5 text-wrap"> <span >{f.name}</span></Col>
                                                                <Col md={1} xs={2} className="mt-5 float-right clearBtn" onClick={()=>{ this.setState({files:[]}) }} > <i className="fa fa-times"></i></Col>
                                                            </Col>
                                                        </div>
                                                    </div>
                                               
                                            )) : this.props.isUploadingFirmware? <LoaderComponent/>: <div className={"pd-50"}>Uploaded Files will be shown here</div>}

                                    </Col>


                                </div>
                                <div className="clearfix" />
                            </div>
                        }
                    />
                </Grid>
            </div>
        );
    }
}


const mapStateToProps = (state: RootState) => ({
    companies: state.Company ? state.Company.CompaniesList : [] as any[], // Company List dropdown
    devicesBatchList: state.Device && state.Device.devicesBatchList ? state.Device.devicesBatchList : [] as any[],
    addDeviceAlertStatus: state.Alerts ? state.Alerts.addDeviceAlertStatus : 'not assigned',
    isUploadingFirmware: state.Device ? state.Device.isUploadingFirmware: false,
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission?state.User.UserInfo.userPermission: {} as IUserPermissions,
    userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null
})



const mapDispatchToProps = {
    getAllCompanies: actions.getCompanyList,
    getDeviceBatchList: deviceActions.getDeviceBatchList,
    updateFirmware: deviceActions.updateFirmware
}


export default connect(mapStateToProps, mapDispatchToProps)(DeviceFirmware);
