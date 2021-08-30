import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import {
  Grid, Row, Col, SplitButton,
  MenuItem, FormGroup, ControlLabel, FormControl, DropdownButton, DropdownButtonProps
} from "react-bootstrap";
import * as deviceActions from 'action/device';
import * as reportActions from 'action/reports';
import * as companyActions from 'action/company';
import { Card } from "components/Card/Card.jsx";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { LoaderComponent } from 'components/Loader';
import Button from "components/CustomButton/CustomButton.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { responsiveBar } from "variables/Variables.jsx";
import { toast } from 'react-toastify';
import { displayModeList, isPermittedComponent } from 'utils';
import { dashboardRoutes } from "constants/routes";
import { NOT_ALLOWED, reportNames } from "constants/index";
import { getDefaultCustomer } from "utils/index";
import { UsageApexData } from 'utils/ReportChartData.js';
import Chart from "react-apexcharts";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip.jsx";
import { RootState } from "reducers";
import { IUsageReportState, IUsageReportProps } from "Interface";

class UsageReport extends React.Component<IUsageReportProps,IUsageReportState> {
  constructor(props:any) {
    super(props);
    let userObj = getDefaultCustomer(this.props.userInfo, this.props.companies);
    this.state = {
      companyName: userObj.name,
      deviceName: '',
      deviceId: '',
      date: '',
      companyId: userObj.id,
      lastUpdate: 'no updates',
      displayMode: 1,
      usageReport: null,
      selectedCustomerId: userObj.customerId,


    };
  }


  isReportButtonDisabled = () => {
    const { companyId, deviceId, date } = this.state;
    return deviceId === "" || companyId === -1 || date === '';
  }


  componentWillMount() {
    if (this.props.companies && this.props.companies.length === 0) {
      this.props.getAllCompanies();
    }
    if (this.props.devices && this.props.devices.length === 0) {
      this.props.getDevices();
    }
  }

  componentWillUnmount() {
    this.props.clearReportData(reportNames.USAGE_REPORT);
  }


  componentWillReceiveProps = (nextProps:any) => {
    if (JSON.stringify(nextProps.usageReport) != JSON.stringify(this.state.usageReport) && this.state.companyId != -1 && this.state.deviceId != '' && this.state.date != '')
      this.setState({ usageReport: nextProps.usageReport });
  }
  componentDidUpdate(prevProps:any) {
    if (this.props != prevProps) {
      if (this.props.usageReport && this.props.usageReport.labels && this.props.usageReport.labels.length > 0) {
        var status = 'Usage report from ' + this.props.usageReport.labels[0] + ' to ' + this.props.usageReport.labels[this.props.usageReport.labels.length - 1];
        this.setState({
          lastUpdate: status
        })
      }
    }

  }


  onSelectCompany = (company:any) => {
    this.setState({
      companyName: company.name,
      companyId: company.id,
      deviceName: '',
      date: '',
      selectedCustomerId: company.customerId
    });

  }

  onSelectDevice = (device:any) => {
    let selectedId = device.deviceId;
    let selectedName = device.name;
    this.setState({
      deviceName: selectedName,
      deviceId: selectedId,
    });
  }

  handleInputChange = (e:any) => {
    this.setState({
      date: e.currentTarget.value,
    });
  }
  handleSubmit = (e:any) => {
    var warning = ''
    e.preventDefault();
    if (this.state.companyName != '' && this.state.deviceName != '' && this.state.date != '') {
      let obj = { ...this.state } as any ;
      obj.days = 7;
      obj.emailId = this.props.userInfo.userId;
      this.props.GetUsageReport(obj);
    }
    else {
      if (this.state.companyName === '') {
        warning = 'Please select User';
      } else if (this.state.deviceName === '') {
        warning = 'Please select Device';
      } else if (this.state.date === '') {
        warning = 'Please select Date';
      }
      toast.warn(warning, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }


  getDisplayModeButton = () => {
    let list = displayModeList;
    return <DropdownButton
      pullRight
      bsSize="xsmall"
      title={list.filter(item => item.mode === this.state.displayMode)[0].name}
      id="display-mode-dd"
      className={"mr-20"}

    > {list.map((item) =>
      <MenuItem eventKey={item.mode} key={item.mode} onSelect={() => this.setState({ displayMode: item.mode })}>{item.name}</MenuItem>)

      }
    </DropdownButton>
  }

  handleExport = () => {
    if (this.state.companyName != '' && this.state.deviceName != '' && this.state.date != '') {
      let obj = { ...this.state } as any;
      obj.days = 7;
      obj.emailId = this.props.userInfo.userId;
      this.props.exportUsageReport(obj);

    } else {
      let warning = "Please select required parameters to export data";
      toast.warn(warning, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }

  }

  render() {
    console.log(this.state, this.props.devices);
    var filteredDevices = this.state.companyId != -1 ? this.props.devices ? this.props.devices.filter((device:any, index:any) => device.customerId === this.state.companyId) : [] : [];
    console.log(filteredDevices, "Usage Report");
    
    return (
      <div className="content">
        <Grid fluid>

          <Row>
            <Col md={12}>
              <Card
                id="chartActivity"
                title={<div><h5>Device Usage </h5></div>}
                content={
                  <div>
                    <Row >
                      <form onSubmit={this.handleSubmit}>
                        <Col md={3} xs={6} className="custom-dropdown">
                          <DropdownToolTip
                            title={this.state.companyName !== '' ? this.state.companyName : 'Select User'}
                            disabled={this.props.isFetchingUsageReport}
                            id={`split-button-pull-right-usagereport-user`}
                            className={"dropdown-80 text-cut"}
                            list={this.props.companies}
                            onSelectOption={this.onSelectCompany}
                            tooltipID={'reports-usagereport-user'}
                            label={'User'}
                            direction={"bottom"}
                            required={true}
                            menuItemIdkey={'id'}
                            menuItemIdName={'name'}
                          // defaultOption={''}
                          >

                          </DropdownToolTip>
                        </Col>
                        <Col md={3} xs={6} className="custom-dropdown">
                           <DropdownToolTip
                            title={this.state.deviceName !== '' ? this.state.deviceName : 'Select Device'}
                            disabled={this.props.isFetchingUsageReport}
                            id={`split-button-pull-right-usagereport-device`}
                            className={"dropdown-80 text-cut"}
                            list={filteredDevices}
                            onSelectOption={this.onSelectDevice}
                            tooltipID={'reports-usagereport-device'}
                            label={'Device'}
                            direction={"bottom"}
                            required={true}
                            menuItemIdkey={'id'}
                            menuItemIdName={'name'}
                            defaultOption={this.state.companyName===''?'Select Company':'No Devices'}
                          >
                          </DropdownToolTip>
                        </Col>
                        <Col md={2} xs={12} className="">
                          <FormGroup>
                            <ControlLabel>Select Date<span className="error">*</span></ControlLabel>
                            <FormControl type="date" value={this.state.date} onChange={(e) => this.handleInputChange(e)} placeholder='Select date' />
                          </FormGroup>
                        </Col>
                        <span className="float-right">
                        {this.props.componentPermissions.canExport ? <Col md={2} xs={6}className="viewReportButton marg-top">
                          <Button fill className="buttonColor" id="exportToExcel" onClick={() => this.handleExport()} disabled={this.isReportButtonDisabled() || this.props.isFetchingUsageReport ? true : false}>
                            Export Data
                            </Button>
                        </Col> : ''}
                        </span>
                        <span className="float-right">
                        <Col md={2} xs={6} className="viewReportButton marg-top">
                          <Button fill className="buttonColor" type="submit" disabled={this.isReportButtonDisabled() || this.props.isFetchingUsageReport ? true : false}>
                            <i className="fa fa-search searchIcon"></i>View Report
                            </Button>
                        </Col>
                        </span>
                        
                        

                      </form>
                    </Row>
                    <Row>
                      <Col>
                        <div>
                          {this.state.usageReport !== null && this.state.displayMode == 1 ?
                            <div className="graphical-report">
                              <Chart
                                options={UsageApexData(this.props.usageReport).options}
                                series={UsageApexData(this.props.usageReport).series}
                                type="area"
                                height={300}

                              />
                            </div> : this.state.displayMode == 0 ? <div className="usageReportDiv">Feature Coming Soon. Please visit later</div> :
                              this.props.isFetchingUsageReport === true ? <LoaderComponent /> : <div className="usageReportDiv">{'Select Company, Device & Date to see report'}</div>}
                        </div>
                      </Col>
                    </Row>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  usageReport: state.Report ? state.Report.usageReport : null,
  isLoading: state.User ? state.User.isLoading : false,
  userInfo: state.User ? state.User.UserInfo : null,
  companies: state.Company ? state.Company.CompaniesList : [], //companies dropdown list
  devices: state.Device ? state.Device.deviceList : [], // device dropdown list
  isFetchingUsageReport: state.Report ? state.Report.isFetchingUsageReport : false,
  getUsageReportStatus: state.Alerts ? state.Alerts.getUsageReportStatus : 'not Assigned',
  permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {},
})

const mapDispatchToProps = {
  GetUsageReport: reportActions.GetUsageReport,
  getAllCompanies: companyActions.getCompanyList,
  getDevices: deviceActions.getDevicesList,
  exportUsageReport: reportActions.exportUsageReport,
  clearReportData: reportActions.clearReportData,

}

export default connect(mapStateToProps, mapDispatchToProps)(UsageReport);
