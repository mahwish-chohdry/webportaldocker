import React from "react";
import { Navbar } from "react-bootstrap";
import logo from "assets/img/fan-portal-icon03.png";
import "./../../assets/css/customLogin.css";

class LoginHeader extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
        this.state = {
            sidebarExists: false
        };
    }
    mobileSidebarToggle(e: any) {
        if (this.state.sidebarExists === false) {
            this.setState({
                sidebarExists: true
            });
        }
        e.preventDefault();
        document.documentElement.classList.toggle("nav-open");
        var node = document.createElement("div");
        node.id = "bodyClick";
        node.onclick = function () {
            // this.parentElement.removeChild(this);
            document.documentElement.classList.toggle("nav-open");
        };
        document.body.appendChild(node);
    }
    render() {
        return (
            <Navbar fluid className="nav-color">
                <Navbar.Header>
                    <Navbar.Brand>
                        <div className="logo-login">
                            <div className="logo-img-login">
                                <img src={logo} alt="logo_image" />
                                {this.props.brandText}
                            </div>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={this.mobileSidebarToggle} />
                </Navbar.Header>
            </Navbar>
        );
    }
}

export default LoginHeader;
