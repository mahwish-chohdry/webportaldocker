import React from "react";
import {
    Grid,
    Row,
    Col,
    SplitButton,
    MenuItem,
    Modal,
    FormGroup,
    ControlLabel,
    FormControl,
    Tabs,
    Tab,
    Badge,
    Alert,
    Nav,
    NavItem,
    DropdownButton,

} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { toast } from 'react-toastify';
import { ICompany, IErrorCode, IAlarmWarningReportState, IAlarmWarningReportProps, IReportFilters, IUserPermissions, IDeviceBatchProps } from 'Interface';
import { RootState } from "reducers";
import { connect } from "react-redux";
import * as companyActions from 'action/company';
import * as deviceActions from 'action/device';
import * as reportActions from 'action/reports';
import { LoaderComponent } from "components/Loader";
import "assets/css/fileUploader.css";
import ReactTable from "react-table";
import moment from 'moment';
import Collapsible from 'react-collapsible';
import { filterCaseInsensitive, isPermittedComponent, arrayUnion, getDefaultCustomer } from 'utils';
import { AlarmsWarningApexData } from 'utils/ReportChartData';
import Pagination from "utils/Pagination";
import PageSizeSelector from "utils/PageSizeSelector";
import { reportNames, NOT_ALLOWED } from 'constants/index';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { displayModeList } from 'utils/index';
import { dashboardRoutes } from "constants/routes";
import Chart from "react-apexcharts";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip.jsx";

class AlarmWarningReport extends React.Component<IAlarmWarningReportProps, IAlarmWarningReportState> {
    constructor(props: any) {
        super(props);
        let userObj = getDefaultCustomer(this.props.userInfo, this.props.companies);
        this.state = {
            selectedFilters: {
                user: {
                    id: userObj.id,
                    name: userObj.name,
                    selectedCustomerId: userObj.customerId
                },
                device: { id: -1, name: '' },
                batch: '',
                date: '',
                //date: new Date(Date.now()).getDate() + '/' +new Date(Date.now()).getMonth()+1 + '/' + new Date(Date.now()).getUTCFullYear(), // to get date in dd/mm/yyyy format
            } as IReportFilters,
            selectedHistoryType: 'Alarm',
            alarmReportData: [],
            isDisabled: true,
            errorOccurrence: [],
            isExpanded: false,
            sort: [],
            pageSize: 5,
            displayMode: 0,


        };
    }
    isReportButtonDisabled = () => {
        const { device, user, batch, date } = this.state.selectedFilters;
        return device.id === -1 || user.id === -1 || batch === '' || date === null || date === '';
    }


    componentWillUnmount() {
        this.props.clearAlarmReportData(reportNames.ALARM_REPORT);
    }


    componentWillMount() {
        if (!isPermittedComponent(dashboardRoutes, this.props.permissions, this.props.location.pathname)) {
            this.props.history.push(NOT_ALLOWED);
        }

        if (this.props.companies && this.props.companies.length === 0) {
            this.props.getAllCompanies();
        }
        if (this.props.devices && this.props.devices.length === 0) {
            this.props.getDevices();
        }
        if (this.props.devicesBatchList && this.props.devicesBatchList.length === 0) {
            this.props.getDeviceBatchList();
        }
        if (this.props.errorCodesList && this.props.errorCodesList.length === 0) {
            this.props.getErrorCodesList();
        }

    }


    componentWillReceiveProps(nextProps: any) {
        if (nextProps.alarmReportData.length >= 0) {

            if (this.props.errorCodesList && this.props.errorCodesList.length >= 0) {
                let errorOccurrence = [] as any;

                errorOccurrence = this.props.errorCodesList.map((item: any) => {
                    return { 'code': item.code, 'count': 0 };
                })


                // taking union because with same code there are two results (2 languages)
                errorOccurrence = arrayUnion(errorOccurrence, errorOccurrence, (g1: any, g2: any) => {
                    return g1.code === g2.code;
                });
                errorOccurrence = errorOccurrence.map((element: any) => {
                    let arr = nextProps.alarmReportData.filter((item: any) => item.code === element.code);

                    element.count = arr.length;
                    return element;
                }).filter((item: any) => item.count > 0).sort(function (prev: any, curr: any) {
                    if (prev.count > curr.count) {
                        return -1;
                    }
                    if (curr.count > prev.count) {
                        return 1;
                    }
                    return 0;
                }).slice(0, 3);

                this.setState({ errorOccurrence, alarmReportData: nextProps.alarmReportData })
            }
        }

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
        let isDisabled = s_date === null && batch === '' && device.id === -1 && user.id === -1;
        this.setState({ selectedFilters, isDisabled });
    };


    getUserSpecificDevices = (customerId: any) => {
        if (this.props.devices) {
            return this.props.devices.filter((device: any) => {
                return device.customerId === customerId
            })
        }

    }


    getAlarmWarningTable = (data: any[]) => {
        let filtered = data as any[];
        const customPagination = (props: any) => { return <Pagination {...props} totalCount={this.state.alarmReportData ? this.state.alarmReportData.length : 0}></Pagination> }
        return <div className="content">


            <ReactTable
                noDataText={"No Data Available"}
                minRows={filtered && filtered.length > 0 ? 0 : 5}
                defaultPageSize={5}
                PaginationComponent={customPagination}
                SubComponent={(row: any) => {
                    return (
                        <Row>
                            <Col md={12} xs={16}>
                                <div className="errorCodeDetails">
                                    <div className="">
                                        <Col md={2} xs={4}><Badge className="badge-custom "> <span>Register Parameter </span></Badge></Col>


                                        <Col className="ml-3" md={10} xs={12}><span>{row.original.code}</span></Col>
                                    </div>
                                    <div className="" >
                                        <Col md={2} xs={4}><Badge className="badge-custom "> <span>Register Number </span></Badge></Col>
                                        <Col className="ml-3" md={10} xs={12}><span>{row.original.registerNumber}</span></Col>
                                    </div>
                                    <div className="">
                                        <Col md={2} xs={4}><Badge className="badge-custom "> <span>Reason Analysis </span></Badge></Col>
                                        <Col className="ml-3 reason-content" md={10} xs={12}><span>{row.original.reasonAnalysis}</span></Col>
                                    </div>
                                </div>
                            </Col>

                        </Row>

                    )
                }}
                columns={[

                    {
                        expander: true,
                        Expander: ({ isExpanded, ...rest }) => {
                            return (
                                <div>
                                    {isExpanded
                                        ? <span><i className="fa fa-angle-down fa-xs"></i></span>
                                        : <span><i className="fa fa-angle-right fa-xs"></i></span>
                                    }
                                </div>
                            );

                        }
                    },
                    {
                        Header: () => (
                            <span className='sortable'>Device Name
                            </span>
                        ),
                        accessor: 'deviceName',
                        minWidth: 150

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Device Id
                            </span>
                        ),
                        accessor: 'deviceId',
                        minWidth: 150

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Type
                            </span>
                        ),
                        accessor: 'type',
                        minWidth: 100

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Error Date
                            </span>
                        ),
                        id: 'timestamp',
                        minWidth: 150,
                        accessor: (d: any) => {
                            /* convert to timestamp */
                            let timestamp = '';

                            if (d.timestamp != null) {
                                timestamp = moment(d.timestamp).format('x');
                            }
                            return timestamp;
                        },
                        Cell: (row: any) => {
                            //
                            // convert timestamp again to date for display
                            if (!row.original.timestamp) return '';
                            let displayString = moment(row.original.timestamp).format('MM/DD/YYYY');
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
                    }
                ]}
                data={filtered}
                showPagination={true}
                pageSize={this.state.pageSize}
                filterable={true}
                sorted={this.state.sort}
                onSortedChange={this.handleSort}
                defaultFilterMethod={filterCaseInsensitive}
                className="-highlight" /></div>

    }


    getReportFilters = () => {
        let filteredDevices = this.getUserSpecificDevices(this.state.selectedFilters.user.id);
        filteredDevices = filteredDevices ? filteredDevices : [];


        return <Row id="">
            <Col md={3} className="remove-padding custom-dropdown">
                <DropdownToolTip
                    title={this.state.selectedFilters.user.name !== '' ? this.state.selectedFilters.user.name : 'Select User'}
                    disabled={false}
                    id={`split-button-pull-right-alarmwarningreport-user`}
                    className={"dropdown-80 text-cut"}
                    list={this.props.companies}
                    onSelectOption={this.onSelectCompany}
                    tooltipID={'reports-alarmwarningreport-user'}
                    label={'User'}
                    direction={"bottom"}
                    required={true}
                    menuItemIdkey={'id'}
                    menuItemIdName={'name'}
                // defaultOption={''}
                />

            </Col>
            <Col md={3} className=" remove-padding pull-left custom-dropdown">
                <DropdownToolTip
                    title={this.state.selectedFilters.batch !== '' ? this.state.selectedFilters.batch : 'Select Batch'}
                    disabled={false}
                    id={`split-button-pull-right-alarmwarningreport-batch`}
                    className={"dropdown-80 text-cut"}
                    list={this.props.devicesBatchList}
                    onSelectOption={this.onSelectDeviceBatch}
                    tooltipID={'reports-alarmwarningreport-batch'}
                    label={'Device Batch'}
                    direction={"bottom"}
                    required={true}
                    menuItemIdkey={'batchId'}
                    menuItemIdName={'batchId'}
                // defaultOption={''}
                />
            </Col>
            <Col md={3} className=" remove-padding pull-left custom-dropdown">
                <DropdownToolTip
                    title={this.state.selectedFilters.device.name !== '' ? this.state.selectedFilters.device.name : 'Select Device'}
                    disabled={false}
                    id={`split-button-alarmwarningreport-device`}
                    className={"dropdown-80 text-cut"}
                    list={filteredDevices}
                    onSelectOption={this.onSelectDevice}
                    tooltipID={'reports-alarmwarningreport-device'}
                    label={'Device'}
                    direction={"bottom"}
                    required={true}
                    menuItemIdkey={'id'}
                    menuItemIdName={'name'}
                    defaultOption={this.state.selectedFilters.user.name === '' ? 'Select Company' : 'No Devices'}
                />
            </Col>
            <Col md={3} className="remove-padding custom-dropdown">
                <div>
                    <FormGroup>
                        <ControlLabel>Select Date<span className="error">*</span></ControlLabel>
                        <FormControl type="date" value={this.state.selectedFilters.date} onChange={(e) => this.handleDateChange(e)} placeholder='Select date' />
                    </FormGroup>
                </div>
            </Col>
            <Col md={12} xs={12} className="float-right">
                <div id="secondRow">
                    <Button disabled={this.isReportButtonDisabled() || this.props.isGettingAlarmsReport ? true : false} bsStyle="warning" className="float-right report-btn" onClick={() => this.getReportData()}>
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
            date: this.state.selectedFilters.date === '' ? null :this.state.selectedFilters.date
        };

        if (data.customerId != -1 || data.date !='') {

            this.props.getAlarmAndWarningReport(data)

        }
        else {
            toast.warn("Please select required filter to generate report", { position: toast.POSITION.BOTTOM_RIGHT })
        }

    }




    displayData = (data: any[]) => {
        return <Row>
            <Col id="awreport">
                {this.getAlarmWarningTable(data)}
            </Col>
        </Row>
    }



    onSelectFilter = (type: any) => {
        this.setState({ selectedHistoryType: type });
    }



    getCodeObj = (code: string) => {
        let obj = this.props.errorCodesList && this.props.errorCodesList.filter((item: any) => item.code === code);
        if (obj && obj.length)
            return obj[0];

        return null;
    }


    retreiveTopAlarms = () => {

        let errorOccurence = this.state.errorOccurrence;
        if (errorOccurence) {
            errorOccurence = errorOccurence.map((element: any) => {
                let arr = this.state.alarmReportData.filter((item: any) => item.code === element.code);

                element.count = arr.length;
                return element;
            }).filter((item: any) => item.count > 0)
                .sort(function (prev: any, curr: any) {
                    if (prev.count > curr.count) {
                        return -1;
                    }
                    if (curr.count > prev.count) {
                        return 1;
                    }
                    return 0;
                }).slice(0, 3).map((item: any) => {
                    let obj = this.getCodeObj(item.code) as any;
                    obj.occurence = item.count;

                    return obj;
                });

            return errorOccurence;
        }
        else
            return [];

    }

    getCollapsibleHeader = () => {
        return <div>
            <h6 className="clickable collapsible-header">Most Occurred Alarms & Warnings {this.state.isExpanded
                ? <span><i className="fa fa-angle-down fa-xs"></i></span>
                : <span><i className="fa fa-angle-right fa-xs"></i></span>}</h6>
        </div>

    }


    handlePageSize = (newPageSize: number) => {
        this.setState({ pageSize: newPageSize })
    }



    getDisplayModeButton = () => {
        let list = displayModeList;
        return <DropdownButton
            pullRight
            bsSize="xsmall"
            title={list.filter(item => item.mode === this.state.displayMode)[0].name}
            id="display-mode-dd"
            // className={"mr-20"}

        > {list.map((item: any) =>
            <MenuItem eventKey={item.mode} key={item.mode} onSelect={() => this.setState({ displayMode: item.mode })}>{item.name}</MenuItem>)

            }
        </DropdownButton>
    }

    render() {
        let warningsData = this.state.alarmReportData ? this.state.alarmReportData.filter((item: any) => item.type === "Warning") : [];
        let alarmData = this.state.alarmReportData ? this.state.alarmReportData.filter((item: any) => item.type === "Alarm") : [];
        let alarmsWarningsList = this.retreiveTopAlarms();
        return (
            <div className="content">
                <div>

                </div>
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={<div><h5>Device Alarms & Warnings  <span className="float-right">{this.getDisplayModeButton()}</span></h5></div>}
                                content={
                                    <div>

                                        <div>{this.getReportFilters()}</div>
                                        {this.props.isGettingAlarmsReport ? <LoaderComponent /> :
                                            this.state.alarmReportData && this.state.alarmReportData.length === 0 ? <div className="alarmReportDiv no-data">Select Filters to Generate Report</div> :
                                                this.state.displayMode === 1 ? <div>{this.AlarmWarningSection()}</div> :

                                                    <div className="alarmReportDiv">

                                                        <div>
                                                            <Collapsible trigger={this.getCollapsibleHeader()} onOpening={() => { this.setState({ isExpanded: true }) }} onClosing={() => { this.setState({ isExpanded: false }) }}>

                                                                <div className="collap-content">
                                                                    {alarmsWarningsList.map((item: any) => {
                                                                        return <div><i className={item.type === "Alarm" ? " fa fa-circle red-text" : " fa fa-circle yellow-text"}></i>{`${item.description} (${item.occurence})`}</div>;
                                                                    })

                                                                    }

                                                                </div>


                                                            </Collapsible>


                                                        </div>
                                                        <Tab.Container
                                                            id="alarm-warning-report"
                                                            activeKey={this.state.selectedHistoryType}
                                                            onSelect={(k: any) => this.onSelectFilter(k)}


                                                        >
                                                            <Row className="clearfix">
                                                                <Col sm={12}>
                                                                    <Nav bsStyle="tabs">
                                                                        <NavItem eventKey="Alarm">Alarms <Badge>{alarmData.length}</Badge></NavItem>
                                                                        <NavItem eventKey="Warning">Warnings  <Badge>{warningsData.length}</Badge></NavItem>
                                                                        <PageSizeSelector classNames={"float-right-2"} changePageSize={this.handlePageSize} selectedPage={this.state.pageSize} />

                                                                    </Nav>
                                                                </Col>
                                                                <Col sm={12}>
                                                                    <Tab.Content animation={false}>
                                                                        <Tab.Pane eventKey="Alarm">{this.displayData(alarmData)}</Tab.Pane>
                                                                        <Tab.Pane eventKey="Warning">{this.displayData(warningsData)}</Tab.Pane>

                                                                    </Tab.Content>
                                                                </Col>

                                                            </Row>
                                                        </Tab.Container>


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

    AlarmWarningSection = () => {
        let arr = this.props.alarmReportData ? this.props.alarmReportData : [];
        let AlarmsOccurenceData = AlarmsWarningApexData(arr);
        return <div className="graphical-report">  <div >
            <Chart
                options={AlarmsOccurenceData.options}
                series={AlarmsOccurenceData.series}
                height={300}
            />
        </div></div>

    }


}

const mapStateToProps = (state: RootState) => ({
    companies: state.Company ? state.Company.CompaniesList : [] as any[],
    devicesBatchList: state.Device && state.Device.devicesBatchList ? state.Device.devicesBatchList : [] as any[],
    devices: state.Device && state.Device.deviceList ? state.Device.deviceList : [],
    alarmReportData: state.Report && state.Report.alarmReportData ? state.Report.alarmReportData : [] as any[],
    isGettingAlarmsReport: state.Report ? state.Report.isGettingAlarmsReport : false,
    errorCodesList: state.Device && state.Device.errorCodes ? state.Device.errorCodes : [] as IErrorCode[],
    isGettingErrorCode: state.Report && state.Device.isGettingErrorCode ? state.Device.isGettingErrorCode : false,
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions,
    userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null

})
const mapDispatchToProps = {
    getAllCompanies: companyActions.getCompanyList,
    getDeviceBatchList: deviceActions.getDeviceBatchList,
    getDevices: deviceActions.getDevicesList,
    getAlarmAndWarningReport: reportActions.getAlarmAndWarningReport,
    getErrorCodesList: deviceActions.getAllErrorCodes,
    clearAlarmReportData: reportActions.clearReportData,

}


export default connect(mapStateToProps, mapDispatchToProps)(AlarmWarningReport);
