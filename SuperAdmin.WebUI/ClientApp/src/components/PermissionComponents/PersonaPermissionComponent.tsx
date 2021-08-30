import React from "react";
import {
    Grid,
    Row,
    Col,
    SplitButton,
    FormGroup,
    ControlLabel,
    FormControl,
    MenuItem,
    Tab,
    Nav,
    NavItem,
    Modal,
    Badge,
    ButtonToolbar,
    DropdownButton
} from "react-bootstrap";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { toast } from 'react-toastify';
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { IUserPermissions, IPersonaPermissions } from 'Interface'
import { connect } from "react-redux";
import * as actions from 'action/company';
import * as s_actions from 'action/admin_settings';
import { RootState } from 'reducers';
import { LoaderComponent } from 'components/Loader'
import Pagination from "utils/Pagination";
import ReactTooltip from "react-tooltip";
import PageSizeSelector from "utils/PageSizeSelector";
import { isOptionDisabled, isPermittedComponent, filterCaseInsensitive, textWrapStyle } from "utils";
import { dashboardRoutes } from "constants/routes";
import { NOT_ALLOWED } from "constants/index";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";
import moment from "moment";

class PersonaPermissionsComponent extends React.Component<any, { persona: IPersonaPermissions }> {
    constructor(props: any) {
        super(props);
        this.state = {
            persona: {
                selectedPersonaId: { id: -1, name: '' },
                selectedFormId: { id: -1, name: '' },
                isDisabled: true,
                pageSize: 5,
                showModal: false,
                toBeDeleted: -1,
                isOpen: false,
                idToBeEdited: -1,
                selectedTab: this.props.personas && this.props.personas.length ? this.props.personas[0].id : 1

            }
        }
    }



    shouldComponentUpdate(nextProps: any, nextState: any) {
        return nextProps.render;
    }


    componentWillMount = () => {
        if (this.props.personas && this.props.personas.length === 0)
            this.props.getPersonas()
        if (this.props.all_roles && this.props.all_roles.length === 0)
            this.props.getRolesList()

        if (this.props.personaPermissionsList && this.props.personaPermissionsList.length === 0)
            this.props.GetPersonaPermissionsList();

    }

    getPersonaButtonState = () => {
        return this.state.persona.selectedFormId.id === -1 || this.state.persona.selectedPersonaId.id === -1;
    }



    createPersonaPermission = () => {
        const { selectedFormId, selectedPersonaId } = this.state.persona;
        let data = {
            Id: 0,
            Form: selectedFormId,
            Persona: selectedPersonaId,
            // createdBy:  this.props.userId
        };
        this.setState({
            persona: {
                ...this.state.persona,
                selectedFormId: { id: -1, name: '' },
                // selectedPersonaId: { id: -1, name: '' },
            }
        }, () => {
            this.props.createPersonaPermission(data)
        })
    }

    IsPersonaFormOptionDisabled = (form: any) => {
        let formId = form.id
        let disabledFlag = isOptionDisabled(this.props.personaPermissionsList,
            this.state.persona.selectedPersonaId.id,
            formId,
            'personaId', 'formId');
        return disabledFlag;
    }



    getPersonaPermissionCard = () => {
        let formTypes = this.props.formsList;
        return <div> <Row className="mt-5percent">
            <Col md={12}>
                <Col md={4} xs={12} className="responsive_marginBottom">
                    <DropdownToolTip
                        title={this.state.persona.selectedPersonaId.id !== -1 ? this.state.persona.selectedPersonaId.name : 'Select Persona'}
                        id={`split-button-management-personaPermission-persona`}
                        className={"dropdown-70 text-cut"}
                        list={this.props.personas}
                        onSelectOption={(item: any) => this.setState({ persona: { ...this.state.persona, selectedPersonaId: { id: item.id, name: item.personaName }, selectedFormId: { id: -1, name: '' } } })}
                        tooltipID={'administration-management-personaPermission-persona'}
                        label={'Persona'}
                        direction={"bottom"}
                        required={true}
                        menuItemIdkey={"id"}
                        menuItemIdName={"personaName"}
                    >
                    </DropdownToolTip>
                </Col>
                <Col md={4} xs={12} className="responsive_marginBottom">
                    <DropdownToolTip
                        title={this.state.persona.selectedFormId.id !== -1 ? this.state.persona.selectedFormId.name : 'Select Form Type'}
                        id={`split-button-management-personaPermission-Form`}
                        className={"dropdown-70 text-cut"}
                        list={formTypes && formTypes}
                        onSelectOption={(item: any) => this.setState({ persona: { ...this.state.persona, selectedFormId: { id: item.id, name: item.formName } } })}
                        tooltipID={'administration-management-personaPermission-Form'}
                        label={'Form'}
                        direction={"bottom"}
                        required={true}
                        menuItemIdkey={"id"}
                        menuItemIdName={"formName"}
                        canDisableOptions={true}
                        disableOptionFunc={this.IsPersonaFormOptionDisabled}
                    >
                    </DropdownToolTip>
                </Col>

                <Col md={3} xs={12} className="custom-inputs mt-10">
                    <Col className="custom-inputs companyAddButton">
                        <Button fill className="buttonColor responsive_FormsBtn" id="submit" type="submit" disabled={this.getPersonaButtonState() ? true : false} onClick={() => this.createPersonaPermission()}>
                            Create Permissions
                            </Button>
                    </Col>

                </Col>

                <Col>
                    {this.props.isCreatingPersonaPermission ? <LoaderComponent /> : ''}
                </Col>

                <div className="clearfix" />

            </Col>
        </Row>

            <Row className="mt-5percent">
                <Col md={12}>
                    {this.allPropsExist() &&
                        this.props.personaPermissionsList &&
                        this.props.personaPermissionsList.length ? this.getPersonaPermissionsTabbedComponent() : ''}
                </Col>

            </Row>
        </div>
    }

    allPropsExist = () => {
        return this.props.all_roles && this.props.all_roles.length &&
            this.props.personas && this.props.personas.length &&
            this.props.formsList && this.props.formsList.length;
    }

    handlePageSize = (newPageSize: number) => {
        this.setState({ persona: { ...this.state.persona, pageSize: newPageSize } })
    }


    handleDeletePersonaPermission = (data: any) => {
        this.setState({ persona: { ...this.state.persona, showModal: true, toBeDeleted: data.id } })
    }

    handleEditPersonaPermission = (data: any) => {
        this.setState({
            persona: {
                ...this.state.persona,
                selectedPersonaId: {
                    id: data.personaId,
                    name: data.personaName
                },
                selectedFormId: {
                    id: data.formId,
                    name: data.formName,
                },
                idToBeEdited: data.id,
                isOpen: true
            }
        })
    }


    closeDeletionModal = () => {
        this.setState({ persona: { ...this.state.persona, showModal: false, toBeDeleted: -1 } });
    }


    closePersonaPermissionModal = () => {
        this.setState({
            persona: {
                ...this.state.persona,
                isOpen: false,
                selectedPersonaId: { id: -1, name: '' },
                selectedFormId: { id: -1, name: '' },
                idToBeEdited: -1,
                isDisabled: true,
            }
        });
    }


    onSaveEditPersonaPermission = () => {
        let persona = this.state.persona
        let data = {
            Id: persona.idToBeEdited,
            formId: persona.selectedFormId.id,
            personaId: persona.selectedPersonaId.id,
        };

        this.props.updatePersona(data);
        this.closePersonaPermissionModal();
    }



    getPersonaPermissionsTable = (data: any) => {
        // let personaPermissionsData = this.props.personaPermissionsList;
        let personaPermissionsData = data;
        return <div>


            <ReactTable
                data={personaPermissionsData}
                noDataText={"No Data Available"}
                minRows={1}
                PaginationComponent={Pagination}
                showPagination={personaPermissionsData.length > 5 ? true : false}
                defaultPageSize={5}
                pageSize={this.state.persona.pageSize}
                className="-highlight"
                defaultFilterMethod={filterCaseInsensitive}
                columns={[{
                    Header: () => (
                        <span>Persona
                        </span>
                    ),
                    accessor: 'personaName',
                    minWidth: 150,
                    width: 200

                },
                {
                    Header: () => (
                        <span >Form
                        </span>
                    ),
                    accessor: 'formName',
                    minWidth: 150,
                    width: 200,
                    filterable: true,
                    style: textWrapStyle

                },
                {
                    Header: '',
                    accessor: 'Update',
                    sortable: false,
                    filterable: false,
                    Cell: (row: any) => {
                        return (
                            <div className="float-left">
                                <Button data-tip data-for='edit-btn' variant="primary" onClick={(e: any) => { this.handleEditPersonaPermission(row.original) }}>
                                    <i className="fa fa-pencil"></i>
                                </Button>
                                <ReactTooltip id='edit-btn' effect='solid' place='top'>
                                    <span>Edit</span>
                                </ReactTooltip>
                                <Button data-tip data-for='del-btn' variant="primary" onClick={(e: any) => { this.handleDeletePersonaPermission(row.original) }}>
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
            {/** Persona Permission Deletion Modal */}
            <div className="static-modal">
                <Modal show={this.state.persona.showModal} onHide={() => { this.closeDeletionModal() }}>
                    <Modal.Header>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to delete this persona permission?</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { this.closeDeletionModal() }}>Cancel</Button>
                        <Button bsStyle="danger" onClick={() => { this.closeDeletionModal(); this.props.DeletePersonaPermission(this.state.persona.toBeDeleted) }}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    }

    getUpdateModals = () => {
        return <div>
            {/** Persona Permission Edit Modal */}
            <div className="static-modal">
                <Modal show={this.state.persona.isOpen} onHide={() => { this.closePersonaPermissionModal() }} bsSize="large">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Persona Permission</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modalHeightPermission">
                        <Col md={12}>
                            <Col md={6} className="custom-inputs">
                                <FormGroup controlId="formHorizontalUserRoles">
                                    <ControlLabel>Persona</ControlLabel>
                                    <FormControl bsClass="form-control" type="text" value={this.state.persona.selectedPersonaId.name} disabled />
                                </FormGroup>
                            </Col>
                            <Col md={6} className="custom-inputs custom-dropdown responsive_marginBottom">
                                <DropdownToolTip
                                    title={this.state.persona.selectedFormId.id !== -1 ? this.state.persona.selectedFormId.name : 'Select Form Type'}
                                    id={`split-button-usermanagement-persona-form`}
                                    className={"dropdown-50 text-cut"}
                                    list={this.props.formsList}
                                    onSelectOption={(item: any) => this.setState({ persona: { ...this.state.persona, selectedFormId: { id: item.id, name: item.formName }, isDisabled: false } })}
                                    tooltipID={'administration-usermanagement-persona-form'}
                                    label={'Form'}
                                    direction={"bottom"}
                                    required={true}
                                    menuItemIdkey={"id"}
                                    menuItemIdName={"formName"}
                                    canDisableOptions={true}
                                    disableOptionFunc={this.IsPersonaFormOptionDisabled}
                                >
                                </DropdownToolTip>
                            </Col>
                        </Col>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closePersonaPermissionModal}>
                            Close
                            </Button>
                        <Button onClick={this.onSaveEditPersonaPermission} disabled={this.state.persona.isDisabled}>
                            Save Changes
                            </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            {/** Persona Permission Edit Modal */}

        </div>
    }
    render() {
        console.log("PERSONA PERMISSIONS RENDERED");
        return (
            <div>
                {this.state.persona.showModal? this.getModals():''}
                {this.state.persona.isOpen? this.getUpdateModals():''}
                {this.getPersonaPermissionCard()}
            </div>
        );
    }


    onSelectPersonaTab = (tab: any) => {
        this.setState({
            persona: {
                ...this.state.persona,
                selectedTab: tab
            }
        })

    }


    getPersonaPermissionsTabbedComponent = () => {
        let personas = this.props.personas;
        let all_data = this.props.personaPermissionsList;
        return <div>
            <Tab.Container
                id="alarm-warning-report"
                activeKey={this.state.persona.selectedTab}
                onSelect={(k: any) => this.onSelectPersonaTab(k)}


            >
                <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs" className="responsiveNav">
                            {
                                personas.map((item: any) => {
                                    return <NavItem eventKey={item.id}>{item.personaName} <Badge>{this.getFilteredPersonaPermissions(item.id).length}</Badge></NavItem>
                                })
                            }
                            <PageSizeSelector classNames={"float-right-2 responsive-mt-20"} changePageSize={this.handlePageSize} selectedPage={this.state.persona.pageSize} />

                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content animation={false}>
                            {
                                personas.map((item: any) => {
                                    return <Tab.Pane eventKey={item.id}>{this.getPersonaPermissionsTable(this.getFilteredPersonaPermissions(item.id))}</Tab.Pane>
                                })
                            }



                        </Tab.Content>
                    </Col>

                </Row>
            </Tab.Container>
        </div>
    }

    getFilteredPersonaPermissions = (personaId: number) => {
        return this.props.personaPermissionsList.filter((item: any) => {
            return item.personaId === personaId;
        })
    }

}

const mapStateToProps = (state: RootState) => ({
    roles: state.Settings && state.Settings.persona_roles != null ? state.Settings.persona_roles : [],
    all_roles: state.Settings && state.Settings.roles != null ? state.Settings.roles : [],
    personas: state.Settings && state.Settings.personas != null ? state.Settings.personas : [],
    formsList: state.Settings ? state.Settings.formNames : [],
    isCreatingPersonaPermission: state.Settings ? state.Settings.isCreatingPersona : false,
    userId: state.User ? state.User.UserInfo.userId : '',
    personaPermissionsList: state.Settings && state.Settings.personaPermissionsList != null ? state.Settings.personaPermissionsList : [],
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions
})
const mapDispatchToProps = {
    getRoles: s_actions.GetRolesListByPersona,
    getRolesList: s_actions.GetRolesList,
    getPersonas: s_actions.GetPersonasList,
    createPersonaPermission: s_actions.CreatePersonaPermissions,
    GetPersonaPermissionsList: s_actions.GetPersonaPermissionsList,
    DeletePersonaPermission: s_actions.DeletePersonaPermission,
    updatePersona: s_actions.UpdatePersonaPermissions,
}
export default connect(mapStateToProps, mapDispatchToProps)(PersonaPermissionsComponent);