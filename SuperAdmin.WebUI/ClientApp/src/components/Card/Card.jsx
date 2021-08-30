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
import  { Button } from "react-bootstrap";

export class Card extends Component {
  render() {
    return (
      <div  className={"card" + (this.props.plain ? " card-plain" : "")}>
        <div className={"header" + (this.props.hCenter ? " text-center" : "")}>
          <h4 className="title">{this.props.title}</h4>
          <p className="category">{this.props.category}</p>
        </div>
        <div
          className={
            "content" + 
            (this.props.ctAllIcons ? " all-icons" : "") +
            (this.props.ctTableFullWidth ? " table-full-width" : "") +
            (this.props.ctTableResponsive ? " table-responsive" : "") +
            (this.props.ctTableUpgrade ? " table-upgrade" : "") +
            (this.props.customClass ? ` ${this.props.customClass}` : "")
          }
        >
          {this.props.content}
          <div className={this.props.marginBeforeFooter? "footer mt-before-footer": "footer"}>
            <div className="width-100">
            <span>{this.props.legend}</span>
            {this.props.detailsButtonText?<span className="stats float-right">
                <a  href="#" className="float-right" onClick={this.props.detailsButtonCallback}>{`${this.props.detailsButtonText} >>`}</a>
            </span>:''}
            </div>
           
            {this.props.stats != null ? <hr /> : ""}
          
           
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
