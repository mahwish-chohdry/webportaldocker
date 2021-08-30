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
import { ICompany, IReportFilters, IEnergyReportProps, IEnergyReportState, IUserPermissions } from 'Interface';
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
import { filterCaseInsensitive, displayModeList, isPermittedComponent, getDefaultCustomer } from 'utils';
import Pagination from "utils/Pagination";
import PageSizeSelector from "utils/PageSizeSelector";
import { reportNames, NOT_ALLOWED } from 'constants/index';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dashboardRoutes } from "constants/routes";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip.jsx";

class EnergyConsumptionReport extends React.Component<IEnergyReportProps, IEnergyReportState> {
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
    //            date: new Date(Date.now()).getDate() + '/' +new Date(Date.now()).getMonth()+1 + '/' + new Date(Date.now()).getUTCFullYear(), // to get date in dd/mm/yyyy format
            } as IReportFilters,
            reportData: [],
            isDisabled: true,
            isExpanded: false,
            sort: [],
            pageSize: 5,
            displayMode: 0,


        };
    }



    componentWillUnmount() {
        this.props.clearReportData(reportNames.ENERGY_CONSUMPTION_REPORT);
    }

    isReportButtonDisabled = () => {
        const { device, user, date } = this.state.selectedFilters;
        return device.id === -1 || user.id === -1 || date === null || date === '';
    }


    componentWillMount() {

        if (this.props.companies && this.props.companies.length === 0) {
            this.props.getAllCompanies();
        }
        if (this.props.devices && this.props.devices.length === 0) {
            this.props.getDevices();
        }
        if (this.props.devicesBatchList && this.props.devicesBatchList.length === 0) {
            this.props.getDeviceBatchList();
        }

    }


    componentWillReceiveProps(nextProps: any) {
        if (nextProps.reportData) {
            this.setState({ reportData: nextProps.reportData })
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


    onSelectDevice = (device: any) => {
        let selectedId = device.deviceId;
        let selectedName = device.name;
        let { selectedFilters } = this.state;
        selectedFilters.device.id = selectedId;
        selectedFilters.device.name = selectedName;
        this.setState({ selectedFilters });
    }


    onDateTimeChange = (date: any) => {
        let { selectedFilters } = this.state;
        selectedFilters.date = date.currentTarget.value;
        this.setState({ selectedFilters });
    }


    getUserSpecificDevices = (customerId: any) => {
        if (this.props.devices) {
            return this.props.devices.filter((device: any) => {
                return device.customerId === customerId
            })
        }

    }


    getReportTable = () => {
        let filtered = this.state.reportData as any[];
        const customPagination = (props: any) => { return <Pagination {...props} totalCount={this.state.reportData ? this.state.reportData.length : 0}></Pagination> }
        return <div className="content">


            <ReactTable
                noDataText={"No Data Available"}
                minRows={filtered && filtered.length > 0 ? 0 : 5}
                defaultPageSize={5}
                PaginationComponent={customPagination}
                columns={[
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
                            <span className='sortable'>Consumption Date
                            </span>
                        ),
                        accessor: 'date',
                        minWidth: 150

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Power Consumption
                            </span>
                        ),
                        accessor: 'powerConsumption',
                        minWidth: 150

                    },

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


        return <Row id="report-dd">
            <Col md={3} className="remove-padding custom-dropdown">
                <DropdownToolTip
                    title={this.state.selectedFilters.user.name !== '' ? this.state.selectedFilters.user.name : 'Select User'}
                    disabled={false}
                    id={`split-button-pull-right-energy-user`}
                    className={"dropdown-80 text-cut"}
                    list={this.props.companies}
                    onSelectOption={this.onSelectCompany}
                    tooltipID={'reports-energy-user'}
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
                    title={this.state.selectedFilters.device.name !== '' ? this.state.selectedFilters.device.name : 'Select Device'}
                    disabled={false}
                    id={`split-button-energy-device`}
                    className={"dropdown-80 text-cut"}
                    list={filteredDevices}
                    onSelectOption={this.onSelectDevice}
                    tooltipID={'reports-energy-device'}
                    label={'Device'}
                    direction={"bottom"}
                    required={true}
                    menuItemIdkey={'id'}
                    menuItemIdName={'name'}
                    defaultOption={this.state.selectedFilters.user.name === '' ? 'Select Company' : 'No Devices'}
                />
            </Col>
            <Col md={2} className="custom-dropdown  remove-padding">
                <div>
                    <div>
                        <FormGroup>
                            <ControlLabel>Select Date <span className="error">*</span></ControlLabel>
                            <FormControl type="date" value={this.state.selectedFilters.date} onChange={(e) => this.onDateTimeChange(e)} placeholder='Select date' />
                        </FormGroup>
                    </div>
                </div>

            </Col>
            <Col md={2} className="report-btn-container">
                <div>
                    <Button disabled={this.isReportButtonDisabled() || this.props.isGettingEnergyDetails ? true : false} bsStyle="warning" className="float-right report-btn" onClick={() => this.getReportData()}>
                        <i className="fa fa-search searchIcon"></i>View Report</Button>
                </div>

            </Col>
        </Row>

    }



    getReportData = () => {
        var warning = ''
        if (this.state.selectedFilters.user.id != -1 && this.state.selectedFilters.device.id != -1 && this.state.selectedFilters.date != '') {
            let data = {} as any;
            data = {
                customerId: this.state.selectedFilters.user.selectedCustomerId,
                deviceId: this.state.selectedFilters.device.id,
                date: this.state.selectedFilters.date,
            };
            this.props.getEnergyReport(data);
        }
        else {
        if (this.state.selectedFilters.user.id === -1 ) {
            warning = 'Please select User';
        } else if (this.state.selectedFilters.device.id === -1) {
            warning = 'Please select Device';
        } else if (this.state.selectedFilters.date === '') {
            warning = 'Please select Date';
        }
        toast.warn(warning, {
            position: toast.POSITION.BOTTOM_RIGHT
        });
        }

    }

    displayData = () => {
        return <Row>
            <Col id="awreport">
                {this.getReportTable()}
            </Col>
        </Row>
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
            className={"mr-20"}

        > {list.map((item: any) =>
            <MenuItem eventKey={item.mode} key={item.mode} onSelect={() => this.setState({ displayMode: item.mode })}>{item.name}</MenuItem>)

            }
        </DropdownButton>
    }


    render() {

        return (
            <div className="content">
                <div>

                </div>
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={<div><h5>Device Energy Consumption <span className="float-right hidden">{this.getDisplayModeButton()}</span></h5></div>}
                                content={
                                    <div>

                                        <div>{this.getReportFilters()}</div>
                                        {this.props.isGettingEnergyDetails ? <LoaderComponent /> :
                                            this.state.reportData.length == 0 ? <div className="alarmReportDiv no-data">Select Filters to Generate Report</div> :
                                                this.state.displayMode == 0 ?
                                                    <div>
                                                        <Row> <PageSizeSelector classNames={"float-right-2 mr-20"} changePageSize={this.handlePageSize} selectedPage={this.state.pageSize} /></Row>
                                                        <div>{this.displayData()}</div>
                                                    </div> :
                                                    <div className="alarmReportDiv no-data">Feature Coming Soon! Please visit later</div>
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
}




const mapStateToProps = (state: RootState) => ({
    companies: state.Company ? state.Company.CompaniesList : [] as any[],
    devicesBatchList: state.Device && state.Device.devicesBatchList ? state.Device.devicesBatchList : [] as any[],
    devices: state.Device && state.Device.deviceList ? state.Device.deviceList : [],
    reportData: state.Report && state.Report.energyConsumptionReportData ? state.Report.energyConsumptionReportData : [] as any[],
    isGettingEnergyDetails: state.Report ? state.Report.isGettingEnergyDetails : false,
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions,
    userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null
})

const mapDispatchToProps = {
    getAllCompanies: companyActions.getCompanyList,
    getDeviceBatchList: deviceActions.getDeviceBatchList,
    getDevices: deviceActions.getDevicesList,
    getEnergyReport: reportActions.getEnergyConsumptionData,
    clearReportData: reportActions.clearReportData,

}


export default connect(mapStateToProps, mapDispatchToProps)(EnergyConsumptionReport);
