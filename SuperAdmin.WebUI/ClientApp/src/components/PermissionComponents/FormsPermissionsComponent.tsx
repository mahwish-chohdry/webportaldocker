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
import { IUserRightsManagementState, IUserPermissions, IFormsPermissions } from 'Interface'
import { connect } from "react-redux";
import * as s_actions from 'action/admin_settings';
import { RootState } from 'reducers';
import { LoaderComponent } from 'components/Loader'
import Pagination from "utils/Pagination";
import ReactTooltip from "react-tooltip";
import PageSizeSelector from "utils/PageSizeSelector";
import { isOptionDisabled, filterCaseInsensitive, textWrapStyle } from "utils";
import { dashboardRoutes } from "constants/routes";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";
import moment from "moment";

class FormsPermissionsComponent extends React.Component<any, IFormsPermissions> {
    constructor(props: any) {
        super(props);
        this.state = {
            errors: {
                selectedFormType: '',
                selectedUserRole: '',
                formName: '',
            },
            forms: {
                formName: '',
                isAddFormDisabled: true,
                showModal: false,
                pageSize: 5,
                toBeDeleted: -1,
                isOpen: false,
                idToBeEdited: -1,
            }
        }
    }

    componentWillMount = () => {
        this.props.GetFormsList()
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return nextProps.render;
    }

    handleInputChange = (e: any) => {
        let errors = {} as any;
        let isAddFormDisabled = false;
        let key: string = e.currentTarget.name;
        let value = e.currentTarget.value;

        if (value.trimLeft().trimRight() === "") {
            errors = { ...this.state.errors, [key]: `Required` };
            isAddFormDisabled = true;

        }
        else {
            errors = { ...this.state.errors, [key]: `` };
            isAddFormDisabled = false;
        }

        this.setState({ errors, forms: { ...this.state.forms, isAddFormDisabled, [key]: e.currentTarget.value } } as Pick<IFormsPermissions, keyof IFormsPermissions>)
    }

    validates = (obj: any) => {
        let errors = {} as any;
        let flag = true;

        let entries = Object.entries(obj);
        entries.forEach((ele: any) => {
            if (ele[1].toString().trimLeft().trimRight() === '') {
                errors[ele[0]] = 'Required';
                flag = false;
            }
        })
        if (!flag)
            this.setState({ errors, forms: { ...this.state.forms, isAddFormDisabled: true } });
        else
            this.setState({ forms: { ...this.state.forms, isAddFormDisabled: false } })

        return flag;
    }

    onAddFormName = (e: any) => {
        e.preventDefault();
        if (!this.validates({ formName: this.state.forms.formName })) {
            toast.warn("Please provide required information", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
        else {
            if (!this.isExistingForm(this.state.forms.formName)) {

                this.props.addFormNames(this.state.forms.formName)
                this.setState({ forms: { ...this.state.forms, formName: '' } });
                e.target.reset();
            }
        }

    }

    isExistingForm = (Selectedform: any) => {
        let existingForm = this.props.formsList.filter((form: any) => form.formName === Selectedform.name);
        if (existingForm.length > 0) {
            return true;
        }
        return false;
    }


    onSelectForm = (Form: any) => {
        let selectedForm = Form.name;
        let { forms } = this.state;
        forms.formName = selectedForm;
        this.setState({ forms });
    }

    getFormCard = () => {
        let tempRoutes = JSON.stringify(dashboardRoutes);
        let sortedRoutes = JSON.parse(tempRoutes);
        sortedRoutes = sortedRoutes.sort(function (a: any, b: any) {
            return a.name > b.name ? 1 : -1;
        })
        return <div> <Row className="mt-5percent">
            <Col md={12}>

                <div className="addFormName">
                    <form id="user-rights-form" onSubmit={this.onAddFormName}>
                        <Col md={12} className="custom-inputs">
                            <Col md={4} xs={12} className="mr-20">
                                <DropdownToolTip
                                    title={this.state.forms.formName !== '' ? this.state.forms.formName : 'Select Form'}
                                    id={`split-button-management-addForm-formName`}
                                    className={"dropdown-70 text-cut"}
                                    list={sortedRoutes}
                                    onSelectOption={this.onSelectForm}
                                    tooltipID={'administration-management-addForm-formName'}
                                    label={'Form Name'}
                                    direction={"bottom"}
                                    required={true}
                                    menuItemIdkey={"name"}
                                    menuItemIdName={"name"}
                                    canDisableOptions={true}
                                    disableOptionFunc={this.isExistingForm}
                                >
                                </DropdownToolTip>
                            </Col>
                            <Col md={3} xs={12} className="custom-inputs margin-top-btn">
                                <Button fill className="buttonColor responsive_FormsBtn" id="submit" type="submit" disabled={this.state.forms.formName === '' ? true : false}>
                                    Add Form Name
                                        </Button>
                            </Col>
                            <Col>
                                {this.props.isAddingFormName ? <LoaderComponent /> : ''}
                            </Col>
                        </Col>
                    </form>
                    <Row className="mt-5percent">
                        <Col md={12}>
                            {this.props.formsList && this.props.formsList.length ? this.getFormNameTable() : ''}
                        </Col>
                    </Row>
                </div>


            </Col>
        </Row></div>
    }




    allPropsExist = () => {
        return this.props.all_roles && this.props.all_roles.length &&
            this.props.personas && this.props.personas.length &&
            this.props.formsList && this.props.formsList.length;
    }

    handlePageSizeFormName = (newPageSize: number) => {
        this.setState({ forms: { ...this.state.forms, pageSize: newPageSize } })
    }

    handleEditFormName = (data: any) => {
        this.setState({
            forms: {
                ...this.state.forms,
                formName: data.formName,
                idToBeEdited: data.id,
                isOpen: true
            }
        })
    }


    handleDeleteForm = (data: any) => {
        this.setState({ forms: { ...this.state.forms, showModal: true, toBeDeleted: data.id } })
    }


    closeFormNameModal = () => {
        this.setState({
            forms: {
                ...this.state.forms,
                isOpen: false,
                formName: '',
                idToBeEdited: -1,
                isAddFormDisabled: true,
            }, errors: { ...this.state.errors, formName: '' }
        });
    }


    onSaveEditFormName = () => {

        if (!this.validates({ formName: this.state.forms.formName })) {
            toast.warn("Please provide required information", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
        else {
            if (!this.isExistingForm(this.state.forms.formName)) {
                let forms = this.state.forms;
                let data = {
                    formId: forms.idToBeEdited,
                    formName: forms.formName,
                };

                this.props.updateFormName(data);
                this.closeFormNameModal();
            }
        }
    }



    getFormNameTable = () => {
        let formsListData = this.props.formsList
        return <div>

            <Row>
                <Col><PageSizeSelector classNames={"float-right-2 mr-20 mb-20"} changePageSize={this.handlePageSizeFormName} selectedPage={this.state.forms.pageSize} />
                </Col></Row>
            <ReactTable
                data={formsListData}
                noDataText={"No Data Available"}
                minRows={1}
                PaginationComponent={Pagination}
                showPagination={formsListData.length > 5 ? true : false}
                defaultPageSize={5}
                pageSize={this.state.forms.pageSize}
                className="-highlight"
                defaultFilterMethod={filterCaseInsensitive}
                columns={[{
                    Header: () => (
                        <span className='sortable'>Form Name
                        </span>
                    ),
                    accessor: 'formName',
                    minWidth: 150,
                    sortable: true,
                    width: 250,
                    filterable: true,
                    style: textWrapStyle

                },
                {
                    Header: () => (
                        <span >Is Active
                        </span>
                    ),
                    accessor: 'isActive',
                    minWidth: 150,
                    width: 250,
                    Cell: (row: any) => {
                        return (<input type="checkbox" disabled defaultChecked={false} checked={row.original.isActive} />)
                    },

                },
                {
                    Header: () => (
                        <span className='sortable' >Created on
                        </span>
                    ),
                    minWidth: 150,
                    width: 250,
                    style: textWrapStyle,
                    sortable: true,
                    id: 'createdDate',
                    accessor: (d: any) => {
                        /* convert to timestamp */
                        let timestamp = '';

                        if (d.createdDate != null) {
                            timestamp = moment(d.createdDate).format('x');
                        }
                        return timestamp;
                    },
                    Cell: (row: any) => {
                        //
                        // convert timestamp again to date for display
                        if (!row.original.createdDate) return '';
                        let displayString = moment(row.original.createdDate).format('MM/DD/YYYY');
                        return displayString;
                    },
                    defaultSortDesc: true,
                    filterMethod: (data: any, row: any, col: any) => {
                        if (moment(data.value).isValid()) {
                            let timestamp1 = moment(data.value).format('x');
                            let timestamp2 = moment(row._original.createdDate).format('L');
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

                            <div className="float-left">
                                <Button data-tip data-for='edit-btn' variant="primary" onClick={(e: any) => { this.handleEditFormName(row.original) }}>
                                    <i className="fa fa-pencil"></i>
                                </Button>
                                <ReactTooltip id='edit-btn' effect='solid' place='top'>
                                    <span>Edit</span>
                                </ReactTooltip>
                                <Button data-tip data-for='del-btn' variant="primary" onClick={(e: any) => { this.handleDeleteForm(row.original) }}>
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
            {/** Form Deletion Modal */}
            <div className="static-modal">
                <Modal show={this.state.forms.showModal} onHide={() => { this.setState({ forms: { ...this.state.forms, showModal: false, toBeDeleted: -1 } }) }}>
                    <Modal.Header>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to delete this form?</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { this.setState({ forms: { ...this.state.forms, showModal: false, toBeDeleted: -1 } }) }}>Cancel</Button>
                        <Button bsStyle="danger" onClick={() => { this.setState({ forms: { ...this.state.forms, showModal: false, toBeDeleted: -1 } }); this.props.DeleteForm(this.state.forms.toBeDeleted) }}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    }

    getUpdateModals = () => {
        return <div>

            {/** FormName Modal */}
            <div className="static-modal">
                <Modal show={this.state.forms.isOpen} onHide={() => { this.closeFormNameModal() }} bsSize="large">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Form Name</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={12}>
                                <Col md={6} className="custom-inputs">
                                    <FormGroup className="inputMargin">
                                        <ControlLabel>Form name<span className="error">*</span></ControlLabel>
                                        <FormControl type="text" name="formName" placeholder="Form Name" value={this.state.forms.formName} onChange={this.handleInputChange} />
                                        <span className="error" >{this.state.errors.formName}</span>
                                    </FormGroup>
                                </Col>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeFormNameModal}>
                            Close
                            </Button>
                        <Button onClick={this.onSaveEditFormName} disabled={this.state.forms.isAddFormDisabled}>
                            Save Changes
                            </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            {/** FormName Edit Modal */}
        </div>
    }
    render() {
        console.log("FORMS COMPONENT RENDERED");
        return (
            <div>
                {this.state.forms.showModal ? this.getModals() : ''}
                {this.state.forms.isOpen ? this.getUpdateModals() : ''}
                {this.getFormCard()}
            </div>
        );
    }

}

const mapStateToProps = (state: RootState) => ({
    formsList: state.Settings ? state.Settings.formNames : [],
    isAddingFormName: state.Settings ? state.Settings.isAddingFormName : false,
    userId: state.User ? state.User.UserInfo.userId : '',
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions
})

const mapDispatchToProps = {
    addFormNames: s_actions.AddFormNames,
    GetFormsList: s_actions.GetFormsList,
    updateFormName: s_actions.UpdateFormName,
    DeleteForm: s_actions.DeleteForm,
}
export default connect(mapStateToProps, mapDispatchToProps)(FormsPermissionsComponent);