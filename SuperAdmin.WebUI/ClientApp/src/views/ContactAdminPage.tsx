import React from "react";
import { connect } from "react-redux";
import { Row, Form, Button, FormGroup, FormControl } from "react-bootstrap";

import "assets/css/main.css";

class ContactAdmin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
 
  render() {
    return (
      <div>
         Oops! Something bad happened. Please contact administrator for further details.
      </div>
    );
  }
}


export default ContactAdmin;
