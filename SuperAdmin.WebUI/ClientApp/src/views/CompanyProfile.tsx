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
    DropdownButton,
} from "react-bootstrap";
import ReactTable from "react-table";
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
import { LoaderComponent } from 'components/Loader'
import { isPermittedComponent } from "utils";
import { dashboardRoutes } from "constants/routes";
import { NOT_ALLOWED, USER_NAME_MAX_LENGTH } from "constants/index";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip";

class Company extends React.Component<ICompanyProps, ICompany> {
    constructor(props: ICompanyProps) {
        super(props);
        this.state = this.getInitialState();
    }

    componentWillMount = () => {
        this.props.getPersonas();
    }
    getInitialState = () => {
        return {
            customerType: this.props.personas && this.props.personas.length ? this.props.personas[0].personaName : 'Select User Type',
            name: '',
            address: '',
            admin: {
                firstName: '',
                lastName: '',
                email: ''
            },
            errors: {
                name: '',
                address: '',
                email: '',
                firstName: '',
                lastName: '',
                customerType: ''
            },
            isDisabled: true,
        } as ICompany;
    }


    handleInputChange = (e: any) => {
        let errors = {} as any;
        let isDisabled = false;
        let key: string = e.currentTarget.name;
        let value = e.currentTarget.value;

        if (value.trimLeft().trimRight() === "") {
            errors = { ...this.state.errors, [key]: `Required` };
            isDisabled = true;
        }
        else {
            errors = { ...this.state.errors, [key]: `` };
            isDisabled = false;
        }

        if (this.state.admin && Object.keys(this.state.admin).includes(key)) {
            let userObj: any = { ...this.state.admin };
            userObj[key] = value.trimLeft().trimRight();


            this.setState({ admin: userObj, errors, isDisabled })
        } else {
            this.setState({ [key]: e.currentTarget.value.trimLeft().trimRight(), errors, isDisabled } as Pick<ICompany, keyof ICompany>)
        }
    }

    getCompanyObject = () => {
        return {
            name: this.state.name,
            address: this.state.address,
            email: this.state.admin ? this.state.admin.email : '',
            firstName: this.state.admin ? this.state.admin.firstName : '',
            lastName: this.state.admin ? this.state.admin.lastName : '',
            customerType: this.state.customerType
        };
    }


    handleSubmit = (e: any) => {
        e.preventDefault()
        if (!this.validates(this.getCompanyObject())) {
            toast.warn("Please provide required information", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
        else {
            this.props.AddCompany(this.state)
            this.setState(this.getInitialState())
            e.target.reset();
        }

    }


    onSelectCompanyType = (persona: any) => {
        let selectedName = persona.personaId;
        this.setState({
            customerType: selectedName,
        });
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
            this.setState({ errors, isDisabled: true });
        else
            this.setState({ isDisabled: false })

        return flag;
    }

    getValidationState(parentObj: any, key: string, textLength: number) {


        const length = parentObj[key] && parentObj[key].length;
        if (length && length > textLength) return 'error';
        return null;
    }

    isButtonDisabled = () => {
        let { name, address, admin, customerType } = this.state;
        return customerType === '' ||
            name === '' ||
            address === '' ||
            admin === undefined || admin.firstName === '' || admin.lastName === '' || admin.email === '';
    }

    render() {
        return (
            <div className="content not-permitted">
                <Grid fluid>
                    {this.props.componentPermissions && this.props.componentPermissions.canInsert ? '' : this.noPermissionOverlay("Sorry, You don't have permission to add new user")}
                    <Row>
                        <Col md={12}>



                            <Card
                                title="Create User"
                                content={

                                    <form onSubmit={this.handleSubmit}>

                                        <Col md={12} xs={12} className="custom-inputs">
                                            <Col md={6} xs={12} className="custom-inputs">
                                                <FormGroup className="inputMargin" validationState={this.getValidationState(this.state, 'name', 50)}>
                                                    <ControlLabel>User Name<span className="error">*</span></ControlLabel>
                                                    <FormControl maxLength={USER_NAME_MAX_LENGTH} type="text" name="name" placeholder="User name" onInput={this.handleInputChange} />
                                                    <span className="error" >{this.state.errors.name}</span>
                                                    <FormControl.Feedback />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6} xs={12}>
                                                <DropdownToolTip
                                                    title={this.state.customerType !== '' ? this.state.customerType : 'Select User Type'}
                                                    id={`split-button-addUsers-userType`}
                                                    className={"dropdown-50 text-cut"}
                                                    list={this.props.personas}
                                                    onSelectOption={this.onSelectCompanyType}
                                                    tooltipID={'administration-addUsers-userType'}
                                                    label={'User Type'}
                                                    direction={"bottom"}
                                                    required={true}
                                                    menuItemIdkey={"personaId"}
                                                    menuItemIdName={"personaName"}
                                                >
                                                </DropdownToolTip>
                                            </Col>
                                        </Col>
                                        <Col md={12} xs={12} className="custom-inputs">
                                            <FormGroup className="inputMargin" validationState={this.getValidationState(this.state, 'address', 200)}>
                                                <ControlLabel>Address<span className="error">*</span></ControlLabel>
                                                <FormControl type="text" name="address" placeholder="Address" onInput={this.handleInputChange} />
                                                <span className="error" >{this.state.errors.address}</span>
                                                <FormControl.Feedback />
                                            </FormGroup>
                                        </Col>
                                        <Col md={12} xs={12} className="custom-inputs">
                                            <Col md={6} xs={12} className="custom-inputs">
                                                <FormGroup className="inputMargin" validationState={this.getValidationState(this.state.admin, 'firstName', 50)}>
                                                    <ControlLabel>First name<span className="error">*</span></ControlLabel>
                                                    <FormControl maxLength={USER_NAME_MAX_LENGTH} type="text"  name="firstName" placeholder="First name" onInput={this.handleInputChange} />
                                                    <span className="error" >{this.state.errors.firstName}</span>
                                                    <FormControl.Feedback />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6} xs={12} className="custom-inputs">
                                                <FormGroup className="inputMargin" validationState={this.getValidationState(this.state.admin, 'lastName', 50)}>
                                                    <ControlLabel>Last name<span className="error">*</span></ControlLabel>
                                                    <FormControl maxLength={USER_NAME_MAX_LENGTH} type="text" name="lastName" placeholder="Last name" onInput={this.handleInputChange} />
                                                    <span className="error" >{this.state.errors.lastName}</span>
                                                    <FormControl.Feedback />
                                                </FormGroup>
                                            </Col>
                                        </Col>
                                        <Col md={6} xs={12} className="custom-inputs">
                                            <FormGroup className="inputMargin" validationState={this.getValidationState(this.state.admin, 'email', 100)}>
                                                <ControlLabel>Email address<span className="error">*</span></ControlLabel>
                                                <FormControl type="email" name="email" placeholder="Email" onInput={this.handleInputChange} />
                                                <span className="error" >{this.state.errors.email}</span>
                                                <FormControl.Feedback />
                                            </FormGroup>
                                        </Col>
                                        <Col md={7} xs={12} className="custom-inputs companyAddButton">
                                            <Button fill className="buttonColor" id="submit" type="submit" disabled={this.isButtonDisabled() ? true : false}>
                                                Create User
                                            </Button>
                                        </Col>
                                        <Col md={12} xs={12}>
                                            {this.props.isAddingCompany && <LoaderComponent isLoading={true} />}
                                        </Col>
                                        <div className="clearfix" />
                                    </form>}

                            />
                        </Col>
                    </Row>
                </Grid>


            </div>
        );
    }


    noPermissionOverlay = (message: string) => {
        return <div className="overlay">
            <div className="overlay-opacity" onClick={() => { }} />
            <Grid>
                <Row>
                    <Col md={3} xs={2}></Col>
                    <Col md={7} xs={8}> <div className="filter-child"><h4>{message}</h4></div></Col>
                    <Col md={2} xs={2}></Col>
                </Row>
            </Grid>

        </div>
    }
}
const mapStateToProps = (state: RootState) => ({
    isLoggedIn: state.User ? state.User.isLoggedIn : false,
    isAddingCompany: state.Company ? state.Company.isAddingCompany : false,
    addCompanyAlertStatus: state.Alerts ? state.Alerts.addCompanyAlertStatus : 'not assigned',
    personas: state.Settings ? state.Settings.personas : [],
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions
})
const mapDispatchToProps = {
    AddCompany: actions.AddCompany,
    getPersonas: s_actions.GetPersonasList
}
export default connect(mapStateToProps, mapDispatchToProps)(Company);