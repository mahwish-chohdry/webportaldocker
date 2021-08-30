import React from "react";
import {
    Grid,
    Row,
    Col,
    SplitButton,
    MenuItem,
    Button,
    Modal,
    FormGroup,
    FormControl,
    ControlLabel,
    Image,
    Nav,
    NavItem,
    DropdownButton,
} from "react-bootstrap";
import _ from 'lodash';
import Card from "components/Card/Card.jsx";
import DropdownToolTip from "components/DropdownToolTip/DropdownToolTip.jsx";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { ICompany } from 'Interface';
import { RootState } from "reducers";
import { connect } from "react-redux";
import * as actions from 'action/company';
import * as userProfileActions from 'action/userProfile';
import { LoaderComponent } from "components/Loader";
import ReactTooltip from 'react-tooltip';
import {filterCaseInsensitive, textWrapStyle, getBase64} from 'utils';
import Pagination from "utils/Pagination";
import PageSizeSelector from "utils/PageSizeSelector";
import defaultAvatar from 'assets/img/default-avatar.png';
import { toast } from "react-toastify";
class UserProfile extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            companyId: this.props.userInfo.customer_Id,
            companyName: this.props.userInfo.customerId,
            sort: [],
            pageSize: 5,
            isDisabled: true,
            canUpdatePassword: false,
            isOpenUpdateModal: false,
            userProfileList: [],
            isOpenChangePassword: false,
            userProfile: {
                firstname: '',
                lastname: '',
                username: '',
                userId: -1,
                email: '',
                newPassword: '',
                oldPassword: '',
                confirmNewPassword: '',
                profilePicture: null,
                customerId: ''

            },
            errors: {
                firstname: '',
                lastname: '',  
                newPassword: '',
                oldPassword: '',
                confirmNewPassword: '',
            }
        };
    }

    //handle page size
    handlePageSize = (newPageSize:number) =>{
        this.setState({pageSize:newPageSize})
    }

    componentWillMount() {
        const { companyId, companyName } = this.state;
        if (this.props.companiesList && this.props.companiesList.length === 0) {
            this.props.getCompaniesList();
        }
        if (companyId === -1  && this.props.userProfiles && this.props.userProfiles.length !== 0) {
            this.props.clearUserProfileList();
        }
        if (companyName !== "") {
            this.setState({
                companyId: 0
            },()=>{this.props.getUserProfiles(companyName);})
            
        
        }
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        const { companyId } = nextState;
        if (companyId === -1  && nextProps.userProfiles && nextProps.userProfiles.length !== 0) {
            this.props.clearUserProfileList();
            return false;
        }
        return true;
    }


    componentWillReceiveProps(nextProps: any) {
        if (nextProps.userProfiles) {
            this.setState({ userProfileList: nextProps.userProfiles })
        }
        
    }

    //handle key input change
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
    this.setState({errors, isDisabled, userProfile: {...this.state.userProfile, [key]: value} })
    if(key === 'oldPassword' || key === 'newPassword' || key === 'confirmNewPassword'){
        this.validateUpdatePassword();
    }
}
    
    //Validate Update password 
    validateUpdatePassword = () => {
        const { oldPassword, newPassword, confirmNewPassword } = this.state.userProfile;
        if( oldPassword === "" || newPassword === "" || confirmNewPassword === "" ) {
            this.setState({
                canUpdatePassword: false,
            })
        } 
        else {
            this.setState({
                canUpdatePassword: true,
            })
        }
    }

    validatePasswordStrength = () => {
        const { newPassword } = this.state.userProfile;
        let regex = '(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,15})$';
        let result = newPassword.match(regex);
         
        return result;
    }

    // password validation
    validateConfirmPassword = () => {
        const { newPassword, confirmNewPassword } = this.state.userProfile;
        if( newPassword !== confirmNewPassword ){
            this.setState({
                canUpdatePassword: false,
                errors: {
                    ...this.state.errors,
                    confirmNewPassword: `Password doesn't match`
                }
            })
            return false;
        }
        else{
            this.setState({
                canUpdatePassword: true,
                errors: {
                    ...this.state.errors,
                    confirmNewPassword: ``,
                }
            })
            return true;
        }
    }
    //Company select
    onSelectCompany = (company:any) => {
        this.setState({
            companyName: company.name,
            companyId: company.id
        });
        this.props.getUserProfiles(company.customerId);
    }

    //Update profile modal show
    handleShow_UpdateModal= (e: any, data: any) => {
        this.removeErrors();
        this.setState({
            isOpenUpdateModal: true,
            userProfile: {  
                ...this.state.userProfile,
                firstname: data.original.firstName,
                lastname: data.original.lastName,
                username: data.original.username,
                userId: data.original.userId,
                email: data.original.emailAddress,
                profilePicture: data.original.profilePicture,
                customerId: data.original.customerId,
            }
        });
    }

    //Update password modal show
    handleShow_UpdatePassword = (e: any, data: any) => {
        this.removeErrors();
        this.setState({
            isOpenChangePassword: true,
            userProfile: {
                ...this.state.userProfile,
                email: data.original.emailAddress,
            }
        });
    }

    //reset user Profile state
    resetState = () => {
        this.setState({
            userProfile: {  
                ...this.state.userProfile,
                firstname: '',
                lastname: '',
                username: '',
                userId: '',
                email: '',
                profilePicture: '',
                customerId: '',
                newPassword:'',
                oldPassword: '',
                confirmNewPassword: '',
            }
        });
    }

    //handle close Update Profile
    handleClose_UpdateProfile= () => {
        this.removeErrors();
        this.setState({
            isOpenUpdateModal: false
        });     
        this.resetState();
    }

    //Reset errors object
    removeErrors = () => {
        let errors = {
            firstname: '',
            lastname: '',  
            newPassword: '',
            oldPassword: '',
            confirmNewPassword: '',
            profilePicture: ''
        }
        this.setState({ errors })
    }

    // Update profile submit
    handleSave_UpdateProfile = () => {
        const userProfiles = [...this.state.userProfileList]
        let data = userProfiles && userProfiles.filter((profile: any) => {
            return (profile.emailAddress === this.state.userProfile.email)
        })
        if(data.length > 0){
            if(data[0].firstName !== this.state.userProfile.firstname ){
                data[0].firstName = this.state.userProfile.firstname
            }
            if(data[0].lastName !== this.state.userProfile.lastname ){
                data[0].lastName = this.state.userProfile.lastname
            }
            if(data[0].profilePicture !== this.state.userProfile.profilePicture ){
                data[0].profilePicture = this.state.userProfile.profilePicture
            }
            this.props.updateProfile(data[0])
        }
        else{
            toast.error("Failed!", {
                position: toast.POSITION.BOTTOM_RIGHT
              });
        }
        this.handleClose_UpdateProfile();
    
    }

    // Update Password submit
    handleSave_UpdatePassword = () => {
        if(this.validateConfirmPassword()){
            if(this.validatePasswordStrength()){
                 
                let data = {
                    email: this.state.userProfile.email,
                    currentPassword: this.state.userProfile.oldPassword,
                    newPassword: this.state.userProfile.newPassword,
                }
                this.props.changePassword(data);
                this.closeChangePassword();
            }
            else{
                this.setState({
                    canUpdatePassword: false,
                    errors: {
                        ...this.state.errors,
                        newPassword: 'Password should contain at least one number, one letter, and 8-15 character length.'
                    },
                })
            }
        }
    }

    closeChangePassword = () => {
        this.removeErrors();
        this.resetState();
        this.setState({
            isOpenChangePassword: false,
            canUpdatePassword: false,
        });
    }

    // Table sort 
    handleSort = (column :any) => {
        let sort:any[] = this.state.sort;
        if(sort && sort.length > 0){
            let index = sort.findIndex((item :any) => item.id === column[0].id)
            if(index !== -1){
                if(!sort[index].desc){
                    sort = sort.filter(filterColumn => filterColumn.id !== column[0].id );
                    sort.push({
                        id: column[0].id,
                        desc: true
                    });
                } else{
                    sort = sort.filter(filterColumn => filterColumn.id !== column[0].id ); 
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

    //Image Upload
    handleImgUpload = (e: any) => {
        let file = e.currentTarget.files[0];
        let imgBase64;
        getBase64(file, (result: any) => {
             
            imgBase64 = result;
            this.setState({
                isDisabled: false,
                userProfile:{
                    ...this.state.userProfile,
                    profilePicture: result
                }
            })
        });
    }

    // Update profile Modal
    getUpdateModal = () => {
        return(<div>
            <Modal show={this.state.isOpenUpdateModal} onHide={this.handleClose_UpdateProfile} bsSize='large'  >
                <Modal.Header closeButton>
                    <Modal.Title>Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="updateProfileModal">
                <Col md={3}>
                    <div  className="paddingTopLeft">
                        {this.state.userProfile.profilePicture === null ? 
                            <span>
                            <Image src={defaultAvatar} rounded className='profileImg-lg profile-image-overlay' />
                            <Image style={{filter: 'contrast(0.1)'}} src={defaultAvatar} rounded className='profileImg-lg' /></span>:
                            <span> <Image src={"data:image/jpeg;base64," + this.state.userProfile.profilePicture} rounded className="profileImg-lg profile-image-overlay" />
                             <Image style={{filter: 'contrast(0.1)'}} src={"data:image/jpeg;base64," + this.state.userProfile.profilePicture} rounded className="profileImg-lg" /></span>
          }
                        <div
                            data-tip
                            data-for='file-upload-btn'
                        >
                        <input
                            onChange={this.handleImgUpload}
                            type='file'
                            name='profilePicture'
                            accept="image/x-png,image/jpeg"
                            className="custom-file-input"
                        />
                        <ReactTooltip id='file-upload-btn' effect='solid' place='bottom'>
                            <span>Update Profile Picture</span>
                        </ReactTooltip>
                        </div>
                    </div>
                    
                </Col>
                <Col md={9} className="mt-10">
                    <Col xs={6} className="custom-inputs">
                        <FormGroup controlId="formHorizontalUserRoles">
                            <ControlLabel>First Name</ControlLabel>
                            <FormControl bsClass="form-control" type="text" name="firstname" value={this.state.userProfile.firstname} onChange={this.handleInputChange} />
                            <span className="error" >{this.state.errors.firstname}</span>
                        </FormGroup>
                    </Col>
                    <Col xs={6} className="custom-inputs">
                        <FormGroup controlId="formHorizontalForm">
                            <ControlLabel>Last Name</ControlLabel>
                            <FormControl bsClass="form-control" type="text" name="lastname" value={this.state.userProfile.lastname} onChange={this.handleInputChange}/>
                            <span className="error" >{this.state.errors.lastname}</span>
                        </FormGroup>
                    </Col>
                    </Col>
                    <Col md={9} className="mt-10">
                        <Col xs={6} className="custom-inputs">
                            <FormGroup controlId="formHorizontalUserId">
                                <ControlLabel>User Id</ControlLabel>
                                <FormControl bsClass="form-control" type="text" value={this.state.userProfile.userId} disabled />
                            </FormGroup>
                        </Col>
                        <Col xs={6} className="custom-inputs">
                            <FormGroup controlId="formHorizontalEmail">
                            <ControlLabel>Email</ControlLabel>
                                <FormControl bsClass="form-control" type="text" value={this.state.userProfile.email} disabled />
                            </FormGroup>
                        </Col>
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose_UpdateProfile}>
                        Close
                    </Button>
                    <Button onClick={this.handleSave_UpdateProfile} disabled={this.state.isDisabled}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>)
    }

    // update password Modal
    getChangePasswordModal = () => {
        return(<div>
            <Modal show={this.state.isOpenChangePassword} onHide={this.closeChangePassword}  >
                <Modal.Header closeButton>
                    <Modal.Title>Update Password</Modal.Title>
                </Modal.Header>
                <Modal.Body className="updateProfileModal">
                    <Col md={12} className="custom-inputs">
                        <FormGroup controlId="updatePassword">
                            <ControlLabel>Current  Password</ControlLabel>
                            <FormControl bsClass="form-control" type="password" name="oldPassword" autoComplete="new-password" placeholder="Enter your Current Password" value={this.state.userProfile.oldPassword} onChange={this.handleInputChange} />
                            <span className="error" >{this.state.errors.oldPassword}</span>
                        </FormGroup>
                    </Col>
                    <Col md={12} className="custom-inputs">
                        <FormGroup controlId="updatePasswordNew">
                            <ControlLabel>New Password</ControlLabel>
                            <FormControl bsClass="form-control" type="password" name="newPassword" autoComplete="new-password"  placeholder="Enter your New Password"  value={this.state.userProfile.newPassword} onChange={this.handleInputChange} />
                            <span className="error" >{this.state.errors.newPassword}</span>
                        </FormGroup>
                    </Col>
                    <Col md={12} className="custom-inputs">
                        <FormGroup controlId="updatePasswordConfirm">
                            <ControlLabel>Confirm New Password</ControlLabel>
                            <FormControl bsClass="form-control" type="password" name="confirmNewPassword" autoComplete="new-password"  placeholder="Confirm New Password"  value={this.state.userProfile.confirmNewPassword} onChange={this.handleInputChange}/>
                            <span className="error" >{this.state.errors.confirmNewPassword}</span>
                        </FormGroup>
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.closeChangePassword}>
                        Close
                    </Button>
                    <Button disabled={!this.state.canUpdatePassword} onClick={this.handleSave_UpdatePassword}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>)
    }

    render() {
        
         var filteredResults = this.state.userProfileList;
         
         return (
            <div className="content">
                {this.getUpdateModal()}
                {this.getChangePasswordModal()}

                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={<div><span>User Profiles</span> {filteredResults && filteredResults.length > 0 ? <PageSizeSelector classNames={"float-right-2"} changePageSize={this.handlePageSize} selectedPage={this.state.pageSize}/>: <span></span>} </div> }
                                content={
                                    <div>
                                        <Row className="rowMargin" >
                                            <Col md={8}  className="custom-dropdown">
                                                <DropdownToolTip
                                                    title={this.state.companyName !== '' ? this.state.companyName : 'Select Customer'}
                                                    disabled={this.props.isGettingProfiles}
                                                    id={`split-button-userprofile-user`}
                                                    className={"dropdown-50 text-cut"}
                                                    list={this.props.companiesList}
                                                    onSelectOption={this.onSelectCompany}
                                                    tooltipID={'administration-userprofile-user'}  
                                                    label={'User'}
                                                    direction={"bottom"}
                                                    required={true}
                                                    menuItemIdkey = {"id"}
                                                    menuItemIdName = {"name"}
                                                    >
                                                </DropdownToolTip>
                                               
                                            </Col>
                                            
                                          
                                           
                                            
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                {this.props.isGettingProfiles? <LoaderComponent />:
                                                    filteredResults && filteredResults.length?
                                                    <ReactTable
                                                    minRows = {filteredResults && filteredResults.length?0:5}
                                                    PaginationComponent={Pagination}
                                                        columns={[
                                                            {
                                                                Header: 'Profile',
                                                                accessor: 'profileImage',
                                                                minWidth: 100,
                                                                style: textWrapStyle,
                                                                filterable: false,
                                                                Cell: (row: any) => {
                                                                   return (
                                                                    row.original.profilePicture === null ? 
                                                                            <img src={defaultAvatar} className='profileImg'/>: 
                                                                            <img src={"data:image/jpeg;base64,"+ `${row.original.profilePicture}`} className='profileImg' />
                                                                    )
                                                                        
                                                                },
                                                            },
                                                            {
                                                                Header: () => (
                                                                    <span className='sortable'>First Name
                                                                    </span>
                                                                  ),
                                                                accessor: 'firstName',
                                                                minWidth: 140,
                                                                style: textWrapStyle,
                                                            },
                                                            {
                                                                Header: () => (
                                                                    <span className='sortable'>Last Name
                                                                    </span>
                                                                ),
                                                                accessor: 'lastName',
                                                                minWidth: 140,
                                                            },
                                                            {
                                                                Header: () => (
                                                                    <span className='sortable'>Username
                                                                    </span>
                                                                ),
                                                                accessor: 'username',
                                                                minWidth: 140,
                                                            },
                                                            {
                                                                Header: () => (
                                                                    <span className='sortable'>Email
                                                                    </span>
                                                                ),
                                                                accessor: 'emailAddress',
                                                                minWidth: 140,
                                                            },
                                                            {
                                                                Header: '',
                                                                accessor: 'Update',
                                                                sortable: false,
                                                                filterable: false,
                                                                minWidth: 140,
                                                                Cell: (row: any) => {
                                                                    return (

                                                                        <div>
                                                                            <Button data-tip data-for='edit-btn' onClick={(e: any) => this.handleShow_UpdateModal(e, row)}
                   
                                                                            className={!(this.props.componentPermissions && this.props.componentPermissions.canUpdate) ? 'd-none' : 'd-block'}
                                                                            disabled={!(this.props.componentPermissions && this.props.componentPermissions.canUpdate) ? true : false}>
                                                                                <i className="fa fa-pencil"></i>
                                                                            </Button>
                                                                            <ReactTooltip id='edit-btn' effect='solid' place='top'>
                                                                                <span>Edit</span>
                                                                            </ReactTooltip>
                                                                            <Button data-tip data-for='update-password-btn' onClick={(e: any) => this.handleShow_UpdatePassword(e, row)}>
                                                                                <i className="fa fa-key"></i>
                                                                            </Button>
                                                                            <ReactTooltip id='update-password-btn' effect='solid' place='top'>
                                                                                <span>Update Password</span>
                                                                            </ReactTooltip>
                                                                        </div>)
                                                                },
                                                                width: 120
                                                            }
                                                        ]}
                                                        data={filteredResults}
                                                        showPagination={true}
                                                        defaultPageSize={5}
                                                        pageSize={this.state.pageSize}
                                                        sorted={this.state.sort}
                                                        onSortedChange={this.handleSort}
                                                        filterable={true}
                                                        defaultFilterMethod={filterCaseInsensitive}
                                                        className="-highlight" />
                                                         : <div className='userProfileDiv'>Select User to view User's Profiles</div> }
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
    companiesList: state.Company ? state.Company.CompaniesList : [] as any[],
    userProfiles : state.UserProfile? state.UserProfile.userProfiles : [],
    isGettingProfiles:  state.UserProfile && state.UserProfile.isGettingProfiles ? state.UserProfile.isGettingProfiles : false,
    userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null
})

const mapDispatchToProps = {
    getCompaniesList: actions.getCompanyList,
    getUserProfiles: userProfileActions.GetUserProfiles,
    updateProfile: userProfileActions.UpdateProfiles,
    changePassword: userProfileActions.ChangePassword,
    clearUserProfileList: userProfileActions.clearUserProfileList,
}
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
