import React from "react";
import { NavLink } from "react-router-dom";
import { Iroute } from "Interface";
interface SubmenuProps {
  subRoutes: Iroute[],
  activeMenu: string[],
  parent: string,
  onlyOpenSelectedSubMenu: (parent:string) => void
}

export class Submenu extends React.Component<SubmenuProps, {}> {
  activeRoute(routeName: string, disabled?:boolean) {
    return window.location.pathname.indexOf(routeName) > -1 ? "active":'';
  }

  handleClick = (e:any,prop:Iroute) => {
    if(prop.disabled)
    {
        e.preventDefault();
    }
    else
    {
      this.props.onlyOpenSelectedSubMenu(prop.parent? prop.parent:'Administration')
    }
}

  render() {
    return (
      <ul className={this.props.activeMenu.includes(this.props.parent) ? "nav submenu_show" : "nav submenu_hide"}>
        {this.props.subRoutes.length > 0 && this.props.subRoutes.map((prop, key) => {
          return (
            <li
              className={this.activeRoute(prop.layout + prop.path, prop.disabled)}
              key={key}
            >
              <NavLink
        
                to={prop.layout + prop.path}
                className={prop.disabled? "nav-disabled":"nav-link"}
                activeClassName="active"
                onClick={(e)=>this.handleClick(e,prop)}
                
              >
                <i className={prop.icon} />
                <p>{prop.name}</p>
              </NavLink>
            </li>
          );
        })}
      </ul>
    );
  }
}