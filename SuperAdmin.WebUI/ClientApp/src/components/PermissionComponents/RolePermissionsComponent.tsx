import React from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl,
    Tab,
    Nav,
    NavItem,
    Modal,
    Badge,
} from "react-bootstrap";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { toast } from 'react-toastify';
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { IUserRightsManagementState, IUserPermissions, IPermissions } from 'Interface'
import { connect } from "react-redux";
import * as s_actions from 'action/admin_settings';
import { RootState } from 'reducers';
import { LoaderComponent } from 'components/Loader'
import Pagination from "utils/Pagination";
import ReactTooltip from "react-tooltip";
import PageSizeSelector from "utils/PageSizeSelector";
import { isOptionDisabled, filterCaseInsensitive, textWrapStyle, alphabaticalSort } from "utils";
import { dashboardRoutes } from "constants/routes";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";
import moment from "moment";

class RolesPermissionsComponent extends React.Component<any, {permissions:IPermissions}> {
    constructor(props: any) {
        super(props);
        this.state = {
            permissions: {
                selectedFormType: '',
                selectedUserRole: '',
                selectedFormId: -1,
                selectedUserRoleId: -1,
                selectedUserPersona: '',
                selectedUserPersonaId: -1,
                canView: false,
                canDelete: false,
                canUpdate: false,
                canInsert: false,
                canExport: false,
                showModal: false,
                allOption: false,
                pageSize: 5,
                persona_roles_list: [],
                persona_forms_list: [],
                idToBeEdited: -1,
                isOpen: false,
                toBeDeleted: -1,
                selectedTab: this.props.personas && this.props.personas.length ? this.props.personas[0].id : 1
            }
        }
    }

    componentWillMount = () => {
        if (this.props.rolePermissionList && this.props.rolePermissionList.length === 0)
            this.props.GetRolePermissionList();
        // getting persona permission list for dropdowns
        if (this.props.personaPermissionsList && this.props.personaPermissionsList.length === 0)
            this.props.GetPersonaPermissionsList();
        
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return nextProps.render;
    }

    getPermissionButtonState = () => {
        return this.state.permissions.selectedFormId === -1 || this.state.permissions.selectedUserRoleId === -1 || this.state.permissions.selectedUserPersonaId === -1;
    }


    handleSubmitPermission = (e: any) => {
        e.preventDefault();
        const { selectedFormId, selectedUserRoleId, selectedFormType, selectedUserRole, canDelete, canUpdate, canInsert, canView, canExport } = this.state.permissions;
        let data = {
            id: 0,
            roleId: selectedUserRoleId,
            formId: selectedFormId,
            canView: canView,
            canUpdate: canUpdate,
            canInsert: canInsert,
            canDelete: canDelete,
            formName: selectedFormType,
            roleName: selectedUserRole,
            canExport: canExport,
        };
        this.setState({
            permissions: {
                ...this.state.permissions,
                selectedUserRoleId: -1,
                selectedFormId: -1,
                canView: false,
                canUpdate: false,
                canInsert: false,
                canDelete: false,
                canExport: false,
                allOption: false,
                selectedFormType: '',
                selectedUserRole: '',
            }
        }, () => {
            this.props.createRolePermission(data)
        })

    }

    onSelectAllPermissions = () => {
        let allOptions = this.state.permissions.allOption;
        this.setState({
            permissions: {
                ...this.state.permissions,
                canView: !allOptions,
                canUpdate: !allOptions,
                canInsert: !allOptions,
                canDelete: !allOptions,
                canExport: !allOptions,
                allOption: !allOptions,
            }
        });
    }

    componentWillReceiveProps = (nextProps: any) => {

        this.setState({ permissions: { ...this.state.permissions, persona_roles_list: nextProps.roles } })
    }



    onChangeCheckbox = (name: string, key: boolean) => {
        this.setState({
            permissions: {
                ...this.state.permissions,
                [name]: key,
                // allOption: all,

            }
        }, () => {
            const { canInsert, canDelete, canUpdate, canView, canExport } = this.state.permissions;
            let all = false;
            if (canInsert && canDelete && canUpdate && canView && canExport) {
                all = true;
            }
            this.setState({
                permissions: {
                    ...this.state.permissions,
                    // [name]: key,
                    allOption: all,

                }
            })
        })
    }

    onSelectPersona = (persona: any) => {
        this.props.getRoles(persona.personaName)
        // Filtering forms on the basis of selected persona..
        let filterForms = this.props.personaPermissionsList.filter((item: any) => item.personaId === persona.id)
        let sortedfilterForms = filterForms.sort((a: any, b: any) => alphabaticalSort(a.formName, b.formName));
        this.setState({
            permissions: {
                ...this.state.permissions,
                selectedUserPersona: persona.personaName,
                selectedUserPersonaId: persona.id,
                selectedUserRole: '',
                selectedUserRoleId: -1,
                selectedFormId: -1,
                selectedFormType: '',
                persona_roles_list: [],
                persona_forms_list: sortedfilterForms
            }
        })

    }

    getRolePermissionCard = () => {
        let persona_roles = this.props.roles;
        return <Row className="mt-5percent">
            <Col md={12}>
                <div>
                    <form onSubmit={this.handleSubmitPermission}>
                        <Col md={4} className="responsive_marginBottom">
                            <DropdownToolTip
                                title={this.state.permissions.selectedUserPersona !== '' ? this.state.permissions.selectedUserPersona : 'Select Persona'}
                                id={`split-button-management-rolePermission-personas`}
                                className={"dropdown-70 text-cut"}
                                list={this.props.personas}
                                onSelectOption={this.onSelectPersona}
                                tooltipID={'administration-management-rolePermission-personas'}
                                label={'Personas'}
                                direction={"bottom"}
                                required={true}
                                menuItemIdkey={"id"}
                                menuItemIdName={"personaName"}
                            >
                            </DropdownToolTip>
                        </Col>
                        <Col md={4} className="responsive_marginBottom">
                            <DropdownToolTip
                                title={this.state.permissions.selectedUserRole !== '' ? this.state.permissions.selectedUserRole : 'Select User Role'}
                                id={`split-button-management-rolePermission-userRoles`}
                                className={"dropdown-70 text-cut"}
                                list={this.state.permissions.persona_roles_list}
                                onSelectOption={(item: any) => this.setState({ permissions: { ...this.state.permissions, selectedUserRole: item.role1, selectedUserRoleId: item.id, selectedFormId: -1, selectedFormType: '' } })}
                                tooltipID={'administration-management-rolePermission-userRoles'}
                                label={'User Roles'}
                                direction={"bottom"}
                                required={true}
                                menuItemIdkey={"id"}
                                menuItemIdName={"role1"}
                            >
                            </DropdownToolTip>
                        </Col>
                        <Col md={4} className="responsive_marginBottom">
                            <DropdownToolTip
                                title={this.state.permissions.selectedFormType !== '' ? this.state.permissions.selectedFormType : 'Select Form Type'}
                                id={`split-button-management-rolePermission-Form`}
                                className={"dropdown-70 text-cut"}
                                list={this.state.permissions.selectedUserRole !== '' ? this.state.permissions.persona_forms_list : []}
                                onSelectOption={(item: any) => this.setState({ permissions: { ...this.state.permissions, selectedFormType: item.formName, selectedFormId: item.formId } })}
                                tooltipID={'administration-management-rolePermission-form'}
                                label={'Form'}
                                direction={"bottom"}
                                required={true}
                                menuItemIdkey={"formId"}
                                menuItemIdName={"formName"}
                                canDisableOptions={true}
                                disableOptionFunc={this.IsRolePermissionFormOptionDisabled}
                            >
                            </DropdownToolTip>
                        </Col>
                        <Col md={12} className="permission-padding">
                            <ControlLabel>Permissions</ControlLabel>
                        </Col>
                        <Col md={12} className="custom-inputs checkbox-padding">
                            <Col md={2}>
                                <div className="checkbox checkbox-inline custom-checkbox">
                                    <input
                                        id='checkbox6'
                                        type="checkbox"
                                        onChange={this.onSelectAllPermissions}
                                        checked={!this.state.permissions.isOpen && this.state.permissions.allOption}
                                    />
                                    <label htmlFor='checkbox6'>All</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox1'
                                        type="checkbox"
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canView: !this.state.permissions.canView } })}
                                        onChange={() => this.onChangeCheckbox("canView", !this.state.permissions.canView)}
                                        checked={!this.state.permissions.isOpen && this.state.permissions.canView}
                                    />
                                    <label htmlFor='checkbox1'>View</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox2'
                                        type="checkbox"
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canInsert: !this.state.permissions.canInsert } })}
                                        onChange={() => this.onChangeCheckbox("canInsert", !this.state.permissions.canInsert)}
                                        checked={!this.state.permissions.isOpen && this.state.permissions.canInsert}
                                    />
                                    <label htmlFor='checkbox2'>Insert</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox3'
                                        type="checkbox"
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canUpdate: !this.state.permissions.canUpdate } })}
                                        onChange={() => this.onChangeCheckbox("canUpdate", !this.state.permissions.canUpdate)}
                                        checked={!this.state.permissions.isOpen && this.state.permissions.canUpdate}
                                    />
                                    <label htmlFor='checkbox3'>Update</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox4'
                                        type="checkbox"
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canDelete: !this.state.permissions.canDelete } })}
                                        onChange={() => this.onChangeCheckbox("canDelete", !this.state.permissions.canDelete)}
                                        checked={!this.state.permissions.isOpen && this.state.permissions.canDelete}
                                    />
                                    <label htmlFor='checkbox4'>Delete</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox5'
                                        type="checkbox"
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canExport: !this.state.permissions.canExport } })}
                                        onChange={() => this.onChangeCheckbox("canExport", !this.state.permissions.canExport)}
                                        checked={!this.state.permissions.isOpen && this.state.permissions.canExport}
                                    />
                                    <label htmlFor='checkbox5' >Export</label>
                                </div>
                            </Col>
                        </Col>
                        <Col md={12} className="custom-inputs">
                            <Col xs={7} className="custom-inputs companyAddButton">
                                <Button fill className="buttonColor" id="submit" type="submit" disabled={this.getPermissionButtonState() ? true : false}>
                                    Create Permissions
                                                    </Button>
                            </Col>
                        </Col>
                        <div className="clearfix" />
                    </form>
                    <Row className="mt-5percent">
                        <Col md={12}>
                            {this.allPropsExist() && this.props.rolePermissionList && this.props.rolePermissionList.length ? this.getRolePermissionsTabbedComponent() : ''}
                        </Col>

                    </Row>
                </div>

            </Col>
        </Row>
    }

    IsRolePermissionFormOptionDisabled = (form: any) => {
        let formId = form.formId
        let disabledFlag = isOptionDisabled(this.props.rolePermissionList,
            this.state.permissions.selectedUserRoleId,
            formId,
            'roleId', 'formId');
        return disabledFlag;
    }


    allPropsExist = () => {
        return this.props.all_roles && this.props.all_roles.length &&
            this.props.personas && this.props.personas.length &&
            this.props.formsList && this.props.formsList.length;
    }



    handlePageSizePermission = (newPageSize: number) => {
        this.setState({ permissions: { ...this.state.permissions, pageSize: newPageSize } })
    }

    handleEditRolePermission = (data: any) => {
        let isAllOption = false;

        if (data.canView && data.canDelete && data.canInsert && data.canUpdate && data.canExport) {
            isAllOption = true;
        }
        this.setState({
            permissions: {
                ...this.state.permissions,
                selectedFormType: data.formName,
                selectedUserRole: data.roleName,
                selectedFormId: data.formId,
                selectedUserRoleId: data.roleId,
                canView: data.canView,
                canDelete: data.canDelete,
                canUpdate: data.canUpdate,
                canInsert: data.canInsert,
                canExport: data.canExport,
                idToBeEdited: data.id,
                allOption: isAllOption,
                isOpen: true
            }
        })
    }

    handleDeletePermissions = (data: any) => {
        this.setState({ permissions: { ...this.state.permissions, showModal: true, toBeDeleted: data.id } })
    }


    closePermissionModal = () => {
        this.setState({
            permissions: {
                ...this.state.permissions,
                isOpen: false,
                selectedFormType: '',
                selectedUserRole: '',
                selectedFormId: -1,
                selectedUserRoleId: -1,
                selectedUserPersona: '',
                selectedUserPersonaId: -1,
                canView: false,
                canDelete: false,
                canUpdate: false,
                canInsert: false,
                canExport: false,
                allOption: false,
                showModal: false,
                idToBeEdited: -1
            }
        });
    }


    onSaveEditRolePermission = () => {
        let selectedRolePermission = this.state.permissions;
        let data = {
            id: selectedRolePermission.idToBeEdited,
            roleId: selectedRolePermission.selectedUserRoleId,
            formId: selectedRolePermission.selectedFormId,
            canView: selectedRolePermission.canView,
            canUpdate: selectedRolePermission.canUpdate,
            canInsert: selectedRolePermission.canInsert,
            canDelete: selectedRolePermission.canDelete,
            canExport: selectedRolePermission.canExport,
            formName: selectedRolePermission.selectedFormType,
            roleName: selectedRolePermission.selectedUserRole
        };

        this.props.updateRolePermission(data)
        this.closePermissionModal();
    }

    getRolePermissionsTable = (list: any) => {
        let rolePermissionTable = list;
        return <div>

            <ReactTable
                data={rolePermissionTable}
                noDataText={"No Data Available"}
                minRows={1}
                PaginationComponent={Pagination}
                showPagination={rolePermissionTable.length > 5 ? true : false}
                defaultPageSize={5}
                pageSize={this.state.permissions.pageSize}
                className="-highlight"
                defaultFilterMethod={filterCaseInsensitive}
                columns={[{
                    Header: () => (
                        <span>Persona
                        </span>
                    ),
                    accessor: 'personaName',
                    minWidth: 100,
                    width: 150,
                    filterable: true,

                }, {
                    Header: () => (
                        <span>User Role
                        </span>
                    ),
                    accessor: 'roleName',
                    minWidth: 100,
                    width: 150,
                    filterable: true,

                },
                {
                    Header: () => (
                        <span >Form
                        </span>
                    ),
                    accessor: 'formName',
                    minWidth: 100,
                    width: 150,
                    filterable: true,
                    style: textWrapStyle

                },
                {
                    Header: () => (
                        <span >Can View
                        </span>
                    ),
                    accessor: 'canView',
                    minWidth: 100,
                    width: 100,
                    Cell: (row: any) => {
                        return (<input type="checkbox" disabled defaultChecked={false} checked={row.original.canView} />)
                    },

                },
                {
                    Header: () => (
                        <span >Can Insert
                        </span>
                    ),
                    accessor: 'canInsert',
                    minWidth: 100,
                    width: 100,
                    Cell: (row: any) => {
                        return (<input type="checkbox" disabled defaultChecked={false} checked={row.original.canInsert} />)
                    },

                },
                {
                    Header: () => (
                        <span >Can Update
                        </span>
                    ),
                    accessor: 'canUpdate',
                    minWidth: 100,
                    width: 100,
                    Cell: (row: any) => {
                        return (<input type="checkbox" disabled defaultChecked={false} checked={row.original.canUpdate} />)
                    },

                },
                {
                    Header: () => (
                        <span >Can Delete
                        </span>
                    ),
                    accessor: 'canDelete',
                    minWidth: 100,
                    width: 100,
                    Cell: (row: any) => {
                        return (<input type="checkbox" disabled defaultChecked={false} checked={row.original.canDelete} />)
                    },

                },
                {
                    Header: () => (
                        <span >Can Export
                        </span>
                    ),
                    accessor: 'canExport',
                    minWidth: 100,
                    width: 100,
                    Cell: (row: any) => {
                        return (<input type="checkbox" disabled defaultChecked={false} checked={row.original.canExport} />)
                    },

                },
                {
                    Header: '',
                    accessor: 'Update',
                    sortable: false,
                    filterable: false,
                    Cell: (row: any) => {
                        return (

                            <div className="float-left">
                                <Button data-tip data-for='edit-btn' variant="primary" onClick={(e: any) => { this.handleEditRolePermission(row.original) }}>
                                    <i className="fa fa-pencil"></i>
                                </Button>
                                <ReactTooltip id='edit-btn' effect='solid' place='top'>
                                    <span>Edit</span>
                                </ReactTooltip>
                                <Button data-tip data-for='del-btn' variant="primary" onClick={(e: any) => { this.handleDeletePermissions(row.original) }}>
                                    <i className="fa fa-trash red-text"></i>
                                </Button>
                                <ReactTooltip id='del-btn' effect='solid' place='top'>
                                    <span>Delete</span>
                                </ReactTooltip>

                            </div>)
                    }
                },
                ]}

            /></div>
    }

    getModals = () => {
        return <div>

            {/** Role Permission Deletion Modal */}
            <div className="static-modal">
                <Modal show={this.state.permissions.showModal} onHide={() => { this.setState({ permissions: { ...this.state.permissions, showModal: false, toBeDeleted: -1 } }) }}>
                    <Modal.Header>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to delete this role-permission?</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { this.setState({ permissions: { ...this.state.permissions, showModal: false, toBeDeleted: -1 } }) }}>Cancel</Button>
                        <Button bsStyle="danger" onClick={() => { this.setState({ permissions: { ...this.state.permissions, showModal: false, toBeDeleted: -1 } }); this.props.DeleteRolePermission(this.state.permissions.toBeDeleted) }}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    }

    getUpdateModals = () => {
        return <div>
            {/** Role Permission Edit Modal */}
            <div className="static-modal">
                <Modal show={this.state.permissions.isOpen} onHide={() => { this.closePermissionModal() }} bsSize="large">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Role Permission</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modalHeightPermission">
                        <Col md={12}>
                            <Col md={6} className="custom-inputs">
                                <FormGroup controlId="formHorizontalUserRoles">
                                    <ControlLabel>User Roles</ControlLabel>
                                    <FormControl bsClass="form-control" type="text" value={this.state.permissions.selectedUserRole} disabled />
                                </FormGroup>
                            </Col>
                            <Col md={6} className="custom-inputs">
                                <FormGroup controlId="formHorizontalForm">
                                    <ControlLabel>Form</ControlLabel>
                                    <FormControl bsClass="form-control" type="text" value={this.state.permissions.selectedFormType} disabled />
                                </FormGroup>
                            </Col>
                        </Col>
                        <Col md={12}>
                            <ControlLabel>Permissions</ControlLabel>
                        </Col>
                        <Col md={12} className="custom-inputs checkbox-padding">
                            <Col md={2}>
                                <div className="checkbox checkbox-inline custom-checkbox">
                                    <input
                                        id='checkbox6'
                                        type="checkbox"
                                        onChange={this.onSelectAllPermissions}
                                        checked={this.state.permissions.allOption}
                                    />
                                    <label htmlFor='checkbox6' className="custom-label">All</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox1'
                                        type="checkbox"
                                        // name="canView"
                                        onChange={() => this.onChangeCheckbox("canView", !this.state.permissions.canView)}
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canView: !this.state.permissions.canView } })}
                                        checked={this.state.permissions.canView}
                                    />
                                    <label htmlFor='checkbox1' className="custom-label">View</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox2'
                                        type="checkbox"
                                        onChange={() => this.onChangeCheckbox("canInsert", !this.state.permissions.canInsert)}
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canInsert: !this.state.permissions.canInsert } })}
                                        checked={this.state.permissions.canInsert}
                                    />
                                    <label htmlFor='checkbox2' className="custom-label">Insert</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox3'
                                        type="checkbox"
                                        onChange={() => this.onChangeCheckbox("canUpdate", !this.state.permissions.canUpdate)}
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canUpdate: !this.state.permissions.canUpdate } })}
                                        checked={this.state.permissions.canUpdate}
                                    />
                                    <label htmlFor='checkbox3' className="custom-label">Update</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox4'
                                        type="checkbox"
                                        onChange={() => this.onChangeCheckbox("canDelete", !this.state.permissions.canDelete)}
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canDelete: !this.state.permissions.canDelete } })}
                                        checked={this.state.permissions.canDelete}
                                    />
                                    <label htmlFor='checkbox4' className="custom-label">Delete</label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="checkbox checkbox-inline">
                                    <input
                                        id='checkbox5'
                                        type="checkbox"
                                        onChange={() => this.onChangeCheckbox("canExport", !this.state.permissions.canExport)}
                                        // onChange={() => this.setState({ permissions: { ...this.state.permissions, canExport: !this.state.permissions.canExport } })}
                                        checked={this.state.permissions.canExport}
                                    />
                                    <label htmlFor='checkbox5' className="custom-label">Export</label>
                                </div>
                            </Col>
                        </Col>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closePermissionModal}>
                            Close
                            </Button>
                        <Button onClick={this.onSaveEditRolePermission}>
                            Save Changes
                            </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            {/** Role Permission Edit Modal */}
        </div>
    }
    render() {
        console.log("ROLES COMPONENT RENDERED");
        console.log(this.props.rolePermissionList)
        return (
            <div>
                {this.state.permissions.showModal ? this.getModals() : ''}
                {this.state.permissions.isOpen ? this.getUpdateModals() : ''}
                {this.getRolePermissionCard()}
            </div>
        );
    }

    onSelectRoleTab = (tab: any) => {
        this.setState({
            permissions: {
                ...this.state.permissions,
                selectedTab: tab
            }
        })

    }


    getFilteredRolePermissions = (personaId: string) => {
        return this.props.rolePermissionList.filter((item: any) => {
            return item.personaId === personaId;
        })
    }

    getRolePermissionsTabbedComponent = () => {
        let personas = this.props.personas;
        let all_data = this.props.rolePermissionList;
        return <div>
            <Tab.Container
                id="alarm-warning-report"
                activeKey={this.state.permissions.selectedTab}
                onSelect={(k: any) => this.onSelectRoleTab(k)}


            >
                <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs" className="responsiveNav">
                            {
                                personas.map((item: any) => {
                                    return <NavItem eventKey={item.id}>{item.personaName} <Badge>{this.getFilteredRolePermissions(item.personaId).length}</Badge></NavItem>
                                })
                            }
                            <PageSizeSelector classNames={"float-right-2 responsive-mt-20"} changePageSize={this.handlePageSizePermission} selectedPage={this.state.permissions.pageSize} />

                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content animation={false}>
                            {
                                personas.map((item: any) => {
                                    return <Tab.Pane eventKey={item.id}>{this.getRolePermissionsTable(this.getFilteredRolePermissions(item.personaId))}</Tab.Pane>
                                })
                            }



                        </Tab.Content>
                    </Col>

                </Row>
            </Tab.Container>
        </div>
    }
}

const mapStateToProps = (state: RootState) => ({
    roles: state.Settings && state.Settings.persona_roles != null ? state.Settings.persona_roles : [],
    all_roles: state.Settings && state.Settings.roles != null ? state.Settings.roles : [],
    personas: state.Settings && state.Settings.personas != null ? state.Settings.personas : [],
    formsList: state.Settings ? state.Settings.formNames : [],
    isAddingFormName: state.Settings ? state.Settings.isAddingFormName : false,
    userId: state.User ? state.User.UserInfo.userId : '',
    personaPermissionsList: state.Settings && state.Settings.personaPermissionsList != null ? state.Settings.personaPermissionsList : [],
    rolePermissionList: state.Settings && state.Settings.rolePermissionList != null ? state.Settings.rolePermissionList : [],
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions
})
const mapDispatchToProps = {
    getRoles: s_actions.GetRolesListByPersona,
    getRolesList: s_actions.GetRolesList,
    getPersonas: s_actions.GetPersonasList,
    createRolePermission: s_actions.CreateRolePermissions,
    GetRolePermissionList: s_actions.GetRolePermissionsList,
    GetPersonaPermissionsList: s_actions.GetPersonaPermissionsList,
    updateRolePermission: s_actions.UpdateRolePermissions,
    DeleteRolePermission: s_actions.DeleteRolePermission,
}
export default connect(mapStateToProps, mapDispatchToProps)(RolesPermissionsComponent);