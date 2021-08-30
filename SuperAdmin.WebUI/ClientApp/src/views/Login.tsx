import React from "react";
import { connect } from "react-redux";
import { Row, Form, Button, FormGroup, FormControl } from "react-bootstrap";
import { IUser, IUserProps, ILoginState } from 'Interface';
import * as actions from 'action/login';
import LoginHeader from 'components/Navbars/loginNavbar';
import { RootState } from 'reducers';
import { toast } from 'react-toastify';
import "assets/css/main.css";
import { LoaderComponent } from "components/Loader";
import { isAuthenticated } from "utils";
class Login extends React.Component<IUserProps, ILoginState> {
  constructor(props: IUserProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoggedIn: false,
      errors:
      {
        email: '',
        password: ''
      }

    }
    if(isAuthenticated()){
      this.props.history.push('/admin/dashboard', {loadDashboard: true})
    }
  }

  componentWillReceiveProps(nextProps:any){
    if(isAuthenticated()){
      this.props.history.push('/admin/dashboard', {loadDashboard: true})
    }
  }

  handleInputChange = (e: any) => {

    let key = e.currentTarget.name;
    let value = e.currentTarget.value.trim();
    this.setState({ [key]: value, errors: { ...this.state.errors, [key]: '' } } as Pick<IUser, keyof IUser>)
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    if (this.validates(this.state))
      this.props.authenticateUser({ email: this.state.email, password: this.state.password })
  }

  validates = (obj: ILoginState) => {

    let errors = {} as any;
    let flag = true;
   
    if (obj.email != undefined && (obj.email === '' || obj.email === null)) {
      flag = false;
      errors['email'] = "Email is required";
    }
    if (obj.password != undefined && (obj.password === '' || obj.password === null)) {
      flag = false;
      errors['password'] = "Password is required";
    }

    this.setState({ errors });

    return flag;
  }

  render() {
    return (
      <div>
        <LoginHeader brandText="Xavor IoT Platform Portal"></LoginHeader>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <div className="login100-form-title">
              </div>
              <div className="custom-content">
                {this.props.isLoading && <LoaderComponent isLoading={true} />}
                <Form horizontal onSubmit={this.handleSubmit}>
                  <FormGroup controlId="formHorizontalEmail">
                    <Row className="emailLable">Email</Row>
                    <Row className="rowStyle">
                      <FormControl type="email" autoComplete="username" placeholder="Email" name="email" onChange={this.handleInputChange} />
                      <span className="error" >{this.state.errors.email}</span>
                    </Row>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalPassword">
                    <Row className="emailLable">Password</Row>
                    <Row className="rowStyle">
                      <FormControl type="password" autoComplete="current-password" placeholder="Password" name="password" onChange={this.handleInputChange} />
                      <span className="error" >{this.state.errors.password}</span>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row className="rowStyle">
                     <Button className="buttonStyle" type="submit" id="submit">Sign in</Button>
                     {/*<Button className="buttonStyle btn-green" type="submit" id="submit">Sign in</Button>*/}
                    </Row>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  userCredentials: state.User ? state.User.UserInfo : undefined,
  isLoggedIn: state.User ? state.User.isLoggedIn : false,
  isLoading: state.User ? state.User.isLoading : false,
  loginAlertStatus: state.Alerts ? state.Alerts.loginAlertStatus : 'not assigned'
})
const mapDispatchToProps = {
  authenticateUser: actions.Authenticate
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
