import React from "react";
import {
    Grid,
    Row,
    Col,
    Tab,
    Nav,
    NavItem,

} from "react-bootstrap";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { toast } from 'react-toastify';
import { Card } from "components/Card/Card.jsx";

import { IUserRightsManagementState, IUserPermissions } from 'Interface'
import { connect } from "react-redux";
import * as s_actions from 'action/admin_settings';
import { RootState } from 'reducers';
import PersonaPermissionComponent from "../components/PermissionComponents/PersonaPermissionComponent";
import FormsPermissionsComponent from "../components/PermissionComponents/FormsPermissionsComponent";
import RolesPermissionsComponent from "../components/PermissionComponents/RolePermissionsComponent";

class UserRightsManagement extends React.Component<any, IUserRightsManagementState> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedTab: '1' // be default
        }
    }
    componentWillMount = () => {
        if (this.props.personas && this.props.personas.length === 0)
            this.props.getPersonas()
        if (this.props.all_roles && this.props.all_roles.length === 0)
            this.props.getRolesList()

    }

    render() {
        console.log("Selected tab", this.state.selectedTab);
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="User Management"
                                content={
                                    <div>
                                        <Tab.Container
                                            id="persona-permissions-box"
                                            activeKey={this.state.selectedTab}
                                            onSelect={(k: any) => this.setState({ selectedTab: k })}>
                                            <Row className="clearfix">
                                                <Col sm={12}>
                                                    <Nav bsStyle="tabs" className="responsiveNav">
                                                        <NavItem eventKey="1">Forms</NavItem>
                                                        <NavItem eventKey="2">Persona Permissions</NavItem>
                                                        <NavItem eventKey="3">Role Permissions</NavItem>
                                                    </Nav>
                                                </Col>
                                                <Col sm={12}>
                                                    <Tab.Content animation={true}>
                                                        <Tab.Pane eventKey="1"><FormsPermissionsComponent render={this.state.selectedTab === "1"}/></Tab.Pane>
                                                        <Tab.Pane eventKey="3"><RolesPermissionsComponent render={this.state.selectedTab === "3"}/></Tab.Pane>
                                                        <Tab.Pane eventKey="2"><PersonaPermissionComponent render={this.state.selectedTab === "2"}/></Tab.Pane>
                                                    </Tab.Content>
                                                </Col>
                                            </Row>
                                        </Tab.Container>
                                    </div>
                                } />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

    
}

const mapStateToProps = (state: RootState) => ({
    roles: state.Settings && state.Settings.persona_roles != null ? state.Settings.persona_roles : [],
    all_roles: state.Settings && state.Settings.roles != null ? state.Settings.roles : [],
    personas: state.Settings && state.Settings.personas != null ? state.Settings.personas : [],
    formsList: state.Settings ? state.Settings.formNames : [],
    userId: state.User ? state.User.UserInfo.userId : '',
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions
})
const mapDispatchToProps = {
    getRoles: s_actions.GetRolesListByPersona,
    getRolesList: s_actions.GetRolesList,
    getPersonas: s_actions.GetPersonasList,
}
export default connect(mapStateToProps, mapDispatchToProps)(UserRightsManagement);