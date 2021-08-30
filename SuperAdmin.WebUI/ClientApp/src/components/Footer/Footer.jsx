/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <Grid fluid>
                    <p className="copyright pull-right">
                        &copy; Copyright {new Date().getFullYear()} - Xavor IoT Platform Portal - Product of <a href="https://www.xavor.com/products" target="_blank">Xavor Corporation</a>. All Rights Reserved
                    </p>
                </Grid>
            </footer>
        );
    }
}

export default Footer;
