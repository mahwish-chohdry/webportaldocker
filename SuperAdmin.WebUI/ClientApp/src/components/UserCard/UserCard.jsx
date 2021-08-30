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
import { Grid, Row, Col } from "react-bootstrap";
export class UserCard extends Component {

  option1 = () => {
    return <div className="card card-user">
      <div className={"header" + (this.props.hCenter ? " text-center" : "")}>
        <h4 className="title">{this.props.title}</h4>
        <p className="category">{this.props.category}</p>
      </div>
      <div className="content">
        <div className="user-body">
          <Row>
            <Col md={3} xs={4}>
              <img
                className="view-profile-img"
                src={this.props.avatar}
                alt="..."
              />
            </Col>
            <Col md={9} xs={8}>
              <h4 className="title">
                {this.props.fullName}
                <br />
                <small>{this.props.email}</small>
              </h4>
              {/* <div></div> */}
              <div><small>Last Login: {this.props.lastLogin} {this.props.description}</small></div>
            </Col>


          </Row>

        </div>
        <hr />
        <p className="description user-profile-footer text-center">
          <Row id="user-info-modal-body-db">
            <Col md={4} className="text-center">
              <div><strong>Customer</strong></div>
              <div><small>{this.props.attributes.customerId}</small></div>
            </Col>
            <Col md={4} className="text-center">
              <div><strong>Type </strong></div>
              <div><small>{this.props.attributes.userPermission.personaName}</small></div>
            </Col>
            <Col md={4} className="text-center">
              <div><strong>Role </strong></div>
              <div><small>{this.props.attributes.userPermission.roleName}</small></div>
            </Col>
          </Row>
        </p>
      </div>

      {/* <div className="text-center">{this.props.socials}</div> */}
    </div>
  }
  option2 = () => {
    return <div className="card card-user">
      {/* <div className={"header" + (this.props.hCenter ? " text-center" : "")}>
        <h4 className="title">{this.props.title}</h4>
        <p className="category">{this.props.category}</p>
      </div> */}
      <div className="content">
        <div className="user-body-2">
          <Row>
            <Col md={4}>
              <img
                className="view-profile-img"
                src={this.props.avatar}
                alt="..."
              />
              <div class="vertical-line"></div>
            </Col>


            <Col md={8} >
              <h4 className="title">
                <div>{this.props.fullName}</div>
              </h4>
              <div className="description"><small><i className="fa fa-envelope mr-5"></i>{this.props.email}</small></div>
              <div><small><i className="fa fa-circle text-success mr-5"></i>Last Login: {this.props.lastLogin} </small></div>
              <hr />
              {/* <Row > */}
              <Col md={6} id="user-info-modal-body-db-small-headings">

                <div><i className="fa fa-angle-double-right mr-5"></i> <strong>Customer</strong></div>
                <div><i className="fa fa-angle-double-right mr-5"></i>  <strong>Customer Type</strong></div>
                <div><i className="fa fa-angle-double-right mr-5"></i>  <strong>Role</strong></div>
              </Col>
              <Col md={6} id="user-info-modal-body-db-small-body">
                <div>{this.props.attributes.customerId}</div>
                <div>{this.props.attributes.userPermission.personaName}</div>
                <div>{this.props.attributes.userPermission.roleName}</div>
              </Col>
              {/* </Row> */}




            </Col>
          </Row>


          {/* <hr /> */}


        </div>

      </div>

    </div>
  }
  option3 = () => {
    return <div className="card card-user">
      {/* <div className={"header" + (this.props.hCenter ? " text-center" : "")}>
        <h4 className="title">{this.props.title}</h4>
        <p className="category">{this.props.category}</p>
      </div> */}
      <div className="content">
        <div className="user-body-3">
          <Row>
            <Col md={2}>
              <img
                className="view-profile-img-small"
                src={this.props.avatar}
                alt="..."
              />
              <div class="vertical-line"></div>
            </Col>


            <Col md={10} >
              <h4 className="title">
                <div><small><i className="fa fa-circle text-success mr-5"></i></small>{this.props.fullName}</div>
              </h4>
              <div className="description"><small>{this.props.email}</small></div>
              <div><small><i className="fa fa-circle text-success mr-5"></i>Last Login: {this.props.lastLogin} </small></div>
              <hr />
              <Row>


                <Col md={6} id="user-info-modal-body-db-small-headings">

                  <div><i className="fa fa-angle-double-right mr-5"></i> <strong>Customer</strong></div>
                  <div><i className="fa fa-angle-double-right mr-5"></i>  <strong>Customer Type</strong></div>
                  <div><i className="fa fa-angle-double-right mr-5"></i>  <strong>Role</strong></div>
                </Col>
                <Col md={6} id="user-info-modal-body-db-small-body">
                  <div>{this.props.attributes.customerId}</div>
                  <div>{this.props.attributes.userPermission.personaName}</div>
                  <div>{this.props.attributes.userPermission.roleName}</div>
                </Col>
              </Row>
            </Col>

          </Row>

        </div>
      </div>
    </div>
  }
  render() {
    return (
      // <div>{this.option1()}</div>
      <div className="dashboard-user-profile-card">{this.option1()}</div>
      // <div>{this.option3()}</div>
    );
  }
}

export default UserCard;
