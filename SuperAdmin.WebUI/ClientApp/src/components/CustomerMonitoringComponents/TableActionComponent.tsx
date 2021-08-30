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
import * as actions from 'action/company';
import * as s_actions from 'action/admin_settings';
import { ICompany, IUser, ICompanyProps, IUserPermissions, ITableActionsProps } from 'Interface';
import { toast } from 'react-toastify';
import Button from "components/CustomButton/CustomButton.jsx";
import { RootState } from 'reducers';
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";


class TableActionComponent extends React.Component<ITableActionsProps, any> {
    constructor(props: ITableActionsProps) {
        super(props);
        this.state = {
            customerType: '',
            showModal: false,
            showUserModal: false,
            errors: {
                customer_name: '',
                customer_address: '',
                user_firstName: '',
                user_lastName: '',
                user_emailAddress: ''
            },
            isDisabled: false,
            sort: [],
            pageSize: 5,
            userProfile: {
                customerId: '',
                firstName: '',
                lastName: '',
                emailAddress: '',
                roleType: this.props.persona_roles && this.props.persona_roles.length ? this.props.persona_roles[0].role1 : 'Select Role', //  by default
                roleId: this.props.persona_roles.length ? this.props.persona_roles[0].id : -1
            },
            user:{
                name:'',
                address:'',
                id: -1,
                customerType: ''
            },
        };
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
       return true;
    }

    removeErrors = () => {
        let errors = {
            customer_name: '',
            customer_address: '',
            user_firstName: '',
            user_lastName: '',
            user_emailAddress: ''
        }
        this.setState({ errors })
    }

    handleShow = (e: any, data: any) => {
        this.removeErrors();
        this.setState({
            showModal: true,
            showUserModal: false,
            customerType: data.original.customerType,
            user:{

                address: data.original.address,
                name: data.original.name,
                id: data.original.id,
                customerType: data.original.customerType
            }
           
        });
    }

    handleUserProfileShow = (e: any, data: any) => {
        this.removeErrors();
        let company = data.original;
        this.props.getRolesByPersona(company.customerType);
        this.setState({
            showUserModal: true,
            showModal: true,
            userProfile: {
                ...this.state.userProfile,
                customerId: company.customerId,
                firstName: '',
                lastName: '',
                emailAddress: '',
                personaType: company.customerType

            },
            isDisabled: true

        });
    }

    handleClose = () => {

        this.removeErrors();
        this.setState({
            showModal: false, userProfile: {
                customerId: '',
                firstName: '',
                lastName: '',
                emailAddress: '',
                roleType: 'Select Role',
                roleId: -1
            }
        })
    }

    handleInputChange = (e: any) => {
        let errors = {} as any;
        let isDisabled = false;
        let key: string = e.currentTarget.name;
        let value = e.currentTarget.value;
        if (key.includes("user_")) {
            let temp_key = key.split('_')[1];
            if (value.trimLeft().trimRight() === "") {
                errors = { ...this.state.errors, [key]: `Required` };
                isDisabled = true;
            }
            else {
                errors = { ...this.state.errors, [key]: `` };
                isDisabled = false;
            }
            this.setState({
                userProfile: {
                    ...this.state.userProfile,
                    [temp_key]: value
                },
                errors, isDisabled,
                componentPermissions: {...this.props.componentPermissions}
            } as Pick<ICompany, keyof ICompany>)
        }
        else if(key.includes("customer_")){
            let temp_key = key.split('_')[1];
            if (value.trimLeft().trimRight() === "") {
                errors = { ...this.state.errors, [key]: `Required` };
                isDisabled = true;
            }
            else {
                errors = { ...this.state.errors, [key]: `` };
                isDisabled = false;
            }
            this.setState({
                user: {
                    ...this.state.user,
                    [temp_key]: value
                },
                errors, isDisabled,
                componentPermissions: {...this.props.componentPermissions}
            } as Pick<ICompany, keyof ICompany>)
        }
        else {


            if (value.trimLeft().trimRight() === "") {
                errors = { ...this.state.errors, [key]: `Required` };
                isDisabled = true;
            }
            else {
                errors = { ...this.state.errors, [key]: `` };
                isDisabled = false;
            }
            this.setState({ [key]: value, errors, isDisabled } as Pick<ICompany, keyof ICompany>)
        }
    }

    validates = (updatedItem: ICompany | any) => {
        let errors = {} as any;
        let flag = true;

        let entries = Object.entries(updatedItem);
        entries.forEach(ele => {
            let val = ele[1] as string;
            if (val.toString().trimLeft().trimRight() === '') {
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

    handleSave = (e: any) => {
        if (this.validates(this.state.user))
            this.props.updateCompany(this.state.user);

        this.setState({ showModal: false })
        
    }

    handleUserSave = (e: any) => {
        this.setState({ showModal: false, showUserModal: false })
        if (this.validates(this.state.userProfile)) {
            let data = {
                userId: this.props.userId,
                customerId: this.state.userProfile.customerId,
                roleType: this.state.userProfile.roleType,
                roleId: this.state.userProfile.roleId,
                firstName: this.state.userProfile.firstName,
                lastName: this.state.userProfile.lastName,
                emailAddress: this.state.userProfile.emailAddress,
                lang: 'en'
            };
              

            this.props.AddUserProfile(data)

        }
        else {
            toast.warn("Please enter all required values")
        }

    }


    getEditUserModal = () => {
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormGroup controlId="formHorizontalCustomeType">
                                <ControlLabel>Type</ControlLabel>
                                    <FormControl bsClass="form-control" type="text" placeholder="Type" name="customer_customerType" value={this.state.user.customerType} disabled={true} />
                                    <span className="error" >{this.state.errors.customer_customerType}</span>
                            </FormGroup>
                            <FormGroup controlId="formHorizontalEmail">
                                <ControlLabel>Name</ControlLabel>
                                    <FormControl bsClass="form-control" type="text" placeholder="Company Name" name="customer_name" value={this.state.user.name} onChange={this.handleInputChange} />
                                    <span className="error" >{this.state.errors.customer_name}</span>
                            </FormGroup>
                            <FormGroup controlId="formHorizontalPassword">
                                <ControlLabel>Address</ControlLabel>

                                <FormControl bsClass="form-control" type="text" placeholder="Address" name="customer_address" value={this.state.user.address} onChange={this.handleInputChange} />
                                <span className="error" >{this.state.errors.customer_address}</span>

                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Cancel
                            </Button>
                            <Button className="buttonColor" onClick={this.handleSave} disabled={this.state.isDisabled ? true : false}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
            </div>
        )

    }

    getUserProfileModal = () => {
        return (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
                    <Modal.Title>Add User Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="ml-0">
                    <Col md={12} className="custom-inputs mb-15 custom-dropdown">
                    <DropdownToolTip
                        title={this.state.userProfile.roleType !== '' ? this.state.userProfile.roleType : 'Select User Type'}
                        id={`split-button-admin-monitorUser-UserTypes`}
                        className={"dropdown-50 text-cut"}
                        list={this.props.persona_roles}
                        onSelectOption={(item : any) => this.setState({ userProfile: { ...this.state.userProfile, roleType: item.role1 } })}
                        tooltipID={'admin-monitorUser-UserTypes'}  
                        label={'User Type'}
                        direction={"bottom"}
                        required={false}
                        menuItemIdkey = {"id"}
                        menuItemIdName = {"role1"}
                        >
                    </DropdownToolTip>
                    </Col>
                    <Col md={12} className="custom-inputs">
                        <Col md={6} className="custom-inputs">
                            <FormGroup >
                                <ControlLabel>First Name<span className="error">*</span></ControlLabel>
                                    <FormControl bsClass="form-control" type="text" placeholder="First Name" name="user_firstName" value={this.state.userProfile.firstName} onChange={this.handleInputChange} />
                                    <span className="error" >{this.state.errors.user_firstName}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6} className="custom-inputs">
                                <FormGroup>
                                    <ControlLabel>Last Name<span className="error">*</span></ControlLabel>
                                    <FormControl bsClass="form-control" type="text" placeholder="Last Name" name="user_lastName" value={this.state.userProfile.lastName} onChange={this.handleInputChange} />
                                    <span className="error" >{this.state.errors.user_lastName}</span>
                                </FormGroup>
                            </Col>
                            <Col md={12} className="custom-inputs">
                                <FormGroup>
                                    <ControlLabel>Email Address<span className="error">*</span></ControlLabel>

                                    <FormControl bsClass="form-control" type="email" placeholder="Email Address" name="user_emailAddress" value={this.state.userProfile.emailAddress} onChange={this.handleInputChange} />
                                    <span className="error" >{this.state.errors.user_emailAddress}</span>
                                </FormGroup>
                            </Col>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button className="buttonColor" onClick={this.handleUserSave} disabled={this.state.isDisabled ? true : false}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        let {row, addUserProfilePermission, updatePermission, showDevicePermission, registerDevicePermission  } = this.props;
        return (
            <div>
                <div>
                {/* add user profile button */}
                    <Button 
                        data-tip 
                        data-for='add-btn' 
                        variant="primary" 
                        onClick={(e: any) => this.handleUserProfileShow(e, row)}
                        className={!addUserProfilePermission ? 'd-none' : 'd-block'}
                        disabled={!addUserProfilePermission  ? true : false}
                        >
                        <i className="fa fa-plus"></i>
                    </Button>
                    <ReactTooltip id='add-btn' effect='solid' place='top'>
                        <span>Add User Profile</span>
                    </ReactTooltip>
                    {/* Edit User button */}
                    <Button data-tip 
                        data-for='edit-btn'
                        variant="primary" 
                        onClick={(e: any) => this.handleShow(e, row)}
                        className={!(updatePermission) ? 'd-none' : 'd-block'}
                        disabled={!(updatePermission) ? true : false}>
                        <i className="fa fa-pencil"></i>
                    </Button>
                    <ReactTooltip id='edit-btn' effect='solid' place='top'>
                        <span>Edit</span>
                    </ReactTooltip>
                </div>
                {this.state.showModal ? this.state.showUserModal === false ? this.getEditUserModal() : this.getUserProfileModal() : ''}
        </div>
        );
    }

}

const mapStateToProps = (state: RootState) => ({
    userId: state.User ? state.User.UserInfo.userId : '',
    persona_roles: state.Settings ? state.Settings.persona_roles : [],
})

const mapDispatchToProps = {
    updateCompany: actions.UpdateCompany,
    AddUserProfile: actions.AddUserProfile,
    getRolesByPersona: s_actions.GetRolesListByPersona,
}
export default connect(mapStateToProps, mapDispatchToProps)(TableActionComponent);