import React from "react";
import {
    Grid,
    Row,
    Col,
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { connect } from "react-redux";
import { IUserPermissions } from "Interface";
import { RootState } from "reducers";
import {  DIGITAL_TWIN_BASE_URL } from "constants/index";
class ManufacturerDigitalTwin extends React.Component<any, any> {

    getTwinIFrame  = (mode: string) => {
        let { customerId } = this.props.userInfo;
        return <iframe src={`${DIGITAL_TWIN_BASE_URL}/${customerId}?mode=${mode}`}></iframe>

    }

    render() {
        let { componentPermissions } = this.props;

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Manufacturer Digital twin"
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                content={componentPermissions.canUpdate && componentPermissions.canView?
                                    this.getTwinIFrame('edit') : 
                                    componentPermissions.canView ?
                                     this.getTwinIFrame('view') : 
                                     <div className="no-permission">Sorry, You don't have permissions to view this site</div>}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
const mapStateToProps = (state: RootState) => ({
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {} as IUserPermissions,
    userInfo: state.User.UserInfo && state.User.UserInfo ? state.User.UserInfo : null
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(ManufacturerDigitalTwin);