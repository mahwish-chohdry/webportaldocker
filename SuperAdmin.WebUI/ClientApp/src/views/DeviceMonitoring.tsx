import React from "react";
import {
    Grid,
    Row,
    Col,
    SplitButton,
    DropdownButton,
    MenuItem,
    Button,
    Modal,
    FormGroup,
    FormControl,
    ControlLabel,
    Badge
} from "react-bootstrap";
import _ from 'lodash';
import Card from "components/Card/Card.jsx";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { ICompany, deviceProps, IdeviceMonitoringState, Idevice, IUserPermissions } from 'Interface';
import { RootState } from "reducers";
import { connect } from "react-redux";
import * as actions from 'action/company';
import * as deviceActions from 'action/device';
import { LoaderComponent } from "components/Loader";
import ReactTooltip from 'react-tooltip';
import moment from "moment";
import { filterCaseInsensitive, textWrapStyle, sortOnCreatedDate, isPermittedComponent, getDefaultCustomer } from 'utils/index';
import Pagination from "utils/Pagination";
import PageSizeSelector from "utils/PageSizeSelector";
import { dashboardRoutes } from "constants/routes";
import { NOT_ALLOWED } from "constants/index";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";

class DeviceMonitoring extends React.Component<deviceProps, any> {
    constructor(props: deviceProps) {
        super(props);
        let userObj = getDefaultCustomer(this.props.userInfo, this.props.companies);
        this.state = {
            companyId: this.props.history.location.state && this.props.history.location.state.customerID ? this.props.history.location.state.customerID : userObj.id,
            companyName: this.props.history.location.state && this.props.history.location.state.customerName ? this.props.history.location.state.customerName : userObj.name,
            selectedCustomerId: this.props.history.location.state && this.props.history.location.state.selectedCustomerId ? this.props.history.location.state.selectedCustomerId : userObj.customerId,
            showModal: false,
            isDisabled: false,
            selectedDeviceId: -1,
            deviceName: '',
            deviceId: '',
            deviceCompanyName: '',
            errors: {
                deviceName: ''
            },
            sort: [],
            pageSize: 5,
        };
    }

    handlePageSize = (newPageSize: number) => {
        this.setState({ pageSize: newPageSize })
    }

    componentWillMount() {
        this.props.getAllCompanies();
        this.props.getDevices();

    }


    onSelectCompany = (company: any) => {
        this.setState({
            companyName: company.name,
            companyId: company.id,
            selectedCustomerId: company.customerId
        });
    }


    handleShow = (e: any, data: any) => {
        this.removeErrors();
        this.setState({
            showModal: true,
            deviceName: data.original.name,
            selectedDeviceId: data.original.id,
            deviceId: data.original.deviceId,
            deviceCompany: data.original.customerId
        });
    }

    handleClose = () => {
        this.removeErrors();
        this.setState({ showModal: false })
    }


    removeErrors = () => {
        let errors = {
            deviceName: ''
        }
        this.setState({ errors })
    }


    handleSave = (e: any) => {
        this.setState({ showModal: false })
        let company = this.props.companies ? this.props.companies.filter(company => company.id == this.state.deviceCompany) : [];
        let companyName = company.length > 0 ? company[0].name : "";
        this.props.updateDevice({ id: this.state.selectedDeviceId, deviceSerialId: this.state.deviceId, deviceName: this.state.deviceName, companyName: this.state.selectedCustomerId });
    }

    validates = (updatedItem: Idevice) => {
        let errors = {} as any;
        let flag = true;

        let entries = Object.entries(updatedItem);
        entries.forEach(ele => {
            if (ele[1].toString().trimLeft().trimRight() == '') {
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

    handleInputChange = (e: any) => {
        let errors = {} as any;
        let isDisabled = false;
        let key: string = e.currentTarget.name;
        let value = e.currentTarget.value;

        if (value.trimLeft().trimRight() == "") {
            errors = { ...this.state.errors, [key]: `Required` };
            isDisabled = true;
        }
        else {
            errors = { ...this.state.errors, [key]: `` };
            isDisabled = false;
        }
        this.setState({ [key]: value, errors, isDisabled })
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

    sortDevices = (filteredResults: any) => {
        //sorting companies on created date
        var companies = _.clone(this.props.companies)
        companies = companies && companies.length > 0 && sortOnCreatedDate(companies);
        if (companies && filteredResults) {
            let sortedDevices = [] as any;
            companies.forEach(function (company: any) {
                filteredResults = filteredResults.filter(function (item: any) {
                    if (item.customerId === company.id) {
                        sortedDevices.push(item);
                        return false;
                    } else
                        return true;
                })
            })
            return sortedDevices;
        }
        else {
            return null;
        }

    }

    getEditModal = () => {
        return <Modal show={this.state.showModal} onHide={this.handleClose}  >
            <Modal.Header closeButton>
                <Modal.Title>Edit Device</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup controlId="formHorizontalEmail">
                    <ControlLabel>Device name</ControlLabel>

                    <FormControl bsClass="form-control" type="text" placeholder="Device Name" name="deviceName" value={this.state.deviceName} onChange={this.handleInputChange} />
                    <span className="error" >{this.state.errors.deviceName}</span>

                </FormGroup>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.handleClose}>
                    Close
            </Button>
                <Button onClick={this.handleSave} disabled={this.state.isDisabled ? true : false}>
                    Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
    }


    checkNull = (attr:any) => {
        return attr === null? 'N/A': attr;
    }

    getDeviceStatusSubComponent = () =>{
        return (row: any) => {
            let deviceStatus = row.original.devicestatus && row.original.devicestatus.length? row.original.devicestatus[0]: {};
            return (
                <Row className={"errorCodeDetails grayback"}> 
                    <Col md={12} xs={12}>
                        <div className="deviceDetails">
                            <Row>
                                <Col md={3}> <div><i className="fa fa-bolt"></i><strong>Speed (Hz): </strong>{this.checkNull(deviceStatus.speed)}</div></Col>
                                <Col md={3}> <div><i className="fa fa-thermometer-half"></i><strong>Temperature (&deg;C): </strong>{this.checkNull(deviceStatus.temp)}</div></Col>
                                <Col md={3}> <div><i className="fa fa-tint"></i><strong>Humidity (%RH): </strong>{this.checkNull(deviceStatus.humidity)}</div></Col>
                                <Col md={3}> <div><i className="fa fa-tachometer"></i><strong>Pressure (hPa): </strong>{this.checkNull(deviceStatus.pressure)}</div></Col>
                                <Col md={3}> <div><i className="fa fa-hourglass"></i><strong>Usage Time (hrs): </strong>{this.checkNull(deviceStatus.usageHours)}</div></Col>
                                <Col md={3}> <div><i className="fa fa-clock-o"></i><strong>Running Time (s): </strong>{this.checkNull(deviceStatus.runningTime)}</div></Col>
                                <Col md={3}> <div><i className="fa fa-gavel"></i><strong>Maintenance Time (hrs): </strong>{this.checkNull(deviceStatus.maintenanceHours)}</div></Col>
                                                     
                            </Row>                       
                        </div>
                       
                    </Col>

                </Row>

            )
        }
    }
    render() {
        var filteredResults = this.state.companyId != -1 ? this.props.devices ? this.props.devices.filter((device, index) => device.customerId === this.state.companyId) : [] : this.props.devices;

        filteredResults = this.sortDevices(filteredResults)

        return (
            <div className="content">
                <div>
                {this.state.showModal? this.getEditModal(): ''}
                </div>

                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={<div><span>Monitor Devices</span>  {filteredResults && filteredResults.length ? <PageSizeSelector classNames={"float-right-2"} changePageSize={this.handlePageSize} selectedPage={this.state.pageSize} /> : <span />}</div>}
                                content={
                                    <div>
                                        <Row className="rowMargin">
                                            <Col md={8}>
                                                <DropdownToolTip
                                                    title={this.state.companyName !== '' ? this.state.companyName : 'Select Customer'}
                                                    id={`split-button-devices-monitoring-customer`}
                                                    className={"dropdown-50 text-cut"}
                                                    list={this.props.companies && this.props.companies}
                                                    onSelectOption={this.onSelectCompany}
                                                    tooltipID={'devices-monitoring-customer'}
                                                    direction={"bottom"}
                                                    menuItemIdkey={"id"}
                                                    menuItemIdName={"name"}
                                                    defaultOption={'All Devices'}
                                                >
                                                </DropdownToolTip>
                                            </Col>




                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                {this.props.isGettingDevices && this.props.devices && this.props.devices.length == 0 ? <LoaderComponent /> :
                                                    filteredResults && filteredResults.length ?
                                                        <ReactTable
                                                            noDataText={"No Data Available"}
                                                            minRows={filteredResults && filteredResults.length ? 0 : 5}
                                                            defaultPageSize={5}
                                                            PaginationComponent={Pagination}
                                                            SubComponent={this.getDeviceStatusSubComponent()}
                                                            
                                                            columns={[
                                                                {
                                                                    expander:true,
                                                                    Expander: ({ isExpanded, row, ...rest }) => {
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
                                                                    accessor: 'name',
                                                                    minWidth: 150,
                                                                    style: textWrapStyle,
                                                                },
                                                                {
                                                                    Header: () => (
                                                                        <span className='sortable'>Device Id
                                                                        </span>
                                                                    ),
                                                                    accessor: 'deviceId',
                                                                    minWidth: 150,
                                                                },
                                                                {
                                                                    Header: () => (
                                                                        <span className='sortable'>Device Code
                                                                        </span>
                                                                    ),
                                                                    accessor: 'deviceCode',
                                                                    minWidth: 150,
                                                                },
                                                                {
                                                                    Header: 'Configured',
                                                                    minWidth: 120,
                                                                    width: 120,
                                                                    accessor: 'isInstalled',
                                                                    sortable: false,
                                                                    filterable: false,
                                                                    Cell: (row: any) => {
                                                                        return (<input type="checkbox" disabled defaultChecked={false} checked={row.original.isInstalled} />)
                                                                    },
                                                    
                                                                },
                                                                {
                                                                    Header: () => (
                                                                        <span className='sortable'>Device Status
                                                                        </span>
                                                                    ),
                                                                    accessor: 'connectivityStatus',
                                                                    minWidth: 150,
                                                                },
                                                                {
                                                                    Header: () => (
                                                                        <span className='sortable'>Last Maintenance
                                                                        </span>
                                                                    ),
                                                                    id: 'lastMaintenanceDate',
                                                                    minWidth: 150,
                                                                    style: textWrapStyle,
                                                    
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
                                                                    Header: '',
                                                                    accessor: 'Update',
                                                                    sortable: false,
                                                                    filterable: false,
                                                                    Cell: (row: any) => {
                                                                        return (
                                                    
                                                                            <div>
                                                    
                                                                                <Button disabled={!(this.props.componentPermissions && this.props.componentPermissions.canUpdate) ? true : false} data-tip data-for='edit-btn' onClick={(e: any) => this.handleShow(e, row)}>
                                                                                    <i className="fa fa-pencil"></i>
                                                                                </Button>
                                                                                <ReactTooltip id='edit-btn' effect='solid' place='right'>
                                                                                    <span>{this.props.componentPermissions && this.props.componentPermissions.canUpdate ? 'Edit' : 'Not Permitted'}</span>
                                                                                </ReactTooltip>
                                                    
                                                    
                                                    
                                                                            </div>)
                                                                    },
                                                                    width: 80
                                                                }
                                                            ]}
                                                            data={filteredResults}
                                                            showPagination={true}
                                                            pageSize={this.state.pageSize}
                                                            sorted={this.state.sort}
                                                            onSortedChange={this.handleSort}
                                                            filterable={true}
                                                            defaultFilterMethod={filterCaseInsensitive}
                                                            className="-highlight" /> : <div className="DeviceMonitoringNoDevice"> No Devices Found</div>

                                                }
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
    companies: state.Company ? state.Company.CompaniesList : [] as ICompany[], // Company List for dropdowns
    devices: state.Device ? state.Device.devices : [] as Idevice[],
    isGettingDevices: state.Device && state.Device.isGettingDevices ? state.Device.isGettingDevices : false,
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions,
    userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null
})

const mapDispatchToProps = {
    getAllCompanies: actions.getCompanyList,
    getDevices: deviceActions.getAllDevices,
    updateDevice: deviceActions.UpdateDevice
}
export default connect(mapStateToProps, mapDispatchToProps)(DeviceMonitoring);
