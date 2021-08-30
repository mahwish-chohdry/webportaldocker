import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import { dashboardRoutes, validationPagesRoutes } from "constants/routes";
import image from "assets/img/sidebar-3.jpg";
import { Iroute, IUserPermissions, IBrowserHistory } from "Interface";
import { RootState } from "reducers";
import { connect } from "react-redux";
import { isPermittedComponent, getAllPermissions } from 'utils';
import { NOT_ALLOWED } from "constants/index";
import NotAllowed from "views/NotAllowedPage";

interface AdminState {
  image?: any,
  color?: string,
  hasImage?: boolean,
  fixedClasses?: string
}
interface AdminProp extends IBrowserHistory {
  image?: any,
  color?: string,
  hasImage?: boolean,
  fixedClasses?: string
  permissions: IUserPermissions
}
class Admin extends React.Component<AdminProp, AdminState> {
  constructor(props: any) {
    super(props);
    this.state = {
      image: image,
      color: "#CCCCCC",
      hasImage: false,
      fixedClasses: "dropdown show-dropdown open"
    };
  }

  getPagesRoutes = (dashboardRoutes_1: Iroute[]) => {
    return dashboardRoutes_1.map((prop, key) => {
      let flag = isPermittedComponent(dashboardRoutes, this.props.permissions, prop.layout + prop.path);


      if (prop.layout === "/admin") {

        if (!flag && this.props.location.pathname != NOT_ALLOWED) {
          return <Route
            render={props => (
              <NotAllowed
                {...props}
              />
            )}
            path={prop.layout + prop.path}
            key={key}
          />
        }
        else {
          let obj = getAllPermissions(dashboardRoutes, this.props.permissions, prop.layout + prop.path);
          return <Route
            path={prop.layout + prop.path}
            render={props => (
              <prop.component
                {...props}
                componentPermissions={obj}
              />
            )}
            key={key}
          />;
        }

      } else {
        return null;
      }

    });
  };

  getValidationRoutes = (validationPagesRoutes: Iroute[]) => {

    return validationPagesRoutes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return <Route
          path={prop.layout + prop.path}
          render={props => (
            <prop.component
              {...props}
            />
          )}
          key={key}
        />;
      }
      else {
        return null;
      }
    });
  }

  render() {
    let all_routes = this.getPagesRoutes(dashboardRoutes).concat(this.getValidationRoutes(validationPagesRoutes));
    return (
      <div className="wrapper">
        <Sidebar {...this.props} routes={dashboardRoutes} image={this.state.image}
          color={this.state.color}
          hasImage={this.state.hasImage} />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
            {...this.props}
          />
          <Switch>{all_routes}</Switch>
          <Footer />
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state: RootState) => ({
  permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions
})

export default connect(mapStateToProps, {})(Admin);