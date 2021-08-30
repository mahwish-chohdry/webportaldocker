import React from "react";
import { connect } from "react-redux";
import { Row, Form, Button, FormGroup, FormControl, Grid } from "react-bootstrap";

import "assets/css/main.css";
import Card from "components/Card/Card";

class NotAllowed extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="content mt-20">
                    <Grid fluid>
                        <div className="whole-page">
                            <h1> 403 Forbidden</h1>
                            <p>You don't have permissions to access this page kindly contact Admin for further details.</p>
                        </div>

                        <div className="clearfix" />
                    </Grid>
                </div>

            </div>
        );
    }
}


export default NotAllowed;
