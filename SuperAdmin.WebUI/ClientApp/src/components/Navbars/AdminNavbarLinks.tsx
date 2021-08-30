import React from "react";
import { NavItem, Nav, Button, MenuItem, NavDropdown, Modal, Col, FormGroup, ControlLabel, FormControl, Image, Row, Grid } from "react-bootstrap";
import { clearToken } from "utils";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import { RootState } from "reducers";
import { filterCaseInsensitive, textWrapStyle, getBase64 } from 'utils';
import defaultAvatar from 'assets/img/default-avatar.png';
import UserCard from "components/UserCard/UserCard";
import * as loginActions from 'action/login';
import { toast } from "react-toastify";
import { IAdminNavbarLinksProps } from "Interface"
class AdminNavbarLinks extends React.Component<IAdminNavbarLinksProps, any> {
  constructor(props: IAdminNavbarLinksProps) {
    super(props);
    this.state = {
      welcomeText: "Welcome",
      timeout_in_seconds: 60,
      isOpened: false,
      isOpenUpdateModal: false,
      canUpdatePassword: false,
      isOpenChangePassword: false,
      userProfile: {
        id: this.props.userInfo && this.props.userInfo.id ? this.props.userInfo.id : -1,
        firstname: this.props.userInfo && this.props.userInfo.firstName ? this.props.userInfo.firstName : '',
        lastname: this.props.userInfo && this.props.userInfo.lastName ? this.props.userInfo.lastName : '',
        username: this.props.userInfo && this.props.userInfo.userName ? this.props.userInfo.userName : '',
        userId: this.props.userInfo && this.props.userInfo.userId ? this.props.userInfo.userId : '',
        email: this.props.userInfo && this.props.userInfo.userId ? this.props.userInfo.userId : '',
        profilePicture: this.props.userInfo && this.props.userInfo.profileImage ? this.props.userInfo.profileImage : null,
        roleName: this.props.userInfo && this.props.userInfo.userPermission.roleName ? this.props.userInfo.userPermission.roleName : '',
        personaName: this.props.userInfo && this.props.userInfo.userPermission.personaName ? this.props.userInfo.userPermission.personaName : '',
        customerId: this.props.userInfo && this.props.userInfo.customerId ? this.props.userInfo.customerId : '',
        customer_Id: this.props.userInfo && this.props.userInfo.customer_Id ? this.props.userInfo.customer_Id : -1,
        newPassword: '',
        oldPassword: '',
        confirmNewPassword: '',
      },
      errors: {
        firstname: '',
        lastname: '',
        newPassword: '',
        oldPassword: '',
        confirmNewPassword: '',
        profilePicture: ''
      }
    }
  }

  resetState = () => {
    this.setState({
      userProfile: {
        ...this.state.userProfile,
        id: -1,
        firstname: '',
        lastname: '',
        username: '',
        userId: '',
        email: '',
        profilePicture: '',
        customerId: '',
        newPassword: '',
        oldPassword: '',
        confirmNewPassword: '',
        customer_Id: -1,
      }
    });
  }

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

  handleClose = () => {
    this.removeErrors();
    this.resetState();
    this.closeModal();

  }
  closeModal = () => {
    this.setState({
      isOpened: false
    });
  }

  openModal = () => {
    this.setState({
      isOpened: true,
      isOpenUpdateModal: false,
      userProfile: this.getUserProfileFromProps()
    });
  }


  handleEdit = () => {
    this.setState({
      isOpenUpdateModal: true,
      isOpened: false,
      userProfile: this.getUserProfileFromProps()
    })

  }

  getUserProfileFromProps = () => {
    return {
      ...this.state.userProfile,
      id: this.props.userInfo && this.props.userInfo.id ? this.props.userInfo.id : -1,
      firstname: this.props.userInfo && this.props.userInfo.firstName ? this.props.userInfo.firstName : '',
      lastname: this.props.userInfo && this.props.userInfo.lastName ? this.props.userInfo.lastName : '',
      username: this.props.userInfo && this.props.userInfo.userName ? this.props.userInfo.userName : '',
      userId: this.props.userInfo && this.props.userInfo.userId ? this.props.userInfo.userId : '',
      email: this.props.userInfo && this.props.userInfo.userId ? this.props.userInfo.userId : '',
      profilePicture: this.props.userInfo && this.props.userInfo.profileImage ? this.props.userInfo.profileImage : null,
      roleName: this.props.userInfo && this.props.userInfo.userPermission.roleName ? this.props.userInfo.userPermission.roleName : '',
      personaName: this.props.userInfo && this.props.userInfo.userPermission.personaName ? this.props.userInfo.userPermission.personaName : '',
      customerId: this.props.userInfo && this.props.userInfo.customerId ? this.props.userInfo.customerId : '',
      customer_Id: this.props.userInfo && this.props.userInfo.customer_Id ? this.props.userInfo.customer_Id : -1,
    }
  }


  handleImgUpload = (e: any) => {
    let file = e.currentTarget.files[0];
    let imgBase64;
    getBase64(file, (result: any) => {

      imgBase64 = result;
      this.setState({
        isDisabled: false,
        userProfile: {
          ...this.state.userProfile,
          profilePicture: result
        }
      })
    });
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
    this.setState({ errors, isDisabled, userProfile: { ...this.state.userProfile, [key]: value } })

    if (key === 'oldPassword' || key === 'newPassword' || key === 'confirmNewPassword') {
      this.validateUpdatePassword();
    }
  }

  isEmptyProfileImage = (image:any) => {
    return image === "" || image=== null || image === undefined;
  }
  // Update profile Modal

  getViewProfileModal = () => {
    return (<div>
      <Modal show={this.state.isOpened} onHide={this.handleClose} bsSize='medium'  >
        {/** */}
        <Modal.Header closeButton>
          <Modal.Title>My Profile</Modal.Title>

        </Modal.Header>
        <Modal.Body id="user-info-modal-body">



          <Row className="mb-20">
            <Col md={4} xs={4}></Col>
            <Col md={4} xs={4} className="text-center">

              <img
                className="view-profile-img"
                src={this.isEmptyProfileImage(this.state.userProfile.profilePicture) ?
                  defaultAvatar :
                  "data:image/jpeg;base64," + this.state.userProfile.profilePicture}
                alt="..."
              />
              {/* <small className="description">{this.state.userProfile.firstname} {this.state.userProfile.lastname}</small> */}
              <h4 className="user-name">
                <br />
                <small>{this.state.userProfile.username}</small>
              </h4>
              <div> <p className="description">{this.state.userProfile.userId}</p></div>
              <div><Button onClick={() => this.handleEdit()} bsStyle="warning" className="buttonColor mt-10"><i className="fa fa-pencil" /> Edit Profile</Button></div>

            </Col>
            <Col md={4} xs={4}>

            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={4} className="text-center">
              <div><strong>Customer ID</strong></div>
              <div><small>{this.state.userProfile.customerId}</small></div>
            </Col>
            <Col md={4} className="text-center">
              <div><strong>Customer Type </strong></div>
              <div><small>{this.state.userProfile.personaName}</small></div>
            </Col>
            <Col md={4} className="text-center">
              <div><strong>Role </strong></div>
              <div><small>{this.state.userProfile.roleName}</small></div>
            </Col>
          </Row>


        </Modal.Body>
      </Modal>
    </div>)
  }

  componentWillMount = () => {
    setTimeout(() => {
      this.setState({
        welcomeText: ''
      })
    }, this.state.timeout_in_seconds * 1000);
  }

  onLogout = (e: any) => {
    clearToken();
  }

  LogoutButton = () => {
    return <div onClick={(e) => this.onLogout(e)}>
      <i data-tip data-for='logout' className="fa fa-sign-out"></i> Log out
      </div>;
  }

  getDropdownTitle = () => {
    return <span > {this.isEmptyProfileImage(this.props.userInfo.profileImage) ?
      <Image src={defaultAvatar} /> :
      <Image src={"data:image/jpeg;base64," + this.props.userInfo.profileImage} />
    }  {this.state.welcomeText}{` ${this.props.userInfo.firstName} ${this.props.userInfo.lastName}`}</span>
  }


  // Update profile Modal
  getUpdateModal = () => {
    return (<div>
      <Modal show={this.state.isOpenUpdateModal} onHide={this.handleClose_UpdateProfile} bsSize='large'  >
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="updateProfileModal">
          <Col md={3}>
            <div className="paddingTopLeft">
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
                <FormControl bsClass="form-control" type="text" name="lastname" value={this.state.userProfile.lastname} onChange={this.handleInputChange} />
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
  //handle close Update Profile
  handleClose_UpdateProfile = () => {

    this.removeErrors();
    // this.resetState();
    this.setState({
      isOpenUpdateModal: false,
      isOpened: true
    });
  }

  // Update profile submit
  handleSave_UpdateProfile = () => {
    let userInfo = this.props.userInfo;
    if (userInfo.firstName !== this.state.userProfile.firstname) {
      userInfo.firstName = this.state.userProfile.firstname
    }
    if (userInfo.lastName !== this.state.userProfile.lastname) {
      userInfo.lastName = this.state.userProfile.lastname
    }
    if (userInfo.profilePicture !== this.state.userProfile.profilePicture) {
      userInfo.profilePicture = this.state.userProfile.profilePicture
    }
    var obj = {
      id: this.state.userProfile.id,
      userId: this.state.userProfile.userId,
      firstName: this.state.userProfile.firstname,
      lastName: this.state.userProfile.lastname,
      userName: this.state.userProfile.username,
      profilePicture: this.state.userProfile.profilePicture,
      customerId: this.state.userProfile.customer_Id,
      emailAddress: this.state.userProfile.email,
    }
    this.props.updateProfile(obj)

    this.handleClose_UpdateProfile();

  }
  // update password Modal
  getChangePasswordModal = () => {
    return (<div>
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
              <FormControl bsClass="form-control" type="password" name="newPassword" autoComplete="new-password" placeholder="Enter your New Password" value={this.state.userProfile.newPassword} onChange={this.handleInputChange} />
              <span className="error" >{this.state.errors.newPassword}</span>
            </FormGroup>
          </Col>
          <Col md={12} className="custom-inputs">
            <FormGroup controlId="updatePasswordConfirm">
              <ControlLabel>Confirm New Password</ControlLabel>
              <FormControl bsClass="form-control" type="password" name="confirmNewPassword" autoComplete="new-password" placeholder="Confirm New Password" value={this.state.userProfile.confirmNewPassword} onChange={this.handleInputChange} />
              <span className="error" >{this.state.errors.confirmNewPassword}</span>
            </FormGroup>
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeChangePassword}>
            Close
                  </Button>
          <Button disabled={!this.state.canUpdatePassword} onClick={this.handleSave_UpdatePassword}>
            Update
                  </Button>
        </Modal.Footer>
      </Modal>
    </div>)
  }

  // Update Password submit
  handleSave_UpdatePassword = () => {
    if (this.validateConfirmPassword()) {
      if (this.validatePasswordStrength()) {
        // user updating own password using reset password api
        let data = {
          currentPassword: this.state.userProfile.oldPassword,
          newPassword: this.state.userProfile.newPassword,
          email: this.state.userProfile.email
        }
       this.props.resetPassword(data);

        // let data = {
        //   id: this.state.userProfile.id,
        //   userId: this.state.userProfile.userId,
        //   emailAddress: this.state.userProfile.email,
        //   userName: this.state.userProfile.username,
        //   password: this.state.userProfile.newPassword,
        // }

        // this.props.UpdateUserPassword(data);
        this.closeChangePassword();
      }
      else {
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


  openChangePassword = () => {
    this.removeErrors();
    this.resetState();
    this.setState({
      isOpenChangePassword: true,
      userProfile: {
        ...this.state.userProfile,
        id: this.props.userInfo && this.props.userInfo.id ? this.props.userInfo.id : -1,
        firstname: this.props.userInfo && this.props.userInfo.firstName ? this.props.userInfo.firstName : '',
        lastname: this.props.userInfo && this.props.userInfo.lastName ? this.props.userInfo.lastName : '',
        username: this.props.userInfo && this.props.userInfo.userName ? this.props.userInfo.userName : '',
        userId: this.props.userInfo && this.props.userInfo.userId ? this.props.userInfo.userId : '',
        email: this.props.userInfo && this.props.userInfo.userId ? this.props.userInfo.userId : '',
        profilePicture: this.props.userInfo && this.props.userInfo.profileImage ? this.props.userInfo.profileImage : null,
        roleName: this.props.userInfo && this.props.userInfo.userPermission.roleName ? this.props.userInfo.userPermission.roleName : '',
        personaName: this.props.userInfo && this.props.userInfo.userPermission.personaName ? this.props.userInfo.userPermission.personaName : '',
        customerId: this.props.userInfo && this.props.userInfo.customerId ? this.props.userInfo.customerId : '',
      }
    });
  }


  //Validate Update password 
  validateUpdatePassword = () => {
    const { oldPassword, newPassword, confirmNewPassword } = this.state.userProfile;
    if (oldPassword === "" || newPassword === "" || confirmNewPassword === "") {
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
    if (newPassword !== confirmNewPassword) {
      this.setState({
        canUpdatePassword: false,
        errors: {
          ...this.state.errors,
          confirmNewPassword: `Password doesn't match`
        }
      })
      return false;
    }
    else {
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
  render() {
    return (
      <div>
        {this.getViewProfileModal()}
        {this.getUpdateModal()}
        {this.getChangePasswordModal()}
        <Nav className="w-100">
          <NavItem eventKey={3} onClick={() => { this.props.history.push('/admin/dashboard')}} >
            <span className="main-title">Xavor IoT Platform Portal</span>
          </NavItem>
          <NavItem className="float-right">
            <span id="nav-dropdown2">
              <NavDropdown className="pull-right" eventKey={4} title={this.getDropdownTitle()} id="nav-dropdown" >
                <MenuItem eventKey="4.1" onClick={() => { this.openModal() }}><i className="fa fa-user"></i> View Profile</MenuItem>
                <MenuItem eventKey="4.2" onClick={() => { this.openChangePassword() }}><i className="fa fa-lock"></i> Change Password</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="4.3">{this.LogoutButton()}</MenuItem>
              </NavDropdown>
            </span>

          </NavItem>


        </Nav>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null
})


const mapDispatchToProps = {
  updateProfile: loginActions.UpdateMyProfile,
  resetPassword: loginActions.ChangePassword,
  UpdateUserPassword: loginActions.ChangeMyPassword,
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminNavbarLinks);
