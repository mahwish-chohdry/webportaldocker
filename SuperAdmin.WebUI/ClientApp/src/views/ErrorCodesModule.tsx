import React from "react";
import {
    Grid,
    Row,
    Col,
    SplitButton,
    MenuItem,
    Modal,
    FormGroup,
    ControlLabel,
    FormControl,
    Tabs,
    Tab,
    Badge,
    Nav,
    NavItem,

} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { toast } from 'react-toastify';
import { ICompany, IDeviceBatchProps, IdeviceState, Idevice, IErrorCode, IErrorCodeState, IErrorCodeProps, IUserPermissions } from 'Interface';
import { RootState } from "reducers";
import { connect } from "react-redux";
import * as actions from 'action/company';
import * as deviceActions from 'action/device';
import { LoaderComponent } from "components/Loader";
import Dropzone from 'react-dropzone';
import "assets/css/fileUploader.css";
import ReactTooltip from "react-tooltip";
import ReactTable from "react-table";
import Pagination from 'utils/Pagination';
import PageSizeSelector from 'utils/PageSizeSelector';
import { isPermittedComponent } from "utils";
import { dashboardRoutes } from "constants/routes";
import { NOT_ALLOWED } from "constants/index";


class ErrorCodesModule extends React.Component<IErrorCodeProps, IErrorCodeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showModal: false,
            typeFilter: 'Alarm',
            selectedItem: {
                type: '',
                code: '',
                registerNumber: '',
                description: '',
                reasonAnalysis: ''
            },
            errors: {
                description: '',
                reasonAnalysis: ''
            },
            pageSize: 5,

        };
    }


    componentWillMount() {
        if (this.props.errorCodesList && this.props.errorCodesList.length === 0) {
            this.props.getErrorCodesList();
        }
    }

    componentWillReceiveProps(nextProps: IErrorCodeProps) {
        if (!nextProps.isUpdatingErrorCode)
            this.setState({ showModal: false });
    }

    onSelectFilter = (type: any) => {
        this.setState({ typeFilter: type });
    }

    handleShow = (e: any, data: any) => {
        let selected = data.original;
        this.removeErrors();
        this.setState({
            showModal: true,
            selectedItem: {
                type: selected.type,
                code: selected.code,
                description: selected.description,
                reasonAnalysis: selected.reasonAnalysis,
                registerNumber: selected.registerNumber
            }

        });
    }

    handleClose = () => {
        this.removeErrors();
        this.setState({ showModal: false })
    }


    removeErrors = () => {
        let errors = {
            deviceName: ''
        }
        this.setState({ errors })
    }


    handleSave = (e: any) => {
        // validates and save
        this.props.updateErrorCode(this.state.selectedItem);

    }

    validates = (updatedItem: IErrorCode) => {
        let errors = {} as any;
        let flag = true;

        let entries = Object.entries(updatedItem);
        entries.forEach(ele => {
            if (ele[1].toString().trimLeft().trimRight() == '') {
                errors[ele[0]] = 'Required';
                flag = false;

            }
        })
        if (!flag)
            this.setState({ errors, isDisabled: true });
        else
            this.setState({ isDisabled: false })

        return flag;
    }

    handleInputChange = (e: any) => {
        let errors = {} as any;
        let isDisabled = false;
        let key: string = e.currentTarget.name;
        let value = e.currentTarget.value;

        if (value.trimLeft().trimRight() == "") {
            errors = { ...this.state.errors, [key]: `Required` };
            isDisabled = true;
        }
        else {
            errors = { ...this.state.errors, [key]: `` };
            isDisabled = false;
        }
        this.setState({ selectedItem: { ...this.state.selectedItem, [key]: value }, errors, isDisabled })

    }

    getTable = (data: any[]) => {

        // let filtered = this.state.typeFilter != 'All' ? this.props.errorCodesList ? this.props.errorCodesList.filter((item) => item.type === this.state.typeFilter) : [] : this.props.errorCodesList;
        let filtered = data;
        const TheadComponent = () => null;
        const customPagination = (props:any) => {return <Pagination {...props} totalCount={this.props.errorCodesList?this.props.errorCodesList.length:0}></Pagination>}
        return <ReactTable
            minRows={filtered && filtered.length > 0 ? 0 : 5}
            TheadComponent={TheadComponent}
            PaginationComponent={customPagination}
            
            SubComponent={(row: any) => {
                return (
                    <Row>
                        <Col md={12} xs={16}>
                            <div className="errorCodeDetails">
                                <div className="">
                                    <Col md={2} xs={4}><Badge className="badge-custom"> <span>Register Parameter </span></Badge></Col>


                                    <Col className="ml-3" md={10} xs={12}><span>{row.original.code}</span></Col>
                                </div>
                                <div className="" >
                                    <Col md={2} xs={4}><Badge className="badge-custom"> <span>Register Number </span></Badge></Col>
                                    <Col className="ml-3" md={10} xs={12}><span>{row.original.registerNumber}</span></Col>
                                </div>
                                <div className="">
                                    <Col md={2} xs={4}><Badge className="badge-custom"> <span>Reason Analysis </span></Badge></Col>
                                    <Col className="ml-3 reason-content" md={10} xs={12}><span>{row.original.reasonAnalysis}</span></Col>
                                </div>
                            </div>
                        </Col>

                    </Row>

                )
            }}
            columns={[

                {
                    expander: true,
                    Expander: ({ isExpanded, ...rest }) => {
                        return (
                            <div>
                                {isExpanded
                                    ? <span><i className="fa fa-angle-down fa-xs"></i></span>
                                    : <span><i className="fa fa-angle-right fa-xs"></i></span>
                                }
                            </div>
                        );

                    }
                },
                {
                    Header: 'Description',
                    accessor: 'description',

                },
            ]}
            data={filtered}
            showPagination={true}
            pageSize={this.state.pageSize}
            defaultPageSize={this.state.pageSize}
            className="-highlight" />

    }

    handlePageSize = (newPageSize:number) =>{
        this.setState({pageSize:newPageSize})
    }

    render() {
        let warningsData = this.props.errorCodesList ? this.props.errorCodesList.filter((item: any) => item.type == "Warning") : [];
        let alarmData = this.props.errorCodesList ? this.props.errorCodesList.filter((item: any) => item.type == "Alarm") : [];

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={<div><span>Error Codes</span> <PageSizeSelector classNames={"float-right-2"} changePageSize={this.handlePageSize} selectedPage={this.state.pageSize}/></div>}
                                content={
                                    <div>
                                       
                                    <div>
                                    {this.props.isGettingErrorCode ? <LoaderComponent /> :
                                        <Tab.Container
                                            id="controlled-tab-example"
                                            activeKey={this.state.typeFilter}
                                            onSelect={(k: any) => this.onSelectFilter(k)}


                                        >
                                            <Row className="clearfix">
                                                <Col sm={12}>
                                                    <Nav bsStyle="tabs">
                                                        <NavItem eventKey="Alarm">Alarms <Badge>{alarmData.length}</Badge></NavItem>
                                                        <NavItem eventKey="Warning">Warnings  <Badge>{warningsData.length}</Badge></NavItem>
                                                       
                                                    </Nav>
                                                </Col>
                                                <Col sm={12}>
                                                    <Tab.Content animation={false}>
                                                        <Tab.Pane eventKey="Alarm">
                                                            <Row id="errorCodeTable">
                                                                <Col md={12}>
                                                                    {this.getTable(alarmData)}
                                                                </Col>
                                                            </Row>
                                                         
                                                        </Tab.Pane>
                                                        <Tab.Pane eventKey="Warning">
                                                        <Row id="errorCodeTable">
                                                                <Col md={12}>
                                                                   { this.getTable(warningsData)}
                                                                </Col>
                                                            </Row>
                                                         
                                                            </Tab.Pane>

                                                    </Tab.Content>
                                                </Col>

                                            </Row>
                                        </Tab.Container>
                                     
                                    }
                                    </div></div>
                                }
                            />
                        </Col>
                    </Row>

                </Grid>
            </div>
        );
    }
}


const mapStateToProps = (state: RootState) => ({
    errorCodesList: state.Device && state.Device.errorCodes ? state.Device.errorCodes : [] as IErrorCode[],
    isGettingErrorCode: state.Device && state.Device.isGettingErrorCode ? state.Device.isGettingErrorCode : false,
    isUpdatingErrorCode: state.Device && state.Device.isUpdatingErrorCode ? state.Device.isUpdatingErrorCode : false,
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission?state.User.UserInfo.userPermission: {} as IUserPermissions
})



const mapDispatchToProps = {
    getErrorCodesList: deviceActions.getAllErrorCodes,
    updateErrorCode: deviceActions.updateErrorCode
}


export default connect(mapStateToProps, mapDispatchToProps)(ErrorCodesModule);
