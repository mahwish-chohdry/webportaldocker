import React from "react";
import {
    Grid,
    Row,
    Col,
    SplitButton,
    MenuItem,
    Badge,
    DropdownButton,
    FormGroup,
    ControlLabel,
    FormControl

} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { toast } from 'react-toastify';
import { ICompany, IPLCInverterDetails, IReportFilters, IPLCInverterDetailsProps, IPLCInverterDetailsState, IUserPermissions } from 'Interface';
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
import { filterCaseInsensitive, displayModeList, textWrapStyle, isPermittedComponent, getDefaultCustomer } from 'utils';
import Pagination from "utils/Pagination";
import PageSizeSelector from "utils/PageSizeSelector";
import { reportNames, NOT_ALLOWED } from "constants/index";
import { dashboardRoutes } from "constants/routes";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip.jsx";

class InverterDetails extends React.Component<IPLCInverterDetailsProps, IPLCInverterDetailsState> {
    constructor(props: any) {
        super(props);
        let userObj = getDefaultCustomer(this.props.userInfo, this.props.companies);
        this.state = {
            selectedFilters: {
                user: {
                    id: userObj.id,
                    name: userObj.name,
                    selectedCustomerId: userObj.customerId,
                },
                date: '',
                //date: new Date(Date.now()).getDate() + '/' +new Date(Date.now()).getMonth()+1 + '/' + new Date(Date.now()).getUTCFullYear(), // to get date in dd/mm/yyyy format
                device: { id: -1, name: '' }
            } as IReportFilters,
            inverterData: [] as IPLCInverterDetails[],
            isDisabled: true,
            sort: [],
            pageSize: 5,
            displayMode: 0


        };
    }


    componentWillMount() {
        if (this.props.companies && this.props.companies.length === 0) {
            this.props.getAllCompanies();
        }
        if (this.props.devices && this.props.devices.length === 0) {
            this.props.getDevices();
        }
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.inverterData) {
            this.setState({ inverterData: nextProps.inverterData })
        }
    }

    componentWillUnmount() {
        this.props.clearInverterData(reportNames.INVERTER_REPORT);
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


    getUserSpecificDevices = (customerId: any) => {
        if (this.props.devices) {
            return this.props.devices.filter((device: any) => {
                return device.customerId === customerId
            })
        }

    }


    getTable = (data?: any[]) => {
        let filtered = this.state.inverterData as any[];
        const customPagination = (props: any) => { return <Pagination {...props} totalCount={this.state.inverterData ? this.state.inverterData.length : 0}></Pagination> }
        return <div className="content">


            <ReactTable
                noDataText={"No Data Available"}
                minRows={5}
                defaultPageSize={5}
                PaginationComponent={customPagination}
                collapseOnSortingChange={true}

                SubComponent={(row: any) => {
                    let obj = row.original as IPLCInverterDetails;
                    return (
                        <Row>
                            <Col md={12} xs={16}>
                                <div className="errorCodeDetails">
                                    <div className="" >
                                        <Col md={2} xs={4}><Badge className="badge-custom "> <span>Alarm </span></Badge></Col>
                                        <Col className="ml-3" md={10} xs={12}><span>{obj.alarm ? obj.alarm : "-"}</span></Col>
                                    </div>
                                    <div className="" >
                                        <Col md={2} xs={4}><Badge className="badge-custom "> <span>Warning </span></Badge></Col>
                                        <Col className="ml-3" md={10} xs={12}><span>{obj.warning ? obj.warning : '-'}</span></Col>
                                    </div>
                                    <div className="" >
                                        <Col md={2} xs={4}><Badge className="badge-custom "> <span>Title </span></Badge></Col>
                                        <Col className="ml-3" md={10} xs={12}><span>{obj.title ? obj.title : '-'}</span></Col>
                                    </div>
                                    <div className="">
                                        <Col md={2} xs={4}><Badge className="badge-custom "> <span>Code </span></Badge></Col>


                                        <Col className="ml-3" md={10} xs={12}><span>{obj.code ? obj.code : '-'}</span></Col>
                                    </div>

                                    <div className="">
                                        <Col md={2} xs={4}><Badge className="badge-custom "> <span>Reason Analysis </span></Badge></Col>
                                        <Col className="ml-3 reason-content" md={10} xs={12}><span>{obj.reasonAnalysis ? obj.reasonAnalysis : '-'}</span></Col>
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
                            <span className='sortable'>Date & Time
                            </span>
                        ),
                        id: 'timestamp',
                        minWidth: 150,
                        style: textWrapStyle,

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
                            let displayString = moment(row.original.timestamp).format('MM/DD/YYYY hh:mm');
                            return displayString;
                        },
                        defaultSortDesc: true,
                        filterMethod: (data: any, row: any, col: any) => {
                            if (moment(data.value).isValid()) {
                                let timestamp1 = moment(data.value).format('x');
                                let timestamp2 = moment(row._original.timestamp).format('L');
                                timestamp2 = moment(timestamp2).format('x');

                                if (timestamp1 === timestamp2)
                                    return true;
                            }
                            return false;



                        }

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Output Frequency
                            </span>
                        ),
                        accessor: 'outputFrequency',
                        minWidth: 150

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Output Current
                            </span>
                        ),
                        accessor: 'outputCurrent',
                        minWidth: 150

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Output Voltage
                            </span>
                        ),
                        accessor: 'outputVoltage',
                        minWidth: 150

                    },
                    {
                        Header: () => (
                            <span className='sortable'>Output Power
                            </span>
                        ),
                        accessor: 'outputPower',
                        minWidth: 150
                    },
                    {
                        Header: () => (
                            <span className='sortable'>RPM
                            </span>
                        ),
                        accessor: 'rpm',
                        minWidth: 100
                    },
                    {
                        Header: () => (
                            <span className='sortable'>Speed
                            </span>
                        ),
                        accessor: 'speed',
                        minWidth: 100
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

    handleDateChange = (s_date: any) => {
        let { selectedFilters } = this.state;
        let { device, user } = selectedFilters;
        selectedFilters.date = s_date.currentTarget.value;
        let isDisabled = s_date === null && device.id === -1 && user.id === -1;
        this.setState({ selectedFilters, isDisabled });
    };

    getReportFilters = () => {
        let filteredDevices = this.getUserSpecificDevices(this.state.selectedFilters.user.id);
        filteredDevices = filteredDevices ? filteredDevices : [];


        return <Row>
            <Col md={3} className="remove-padding custom-dropdown">

                <DropdownToolTip
                    title={this.state.selectedFilters.user.name !== '' ? this.state.selectedFilters.user.name : 'Select User'}
                    disabled={false}
                    id={`split-button-inverter-user`}
                    className={"dropdown-80 text-cut"}
                    list={this.props.companies}
                    onSelectOption={this.onSelectCompany}
                    tooltipID={'reports-inverter-user'}
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
                    id={`split-button-inverter-device`}
                    className={"dropdown-80 text-cut"}
                    list={filteredDevices}
                    onSelectOption={this.onSelectDevice}
                    tooltipID={'reports-inverter-device'}
                    label={'Device'}
                    direction={"bottom"}
                    required={true}
                    menuItemIdkey={'id'}
                    menuItemIdName={'name'}
                    defaultOption={this.state.selectedFilters.user.name === '' ? 'Select Company' : 'No Devices'}
                />
            </Col>
            <Col md={3} className=" remove-padding custom-dropdown">
                <FormGroup>
                    <ControlLabel>Select Date<span className="error">*</span></ControlLabel>
                    <FormControl type="date" value={this.state.selectedFilters.date} onChange={(e) => this.handleDateChange(e)} placeholder='Select date' />
                </FormGroup>
            </Col>

            <Col md={3} className="custom-dropdown float-left viewReportButton marg-top">
                <div >
                    <Button disabled={this.isReportButtonDisabled() || this.props.isGettingInverterDetails ? true : false} bsStyle="warning" className="float-left report-btn" onClick={() => this.getReportData()}>
                        <i className="fa fa-search searchIcon"></i>View Report</Button>
                </div>

            </Col>
        </Row>

    }

    isReportButtonDisabled = () => {
        const { device, user, date } = this.state.selectedFilters;
        return device.id === -1 || user.id === -1 || date === '';
    }

    getReportData = () => {
        let data = {} as any;
        data = {
            customerId: this.state.selectedFilters.user.id == -1 ? null : this.state.selectedFilters.user.selectedCustomerId,
            deviceId: this.state.selectedFilters.device.id == -1 ? null : this.state.selectedFilters.device.id,
            date: this.state.selectedFilters.date === '' ? null : this.state.selectedFilters.date,
        };

        if (data.customerId != null && data.deviceId != null && data.date != '') {
            this.props.getInverterData(data)

        }
        else {
            toast.warn("Please select required filters to generate report", { position: toast.POSITION.BOTTOM_RIGHT })
        }

    }


    displayData = (data?: any[]) => {
        return <Row>
            <Col id="awreport">
                {this.getTable(data)}
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
                                title={<div><h5>PLC Inverter Details  <span className="float-right hidden">{this.getDisplayModeButton()}</span></h5></div>}
                                content={
                                    <div>
                                        <div>{this.getReportFilters()}</div>
                                        {this.props.isGettingInverterDetails ? <LoaderComponent /> :
                                            this.state.inverterData.length == 0 ? <div className="alarmReportDiv no-data">Select Filters to Generate Report</div> :
                                                this.state.displayMode == 0 ?
                                                    <div>
                                                        <Row> <PageSizeSelector classNames={"float-right-2 mr-20"} changePageSize={this.handlePageSize} selectedPage={this.state.pageSize} /></Row>
                                                        <div>{this.displayData()}</div>
                                                    </div> : <div className="alarmReportDiv no-data">Feature coming soon! Please visit later</div>

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
    devices: state.Device && state.Device.deviceList ? state.Device.deviceList : [],
    inverterData: state.Report && state.Report.inverterData ? state.Report.inverterData : [] as any[],
    isGettingInverterDetails: state.Report && state.Report.isGettingInverterDetails ? state.Report.isGettingInverterDetails : false,
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions,
    userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null
})
const mapDispatchToProps = {
    getAllCompanies: companyActions.getCompanyList, // dropdowns
    getDevices: deviceActions.getDevicesList, // dropdwons
    getInverterData: reportActions.getInverterDetails,
    clearInverterData: reportActions.clearReportData


}


export default connect(mapStateToProps, mapDispatchToProps)(InverterDetails);
