import React from "react";
import logo from "assets/img/fan-portal-icon03.png";
import { collapsableOptions } from 'constants/routes';
import { Iroute, IUserPermissions } from "Interface"
import { Submenu } from "./Submenu";
import * as s_actions from 'action/admin_settings';
import { IUserRightsManagementState } from 'Interface'
import { RootState } from "reducers";
import { connect } from "react-redux";
import { getPermittedRoutes } from "utils";
import { IBrowserHistory } from "Interface";

interface SidebarProps extends IBrowserHistory {
    location?: any;
    routes: Iroute[];
    image?: any;
    color?: string;
    hasImage?: boolean;

    // user management related
    getRolesList: () => void;
    getPersonas: () => void;
    getForms: () => void;
    getPersonaPermissionsList: () => void;
    getRolePermissionList: () => void;

    roles: any[];
    personas: any[];
    forms: any[];
    personaPermissionsList: any[];
    rolePermissionList: any[];
    userPermissions: IUserPermissions;
}


interface sidebarState {
    width: any,
    isActive: boolean,
    activeMenu: string[]
}


class Sidebar extends React.Component<SidebarProps, sidebarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            width: window.innerWidth,
            isActive: false,
            activeMenu: [] as any[],
        };
    }


    activeRoute(routeName: any) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }


    updateDimensions() {
        this.setState({ width: window.innerWidth });
    }


    componentWillMount() {
        this.fetchData();
        let managedRoutes = getPermittedRoutes(this.props.routes, this.props.userPermissions);
        let activeRoute = managedRoutes.filter(route => {
            if (this.props.location.pathname.includes(route.path))
                return route;
        })

        if (activeRoute && activeRoute.length) {
            let parent = activeRoute[0].parent ? activeRoute[0].parent : 'Administration';
            let updated = this.state.activeMenu;
            updated.push(parent)
            this.setState({ activeMenu: updated });
        }
    }

    fetchData = () => {
        this.props.getForms();
        this.props.getRolesList();
        this.props.getPersonas();
        this.props.getPersonaPermissionsList();
        this.props.getRolePermissionList();
    }


    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    onlyOpenSelectedSubMenu = (parent: string) => {
        this.setState({ activeMenu: [parent] });
    }


    toggleNav = (event: any) => {

        event.preventDefault();


        if (event.target.text && this.state.activeMenu.includes(event.target.text)) {

            this.setState({
                activeMenu: this.state.activeMenu.filter(name => name !== event.target.text),
            });

        }
        else if (event.target.text) {


            let updated = this.state.activeMenu;
            updated.push(event.target.text)
            this.setState({ activeMenu: updated });

        }

    }


    render() {
        let managedRoutes = getPermittedRoutes(this.props.routes, this.props.userPermissions);
        let headers = collapsableOptions.filter((item: any) => managedRoutes.filter(Route => Route.parent === item.name).length > 0);

        const sidebarBackground = {
            backgroundImage: "url(" + this.props.image + ")"
        };
        return (
            <div id="sidebar" className="sidebar" data-color={this.props.color} data-image={this.props.image}>
                {this.props.hasImage ? (
                    <div className="sidebar-background" style={sidebarBackground} />
                ) : (
                        null
                    )}
                <div className="logo" onClick={() => { this.props.history.push('/admin/dashboard')}}>
                    <a className="simple-text logo-normal">
                        <div className="logo-img">
                            <img src={logo} alt="logo_image" />
                        </div>
                    </a>
                </div>
                <div className="sidebar-wrapper">
                    <ul className="nav">
                        {headers.map((prop, key) => {
                            return (
                                <li key={key} id={prop.name.split(' ').join('')} onClick={this.toggleNav} className="clickable">
                                    <a>{prop.name}<i className={this.state.activeMenu.includes(prop.name) ? 'fa fa-angle-down fa-xs sidebarNavItem' : 'fa fa-angle-right fa-xs sidebarNavItem'} /></a>
                                    <Submenu
                                        subRoutes={managedRoutes.filter(Route => Route.parent === prop.name)}
                                        activeMenu={this.state.activeMenu}
                                        parent={prop.name}
                                        onlyOpenSelectedSubMenu={this.onlyOpenSelectedSubMenu}
                                    ></Submenu>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    roles: state.Settings && state.Settings.roles != null ? state.Settings.roles : [],
    personas: state.Settings && state.Settings.personas != null ? state.Settings.personas : [],
    forms: state.Settings && state.Settings.personas != null ? state.Settings.formNames : [],
    personaPermissionsList: state.Settings && state.Settings.personaPermissionsList != null ? state.Settings.personaPermissionsList : [],
    rolePermissionList: state.Settings && state.Settings.rolePermissionList != null ? state.Settings.rolePermissionList : [],
    userPermissions: state.User && state.User.UserInfo && state.User.UserInfo.userPermission != null ? state.User.UserInfo.userPermission : null
})


const mapDispatchToProps = {
    getRolesList: s_actions.GetRolesList,
    getPersonas: s_actions.GetPersonasList,
    getForms: s_actions.GetFormsList,
    getPersonaPermissionsList: s_actions.GetPersonaPermissionsList,
    getRolePermissionList: s_actions.GetRolePermissionsList,
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
