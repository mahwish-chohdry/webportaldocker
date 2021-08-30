import React from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  SplitButton,
  DropdownButton,
  MenuItem,
} from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { toast } from 'react-toastify';
import { ICompany, deviceProps, IdeviceState, IUserPermissions } from 'Interface';
import { RootState } from "reducers";
import { connect } from "react-redux";
import * as actions from 'action/company';
import * as deviceActions from 'action/device';
import { LoaderComponent } from "components/Loader";
import { dashboardRoutes } from "constants/routes";
import { isPermittedComponent, getDefaultCustomer } from "utils/index";
import { NOT_ALLOWED, DEVICE_NAME_MAX_LENGTH, DEVICE_BATCH_NAME_MAX_LENGTH } from "constants/index";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";

class Devices extends React.Component<any, IdeviceState> {
  constructor(props: any) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    let userObj = getDefaultCustomer(this.props.userInfo, this.props.companiesList);
    return {
      companyId: this.props.history.location.state && this.props.history.location.state.customerID ? this.props.history.location.state.customerID : userObj.id,
      companyName: this.props.history.location.state && this.props.history.location.state.customerName ? this.props.history.location.state.customerName : userObj.name,
      selectedCustomerId: this.props.history.location.state && this.props.history.location.state.selectedCustomerId ? this.props.history.location.state.selectedCustomerId : userObj.customerId,
      devicePrefix: 'Smart_Fan_',
      devicePrefix2: '',
      deviceBatch: '',
      startRange: '',
      endRange: '',
      deviceName: '',
      isAddingNewBatch: true,
      isDisabled: false,
      newBatch: '',
      errors:
      {
        startRange: '',
        endRange: '',
        deviceBatch: '',
        companyName: '',
        newBatch: '',
        devicePrefix2: ''
      }
    };
  }

  componentWillMount() {
    if (this.props.companiesList && this.props.companiesList.length === 0) {
      this.props.getCompaniesList();
    }
    if (this.props.devicesBatchList && this.props.devicesBatchList.length === 0) {
      this.props.getDeviceBatchList();
    }

  }


  handleInputChange = (e: any) => {
    let errors = {} as any;
    let isDisabled = true;
    let key: string = e.currentTarget.name;
    let value = e.currentTarget.value;
    if (value.trimLeft().trimRight() == "") {
      if (key === 'newBatch') {
        this.setState({
          deviceBatch: '',
          isDisabled: false
        })
      } else {
        errors = { ...this.state.errors, [key]: `Required` };
      }
      //isDisabled = true;
    }
    else {
      errors = { ...this.state.errors, [key]: `` };
      //isDisabled = false;
    }

    if (key === 'newBatch' && value.trimLeft().trimRight() !== "") {
      this.setState({
        deviceBatch: 'None',
        newBatch: e.currentTarget.value
        , errors, isDisabled
      })
    }
    else if (key === "devicePrefix2") {
      var exp = new RegExp(/^([^0-9]*)$/);
      var ok = exp.test(value);
      if (ok) {
        errors = { ...this.state.errors, [key]: `` };
        //isDisabled = false;
        this.setState({ [key]: e.currentTarget.value, errors } as Pick<IdeviceState, keyof IdeviceState>)
      }
      else {
        errors = { ...this.state.errors, [key]: `Prefix cannot contain numbers` };
        // isDisabled = true;
        this.setState({ errors } as Pick<IdeviceState, keyof IdeviceState>)

      }
    }
    else {
      this.setState({ [key]: e.currentTarget.value, errors } as Pick<IdeviceState, keyof IdeviceState>)
    }
  }


  onSelectCompany = (company: any) => {
    this.setState({
      companyName: company.name,
      companyId: company.id,
      selectedCustomerId: company.customerId,
      isDisabled: false,
      deviceBatch: '',
      isAddingNewBatch: true,
      newBatch: '',
    });
  }

  getDeviceObject = () => {
    return {
      companyId: this.state.companyId,
      companyName: this.state.companyName,
      deviceBatch: this.state.deviceBatch,
      startRange: this.state.startRange,
      endRange: this.state.endRange,
      newBatch: this.state.newBatch
    } as IdeviceState
  }

  isButtonDisabled = () => {
    let { companyId, devicePrefix, deviceBatch, startRange, endRange, newBatch } = this.state;
    return companyId === -1 || deviceBatch === '' || newBatch === '' || startRange === '' || endRange === '';
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    if (!this.validates(this.getDeviceObject())) {
      toast.warn("Please provide required information", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
    else {
      var formValues = { ...this.state }
      formValues.devicePrefix = formValues.devicePrefix.concat(formValues.devicePrefix2.trimStart().trimEnd());
      formValues.createdBy = this.props.loggedInEmail;
      if (this.state.isAddingNewBatch) {
        formValues.batchId = 'batch' + formValues.newBatch
      }
      else {
        formValues.batchId = formValues.deviceBatch
      }
      formValues.companyName = this.state.selectedCustomerId;
      this.props.AddDevices(formValues)
      this.setState(this.getInitialState());
    }

  }

  onSelectDeviceBatch = (selectedOption: any) => {
    let selectedId = selectedOption.batchId;
    if (selectedId === "") {
      this.setState({
        deviceBatch: selectedId,
        isAddingNewBatch: true,
        newBatch: '',
      });
    } else {
      this.setState({
        deviceBatch: selectedId,
        isAddingNewBatch: false,
        newBatch: 'None'
      });
    }
  }

  validates = (deviceObj: IdeviceState) => {
    let errors = {} as any;
    let flag = true;

    let entries = Object.entries(deviceObj);
    entries.forEach(ele => {
      if (ele[1].toString().trimLeft().trimRight() == '' || ele[1].toString().trimLeft().trimRight() == '0') {
        errors[ele[0]] = 'Required';
        flag = false;
      }
    })
    if (!flag)
      this.setState({ errors, isDisabled: true });
    else
      this.setState({ isDisabled: false })

    return flag;
  }


  render() {
    return (
      <div className="content not-permitted">
        <Grid fluid>
          {this.props.componentPermissions && this.props.componentPermissions.canInsert ? '' : this.noPermissionOverlay("Sorry, You don't have permission to add new device")}
          <Row>
            <Col md={12}>


              <Card
                title="Add Devices"
                content={
                  <form onSubmit={this.handleSubmit}>
                    <Col md={12} className="custom-inputs">
                      <Col md={4}>
                        <DropdownToolTip
                          title={this.state.companyName !== '' ? this.state.companyName : 'Select User'}
                          id={`split-button-addDevices-user`}
                          className={"dropdown-70 text-cut"}
                          list={this.props.companiesList && this.props.companiesList}
                          onSelectOption={this.onSelectCompany}
                          tooltipID={'device-addDevices-user'}
                          label={'User'}
                          direction={"bottom"}
                          required={true}
                          menuItemIdkey={"id"}
                          menuItemIdName={"name"}
                        >
                        </DropdownToolTip>
                      </Col>
                      <Col md={4}>
                        <DropdownToolTip
                          title={this.state.deviceBatch !== '' ? this.state.deviceBatch : 'Select Batch'}
                          id={`split-button-devices-addDevices-existing-batch`}
                          className={"dropdown-70 text-cut"}
                          list={this.props.devicesBatchList && this.props.devicesBatchList}
                          onSelectOption={this.onSelectDeviceBatch}
                          tooltipID={'devices-addDevices-existing-batch'}
                          label={'Existing Device Batch'}
                          direction={"bottom"}
                          disabled={this.state.newBatch && this.state.newBatch.trimLeft().trimRight() !== '' && this.state.newBatch.trimLeft().trimRight() !== 'None'}
                          required={true}
                          menuItemIdkey={"batchId"}
                          menuItemIdName={"batchName"}
                          canResetSelectedOption={true}
                          resetId={''}
                          resetValue={'Select Batch'}
                        >
                        </DropdownToolTip>
                      </Col>
                    </Col>
                    <Col md={12} className="custom-inputs">
                      <Col md={6} className="deviceCustomPadding">
                        <FormGroup className="inputMargin">
                          <ControlLabel>New Batch</ControlLabel>
                          <FormControl maxLength={DEVICE_BATCH_NAME_MAX_LENGTH}
                            type="text" name="newBatch"
                            placeholder="Enter new batch"
                            disabled={this.state.isAddingNewBatch ? false : true}
                            onChange={this.handleInputChange} value={this.state.newBatch} />
                          {this.state.isAddingNewBatch ? <span className="error" >{this.state.errors.newBatch}</span> : ''}
                        </FormGroup>
                      </Col>
                    </Col>
                    <Col md={12} className="custom-inputs">
                      <Col md={3}>
                        <FormGroup>
                          <ControlLabel>Device Prefix</ControlLabel>
                          <FormControl name="devicePrefix" type="text" value={this.state.devicePrefix} disabled={true} />

                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>

                          <FormControl maxLength={DEVICE_NAME_MAX_LENGTH} className="label-less" name="devicePrefix2" type="text" value={this.state.devicePrefix2} disabled={false} onChange={this.handleInputChange} />

                          <span className="error" >{this.state.errors.devicePrefix2}</span>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Row><label className="customLabel">Serial range <span className="error">*</span></label></Row>
                          <Col md={5}>
                            <FormControl value={this.state.startRange} type="number" placeholder="Enter starting range" name="startRange" onChange={this.handleInputChange} min={1} />
                            <span className="error" >{this.state.errors.startRange}</span>
                          </Col>
                          <Col className="separatorCol">
                            <label className="separator">-</label>
                          </Col>
                          <Col md={5}>
                            <FormControl value={this.state.endRange} type="number" placeholder="Enter ending range" name="endRange" onChange={this.handleInputChange} min={1} />
                            <span className="error" >{this.state.errors.endRange}</span>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Col>


                    <Col md={12} xs={12}>
                      <Button pullRight fill className="buttonColor" id="submit" type="submit" disabled={this.isButtonDisabled() ? true : false} >
                        Add
                      </Button>
                    </Col>
                    <Col md={12}>
                      {this.props.isAddingDevice && <LoaderComponent isLoading={true} />}
                    </Col>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>

        </Grid>
      </div>
    );
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
}
const mapStateToProps = (state: RootState) => ({
  companiesList: state.Company ? state.Company.CompaniesList : [] as any[], //Companies dropdown list
  devicesBatchList: state.Device && state.Device.devicesBatchList ? state.Device.devicesBatchList : [] as any[],
  isAddingDevice: state.Device ? state.Device.isAddingDevice : false,
  addDeviceAlertStatus: state.Alerts ? state.Alerts.addDeviceAlertStatus : 'not assigned',
  permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions,
  loggedInEmail: state.User.UserInfo && state.User.UserInfo.userId ? state.User.UserInfo.userId : '',
  userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null
})

const mapDispatchToProps = {
  getCompaniesList: actions.getCompanyList,
  AddDevices: deviceActions.AddDevice,
  getDeviceBatchList: deviceActions.getDeviceBatchList,
}
export default connect(mapStateToProps, mapDispatchToProps)(Devices);
