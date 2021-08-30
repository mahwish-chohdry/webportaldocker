import React from "react";
import {
    Grid,
    Row,
    Col,
    MenuItem,
    FormGroup,
    ControlLabel,
    DropdownButton,
    FormControl,
} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Collapsible from 'react-collapsible';
import { ICompany, IErrorCode, IMaintainenceReportState, IMaintainenceReportProps, IUserPermissions } from 'Interface';
import { RootState } from "reducers";
import { connect } from "react-redux";
import * as companyActions from 'action/company';
import * as deviceActions from 'action/device';
import * as reportActions from 'action/reports';
import { LoaderComponent } from "components/Loader";
import "assets/css/fileUploader.css";
import ReactTable from "react-table";
import Pagination from "utils/Pagination";
import PageSizeSelector from "utils/PageSizeSelector";
import { filterCaseInsensitive, displayModeList, isPermittedComponent, getDefaultCustomer } from 'utils';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { reportNames, NOT_ALLOWED } from "constants/index";
import { dashboardRoutes } from "constants/routes";
import {  MaintainenanceGraphicalApexReport } from "utils/ReportChartData";
import Chart from "react-apexcharts";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip.jsx";
class PredictivePreventiveReport extends React.Component<IMaintainenceReportProps, IMaintainenceReportState> {
    constructor(props: any) {
        super(props);
        let userObj = getDefaultCustomer(this.props.userInfo, this.props.companies);
        this.state = {
            selectedFilters: {
                user: {
                    id: userObj.id, name: userObj.name,
                    selectedCustomerId: userObj.customerId
                },
                device: { id: null, name: '' },
                batch: '',
                date: '',
            },
            maintenanceReportData: [],
            isDisabled: true,
            isExpanded: false,
            pageSize: 5,
            sort: [],
            displayMode: 0


        };
    }

    isReportButtonDisabled = () => {
        const { device, user, batch, date } = this.state.selectedFilters;
        return device.id === -1 || user.id === -1 || batch === '' || date === '';
    }

    componentWillUnmount() {
        this.props.clearMaintenanceReport(reportNames.MAINTENANCE_REPORT);
    }

    componentWillMount() {

        if (this.props.companies && this.props.companies.length === 0) {
            this.props.getAllCompanies();
        }
        if (this.props.devicesBatchList && this.props.devicesBatchList.length === 0) {
            this.props.getDeviceBatchList();
        }
        if (this.props.devices && this.props.devices.length === 0) {
            this.props.getDevices();
        }
    }

    componentWillReceiveProps(nextProps: any) {

        if (nextProps.maintenanceReportData && nextProps.maintenanceReportData.length >= 0)
            this.setState({ maintenanceReportData: nextProps.maintenanceReportData })
    }


    onSelectCompany = (company: any) => {
        let { selectedFilters } = this.state;
        selectedFilters.user.id = company.id;
        selectedFilters.user.name = company.name;
        selectedFilters.user.selectedCustomerId = company.customerId;
        selectedFilters.device.id = -1;
        selectedFilters.device.name = 'Select Device';
        this.setState({ selectedFilters, isDisabled: false });
    }



    onSelectDeviceBatch = (batch: any) => {
        let selectedId = batch.batchId;
        let { selectedFilters } = this.state;
        selectedFilters.batch = selectedId;
        this.setState({ selectedFilters });
    }



    onSelectDevice = (device: any) => {
        let selectedId = device.deviceId;
        let selectedName = device.name;
        let { selectedFilters } = this.state;
        selectedFilters.device.id = selectedId;
        selectedFilters.device.name = selectedName;
        this.setState({ selectedFilters });
    }



    handleDateChange = (s_date: any) => {
        let { selectedFilters } = this.state;
        let { batch, date, device, user } = selectedFilters;
        selectedFilters.date = s_date.currentTarget.value;
        let isDisabled = s_date === null && batch === '' && device.id === null && user.id === -1;
        this.setState({ selectedFilters, isDisabled });
    };


    getUserSpecificDevices = (customerId: any) => {
        return this.props.devices.filter((device: any) => {
            return device.customerId === customerId
        })
    }

    handlePageSize = (newPageSize: number) => {
        this.setState({ pageSize: newPageSize })
    }

    getMaintenanceDataTable = () => {
        return <div className="content">

            <ReactTable
                noDataText={"No Data Available"}
                minRows={this.state.maintenanceReportData && this.state.maintenanceReportData.length > 0 ? 0 : 5}
                defaultPageSize={5}
                PaginationComponent={Pagination}
                columns={[
                    {
                        Header: () => (
                            <span className='sortable'>Device Name
                            </span>
                        ),
                        accessor: 'deviceName',
                        minWidth: 130

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Device Id
                            </span>
                        ),
                        accessor: 'deviceId',
                        minWidth: 130

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Device Status
                            </span>
                        ),
                        accessor: 'deviceStatus',
                        minWidth: 130

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Usage Hours
                            </span>
                        ),
                        accessor: 'runningHours',
                        minWidth: 130

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Last Maintenance
                            </span>
                        ),
                        id: 'lastMaintenanceDate',
                        minWidth: 150,
                        accessor: (d: any) => {
                            /* convert to timestamp */
                            let timestamp = '';

                            if (d.lastMaintenanceDate != null) {
                                timestamp = moment(d.lastMaintenanceDate).format('x');
                            }
                            return timestamp;
                        },
                        Cell: (row: any) => {
                            //
                            // convert timestamp again to date for display
                            if (!row.original.lastMaintenanceDate) return '';
                            let displayString = moment(row.original.lastMaintenanceDate).format('MM/DD/YYYY');
                            return displayString;
                        },
                        defaultSortDesc: true,
                        filterMethod: (data: any, row: any, col: any) => {
                            if (moment(data.value).isValid()) {
                                let timestamp1 = moment(data.value).format('x');
                                let timestamp2 = moment(row._original.lastMaintenanceDate).format('L');
                                timestamp2 = moment(timestamp2).format('x');

                                if (timestamp1 === timestamp2)
                                    return true;
                            }
                            return false;
                        }
                    },
                    {
                        Header: () => (
                            <span className='sortable'>Expected Maintenance
                            </span>
                        ),
                        id: 'expectedMaintenanceDate',
                        minWidth: 150,
                        accessor: (d: any) => {
                            /* convert to timestamp */
                            let timestamp = '';

                            if (d.expectedMaintenanceDate != null) {
                                timestamp = moment(d.expectedMaintenanceDate).format('x');
                            }
                            return timestamp;
                        },
                        Cell: (row: any) => {
                            //
                            // convert timestamp again to date for display
                            if (!row.original.expectedMaintenanceDate) return '';
                            let displayString = moment(row.original.expectedMaintenanceDate).format('MM/DD/YYYY');
                            return displayString;
                        },
                        defaultSortDesc: true,
                        filterMethod: (data: any, row: any, col: any) => {
                            if (moment(data.value).isValid()) {
                                let timestamp1 = moment(data.value).format('x');
                                let timestamp2 = moment(row._original.expectedMaintenanceDate).format('L');
                                timestamp2 = moment(timestamp2).format('x');

                                if (timestamp1 === timestamp2)
                                    return true;
                            }
                            return false;
                        }
                    },
                ]}
                data={this.state.maintenanceReportData}
                showPagination={true}
                filterable={true}
                sorted={this.state.sort}
                onSortedChange={this.handleSort}
                defaultFilterMethod={filterCaseInsensitive}
                pageSize={this.state.pageSize}
                className="-highlight" /></div>
    }

    handleSort = (column: any) => {
        let sort: any[] = this.state.sort;
        if (sort && sort.length > 0) {
            let index = sort.findIndex((item: any) => item.id === column[0].id)
            if (index !== -1) {
                if (!sort[index].desc) {
                    sort = sort.filter(filterColumn => filterColumn.id !== column[0].id);
                    sort.push({
                        id: column[0].id,
                        desc: true
                    });
                } else {
                    sort = sort.filter(filterColumn => filterColumn.id !== column[0].id);
                }
            } else {
                sort.push({
                    id: column[0].id,
                    desc: false
                });
            }
        } else {
            sort.push({
                id: column[0].id,
                desc: false
            });
        }
        this.setState({
            sort: sort
        });
    }

    getReportFilters = () => {
        let filteredDevices = this.getUserSpecificDevices(this.state.selectedFilters.user.id);
        return <Row>
            <Col md={3} className="remove-padding custom-dropdown">
                <DropdownToolTip
                    title={this.state.selectedFilters.user.name !== '' ? this.state.selectedFilters.user.name : 'Select User'}
                    disabled={false}
                    id={`split-button-pull-right-maintenancereport-user`}
                    className={"dropdown-80 text-cut"}
                    list={this.props.companies}
                    onSelectOption={this.onSelectCompany}
                    tooltipID={'reports-maintenancereport-user'}
                    label={'User'}
                    direction={"bottom"}
                    required={true}
                    menuItemIdkey={'id'}
                    menuItemIdName={'name'}
                // defaultOption={''}
                />
            </Col>
            <Col md={3} className=" remove-padding custom-dropdown">
                <DropdownToolTip
                    title={this.state.selectedFilters.batch !== '' ? this.state.selectedFilters.batch : 'Select Batch'}
                    disabled={false}
                    id={`split-button-pull-right-maintenancereport-batch`}
                    className={"dropdown-80 text-cut"}
                    list={this.props.devicesBatchList}
                    onSelectOption={this.onSelectDeviceBatch}
                    tooltipID={'reports-maintenancereport-batch'}
                    label={'Device Batch'}
                    direction={"bottom"}
                    required={true}
                    menuItemIdkey={'batchId'}
                    menuItemIdName={'batchId'}
                // defaultOption={''}
                />

            </Col>
            <Col md={3} className=" remove-padding custom-dropdown">
                <DropdownToolTip
                    title={this.state.selectedFilters.device.name !== '' ? this.state.selectedFilters.device.name : 'Select Device'}
                    disabled={false}
                    id={`split-button-maintenancereport-device`}
                    className={"dropdown-80 text-cut"}
                    list={filteredDevices}
                    onSelectOption={this.onSelectDevice}
                    tooltipID={'reports-maintenancereport-device'}
                    label={'Device'}
                    direction={"bottom"}
                    required={true}
                    menuItemIdkey={'id'}
                    menuItemIdName={'name'}
                    defaultOption={this.state.selectedFilters.user.name === '' ? 'Select Company' : 'No Devices'}
                />
            </Col>
            <Col md={3} className="custom-dropdown remove-padding">
                <div>
                    <FormGroup>
                        <ControlLabel>Select Date<span className="error">*</span></ControlLabel>
                        <FormControl type="date" value={this.state.selectedFilters.date} onChange={(e) => this.handleDateChange(e)} placeholder='Select date' />
                    </FormGroup>
                </div>

            </Col>
            <Col md={12} xs={12}  className="float-right">
                <div id="secondRow">
                    <Button bsStyle="warning" className="float-right report-btn" onClick={() => this.getReportData()} disabled={this.isReportButtonDisabled()}>
                        <i className="fa fa-search searchIcon"></i>View Report</Button>
                </div>

            </Col>
        </Row>

    }

    getReportData = () => {
        let data = {} as any;
        data = {
            customerId: this.state.selectedFilters.user.id === -1 ? null : this.state.selectedFilters.user.selectedCustomerId,
            deviceId: this.state.selectedFilters.device.id === -1 ? null : this.state.selectedFilters.device.id,
            batchId: this.state.selectedFilters.batch === '' ? null : this.state.selectedFilters.batch,
            date: this.state.selectedFilters.date === null ? null : this.state.selectedFilters.date,
        };
     
        this.props.getMaintenanceReport(data)
    }


    displayData = () => {
        return <Row>
            <Col>
                {this.getMaintenanceDataTable()}
            </Col>
        </Row>
    }

    // getSummaryReport = () => {
    //     var maintenanceReportData = this.state.maintenanceReportData;
    //     if(maintenanceReportData && maintenanceReportData.length !== 0){
    //         let arr = maintenanceReportData.filter((item: any) => moment(item.expectedMaintenanceDate).format('YYYY-MM-DD') === this.state.selectedFilters.date);
    //          
    //         return arr.length;
    //     } else {
    //         return null;
    //     }

    // }
    getCollapsibleHeader = () => {
        return <div>
            <h6 className="clickable collapsible-header">Devices to be maintained {this.state.isExpanded
                ? <span><i className="fa fa-angle-down fa-xs"></i></span>
                : <span><i className="fa fa-angle-right fa-xs"></i></span>}</h6>
        </div>

    }

    getDisplayModeButton = () => {
        let list = displayModeList;
        return <DropdownButton
            pullRight
            bsSize="xsmall"
            title={list.filter(item => item.mode === this.state.displayMode)[0].name}
            id="display-mode-dd"
            className={"mr-20"}

        > {list.map((item: any) =>
            <MenuItem eventKey={item.mode} key={item.mode} onSelect={() => this.setState({ displayMode: item.mode })}>{item.name}</MenuItem>)

            }
        </DropdownButton>
    }

    render() {
        // let summary = this.getSummaryReport();
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={<div><h5>Device Maintenance  <span className="float-right">{this.getDisplayModeButton()}</span></h5></div>}
                                content={
                                    <div>
                                        <div>{this.getReportFilters()}</div>
                                        <div>
                                            {/* {summary && summary !== 0? 
                                                <Collapsible trigger={this.getCollapsibleHeader()} onOpening={()=>{this.setState({isExpanded:true})}} onClosing={()=>{this.setState({isExpanded:false})}}>
                                                    <div className="collap-content">
                                                        <p><Badge className='summaryBadge'>{summary}</Badge>Devices need to be maintained by {this.state.selectedFilters.date}</p>
                                                    </div>
                                                </Collapsible>:''
                                            } */}
                                        </div>
                                        {this.props.isGettingMaintenanceReport ? <LoaderComponent /> :
                                            this.state.maintenanceReportData && this.state.maintenanceReportData.length == 0 ? <div className="alarmReportDiv no-data">Select Filters to Generate Report</div> :
                                                this.state.displayMode == 1 ?
                                                    <div className="alarmReportDiv">{this.maintenanceGraphicalSection()}</div> :
                                                    <div>
                                                        <Row> <PageSizeSelector classNames={"float-right-2 mr-20"} changePageSize={this.handlePageSize} selectedPage={this.state.pageSize} /></Row>
                                                        <div>{this.displayData()}</div>
                                                    </div>
                                        }

                                    </div>

                                }
                            />
                        </Col>
                    </Row>

                </Grid>
            </div>
        );
    }

    /**_________________ GRAPHICAL MODE _______________________ */

    maintenanceGraphicalSection = () => {
        let arr = this.props.maintenanceReportData ? this.props.maintenanceReportData : [];
        let maintenanceData = MaintainenanceGraphicalApexReport(arr);

   
        return <div className="graphical-report">  <div >
            <Chart
                options={maintenanceData.options}
                series={maintenanceData.series}
                height={300}
                type='bar'
            />
        </div></div>
    }
}


const mapStateToProps = (state: RootState) => ({
    companies: state.Company ? state.Company.CompaniesList : [] as any[],
    devicesBatchList: state.Device && state.Device.devicesBatchList ? state.Device.devicesBatchList : [] as any[],
    devices: state.Device && state.Device.deviceList ? state.Device.deviceList : [],
    maintenanceReportData: state.Report && state.Report.maintenanceReportData ? state.Report.maintenanceReportData : [] as any[],
    isGettingMaintenanceReport: state.Report ? state.Report.isGettingMaintenanceReport : false,
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions,
    userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null
})



const mapDispatchToProps = {
    getAllCompanies: companyActions.getCompanyList,
    getDeviceBatchList: deviceActions.getDeviceBatchList,
    getDevices: deviceActions.getDevicesList,
    getMaintenanceReport: reportActions.getMaintenanceReport,
    clearMaintenanceReport: reportActions.clearReportData
}


export default connect(mapStateToProps, mapDispatchToProps)(PredictivePreventiveReport);
