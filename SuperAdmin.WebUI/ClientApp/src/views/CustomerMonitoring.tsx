import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    SplitButton,
    MenuItem,
    Modal,
    FormGroup,
    FormControl,
    ControlLabel,
    Tab,
    Nav,
    NavItem,
    Badge,
    DropdownButton
} from "react-bootstrap";
import ReactTable from "react-table";
import _ from 'lodash';
import 'react-table/react-table.css';
import { toast } from 'react-toastify';
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { ICompany, IUser, ICompanyProps, IUserPermissions } from 'Interface'
import { connect } from "react-redux";
import * as actions from 'action/company';
import * as s_actions from 'action/admin_settings';
import { RootState } from 'reducers';
import { LoaderComponent } from 'components/Loader';
import { filterCaseInsensitive, textWrapStyle, sortOnCreatedDate, userProfileTypes, isPermittedComponent, getMonitorDevicesPermissionStatus, getRegisterDevicesPermissionStatus, getUserProfileInsertionPermissionStatus } from 'utils';
import Pagination from "utils/Pagination";
import PageSizeSelector from "utils/PageSizeSelector";
import TableActionComponent from "components/CustomerMonitoringComponents/TableActionComponent"
import { dashboardRoutes } from "constants/routes";
import { NOT_ALLOWED } from "constants/index";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";
import ReactTooltip from "react-tooltip";

class Company extends React.Component<ICompanyProps, any> {
    constructor(props: ICompanyProps) {
        super(props);
        this.state = {
            customerType: '',
            showModal: false,
            showUserModal: false,
            isDisabled: false,
            sort: [],
            pageSize: 5,
            selectedTab: 100,
            permissions:{
                showDevices: getMonitorDevicesPermissionStatus(this.props.permissions),
                registerDevices:getRegisterDevicesPermissionStatus(this.props.permissions),
                addUserProfile: getUserProfileInsertionPermissionStatus(this.props.permissions)
            }
            
        };

    }

    handlePageSize = (newPageSize: number) => {
        this.setState({ pageSize: newPageSize })
    }

    

    componentWillMount() {
        this.props.getAllCompanies();
        this.props.getRoles();
    }

    shouldComponentUpdate(nextProps: any, nextState: any){
        if(_.isEqual(nextProps.companies, this.props.companies) && _.isEqual(nextState, this.state)){
            return false;
        }
        return true;
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

    getUsersTable = (data: any[]) => {
        // var companies = _.clone(this.props.companies)
        var companies = _.clone(data)
        var sortedCompanies = companies && companies.length > 0 && sortOnCreatedDate(companies);
        return <ReactTable
            noDataText={"No Data Available"}
            minRows={5}
            defaultPageSize={5}
            data={sortedCompanies ? sortedCompanies : []}
            PaginationComponent={Pagination}
            
            columns={[
                {
                    Header: () => (
                        <span className='sortable'>Name
                        </span>
                    ),
                    accessor: 'name',
                    style: textWrapStyle

                },
                {
                    Header: () => (
                        <span className='sortable'>User Type</span>
                    ),
                    accessor: 'customerType',
                },
                {
                    Header: () => (
                        <span className='sortable'>Address</span>
                    ),
                    accessor: 'address',
                    style: textWrapStyle

                },
                {
                    Header: () => (
                        <span className='sortable'>Created By</span>
                    ),
                    accessor: 'createdBy',
                },
                {
                    Header: 'Status',
                    accessor: 'isActive',
                    maxWidth: 100,
                    sortable: false,
                    filterable: false,
                    Cell: (row: any) => {
                        return (<input type="checkbox" disabled defaultChecked={false} checked={row.original.isActive} />)
                    }
                },
                {
                    Header: '',
                    accessor: 'Update',
                    sortable: false,
                    filterable: false,
                    minWidth:50,
                    width:200,
                    show: this.getAllActionsAllowed(),
                    Cell: (row: any) => {
                        return (
                            <div className="icon-btn flex_display">
                                <TableActionComponent
                                    row = {row}
                                    addUserProfilePermission = {this.state.permissions.addUserProfile}
                                    updatePermission = {this.props.componentPermissions && this.props.componentPermissions.canUpdate}
                                    
                                ></TableActionComponent>
                                 {/* device monitoring */}
                                <Button data-tip
                                  data-for='device-show'
                                  variant="primary" 
                                  onClick={(e: any) => { this.props.history.push('/admin/monitorDevice', { customerID: row.original.id, customerName: row.original.name, selectedCustomerId: row.original.customerId   }) }}
                                  disabled={!this.state.permissions.showDevices ? true : false}
                                  className={! this.state.permissions.showDevices ? 'd-none' : 'd-block'}
                                >
                                    <i className="fa fa-eye"></i>
                                </Button>
                                <ReactTooltip id='device-show' effect='solid' place='top'>
                                    <span>Monitor Devices</span>
                                </ReactTooltip>
                                {/* Device Registration */}
                                <Button
                                 disabled={! this.state.permissions.registerDevices ? true : false}
                                 className={! this.state.permissions.registerDevices ? 'd-none' : 'd-block'}
                                data-tip data-for='device-register' variant="primary" onClick={(e: any) => { this.props.history.push('/admin/devices', { customerID: row.original.id, customerName: row.original.name,selectedCustomerId: row.original.customerId   }) }}>
                                    <i className="fa fa-mobile-phone"></i>
                                </Button>
                                <ReactTooltip id='device-register' effect='solid' place='top'>
                                    <span>Register Devices</span>
                                </ReactTooltip>

                            </div>
                            )
                    }
                },
            ]}
            showPagination={true}
            pageSize={this.state.pageSize}
            filterable={true}
            sorted={this.state.sort}
            onSortedChange={this.handleSort}
            defaultFilterMethod={filterCaseInsensitive}
            className="-highlight"
        />
    }

    getAllActionsAllowed = () =>{
        return (this.props.componentPermissions && this.props.componentPermissions.canInsert) ||
        this.state.permissions.showDevices ||
        this.state.permissions.registerDevices ||
        (this.props.componentPermissions && this.props.componentPermissions.canUpdate);
    }

    onSelectPersonaTab = (tab: any) => {
        this.setState({
            selectedTab: tab
        })

    }

    getTabbedComponent = () => {
        let customerTypes = this.props.companies ? this.props.companies.map((item: any) => {
            return item.customerType;
        }) : [];
        customerTypes = arrayUnion(customerTypes, customerTypes, areObjEqual);
        let personas = this.props.personas.filter((item: any) => customerTypes.includes(item.personaName));
        let all_data = this.props.companies ? this.props.companies : [];
        let data = {} as any;
        personas.forEach((item: any) => {
            data[item.id] = this.getFilteredContent(item.personaName);
        });
        return <div>
            <Tab.Container
                id="user-monitor-page"
                activeKey={this.state.selectedTab}
                onSelect={(k: any) => this.onSelectPersonaTab(k)}
            >
                <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs" className= {"responsiveNav"}>
                            <NavItem eventKey={100}>All <Badge>{all_data ? all_data.length : 0}</Badge></NavItem>
                            {
                                personas.map((item: any) => {
                                    return <NavItem eventKey={item.id}>{item.personaName} <Badge>{data[item.id].length}</Badge></NavItem>
                                })
                            }
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content animation={false}>
                            <Tab.Pane eventKey={100}>{this.getUsersTable(all_data)}</Tab.Pane>
                            {
                                personas.map((item: any) => {
                                    return <Tab.Pane eventKey={item.id}>{this.getUsersTable(data[item.id])}</Tab.Pane>
                                })
                            }
                        </Tab.Content>
                    </Col>

                </Row>
            </Tab.Container>
        </div>
    }

    getFilteredContent = (personaName: string) => {
        return this.props.companies && this.props.companies.filter((item: any) => {
            return item.customerType === personaName;
        })
    }

    render() {
        //sorting companies on created date

        const footerElement = () => { return <div>footer</div> };
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={<div><span>Monitor Users</span> <PageSizeSelector classNames={"float-right-2"} changePageSize={this.handlePageSize} selectedPage={this.state.pageSize}/></div> }
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    this.props.isGettingCompanies && this.props.companies && this.props.companies.length === 0? <div className="fixed-height"> <LoaderComponent /></div> :

                                        <div className="pad-5">
                                            {this.getTabbedComponent()}
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

function arrayUnion(arr1: any[], arr2: any[], equalityFunc: any) {
    var union = arr1.concat(arr2);

    for (var i = 0; i < union.length; i++) {
        for (var j = i + 1; j < union.length; j++) {
            if (equalityFunc(union[i], union[j])) {
                union.splice(j, 1);
                j--;
            }
        }
    }

    return union;
}

function areObjEqual(g1: any, g2: any) {
    return g1 === g2;
}

const mapStateToProps = (state: RootState) => ({
    companies: state.Company ? state.Company.Companies : [] as ICompany[],
    isGettingCompanies: state.Company && state.Company.isGettingCompanies ? state.Company.isGettingCompanies : false,
    roles: state.Settings ? state.Settings.roles : [],
    persona_roles: state.Settings ? state.Settings.persona_roles : [],
    userId: state.User ? state.User.UserInfo.userId : '',
    personas: state.Settings ? state.Settings.personas : [],

    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions
})
const mapDispatchToProps = {
    getAllCompanies: actions.getAllCompanies,
    // updateCompany: actions.UpdateCompany,
    // AddUserProfile: actions.AddUserProfile,
    getRoles: s_actions.GetRolesList,
    getRolesByPersona: s_actions.GetRolesListByPersona,
}
export default connect(mapStateToProps, mapDispatchToProps)(Company);