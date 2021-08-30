import React from "react";
import { Navbar } from "react-bootstrap";
import { IBrowserHistory } from "Interface";

import AdminNavbarLinks from "./AdminNavbarLinks";

class Header extends React.Component<IBrowserHistory,any > {
  constructor(props: IBrowserHistory) {
    super(props);
    this.state = {
      sidebarExists: false
    };
  }
  mobileSidebarToggle = (e: any) =>  {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function() {
      // this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }
  render() {
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Toggle onClick={this.mobileSidebarToggle} />
        </Navbar.Header>
        <Navbar.Collapse>
          <AdminNavbarLinks {...this.props}/>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
