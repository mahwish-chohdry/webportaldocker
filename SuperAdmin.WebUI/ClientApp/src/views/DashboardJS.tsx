import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col, Jumbotron, Panel, Well, utils } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import { isTokenExpired, clearToken } from 'utils';
import defaultAvatar from 'assets/img/default-avatar.png';
import chartImg from 'assets/img/grey-circle.png';
import { SizeMe } from 'react-sizeme';
import Chart from "react-apexcharts";
import * as userProfileActions from 'action/userProfile';
import * as dashboardActions from 'action/dashboard';
import { connect } from "react-redux";
import moment from "moment";
import Loader from "react-loader-spinner";
import { MAINTENANCE_REPORT_DAYS, USAGE_REPORT_DAYS, FIRMWARE_UPDATE_REPORT_DAYS, MOBILE_SCREEN_BREAK_POINT, PIE_CHART_SIZE } from 'constants/index';
import UserCard from "components/UserCard/UserCard";
import { Button } from "react-bootstrap/lib/InputGroup";
import { GUTTER_HEIGHT, GUTTER_WIDTH, UsageApexData, AlarmsWarningApexData, MaintenanceApexData, getFanStatusData, createOnlyLegend } from "utils/ReportChartData.js";
import { isNaN, result } from "lodash";
import StackGrid from "react-stack-grid";
import ContentLoader from 'react-content-loader';
import { RootState } from "reducers";
import { IDashboardState, IDashboardProps } from "Interface";
class DashboardJS extends Component<IDashboardProps,IDashboardState> {

    constructor(props:any) {
        super(props);
        this.state = {
            chartgrid: null,
            infogrid: null,
            statsgrid: null,
            devices: [],
            companies: [],
            data: {},
            computedData: {
                alarms: this.props.alarmsWarningData.filter((item:any) => item.type === "Alarm"),
                warnings: this.props.alarmsWarningData.filter((item:any) => item.type === "Warning"),

                configuredDevices: this.props.dashboardDeviceStats && this.props.dashboardDeviceStats.configured ? this.props.dashboardDeviceStats.configured : 0,
                unConfiguredDevices: this.props.dashboardDeviceStats && this.props.dashboardDeviceStats.unConfigured ? this.props.dashboardDeviceStats.unConfigured : 0,
                offlineDevices: this.props.dashboardDeviceStats && this.props.dashboardDeviceStats.offline ? this.props.dashboardDeviceStats.offline : 0,
                onlineDevices: this.props.dashboardDeviceStats && this.props.dashboardDeviceStats.online ? this.props.dashboardDeviceStats.online : 0,
                firmwareUpdates: this.props.dashboardDeviceStats && this.props.dashboardDeviceStats.firmware ? this.props.dashboardDeviceStats.firmware : 0,
                myDevices: this.props.dashboardDeviceStats && this.props.dashboardDeviceStats.totalDevices ? this.props.dashboardDeviceStats.totalDevices : 0,

                // new variables 
                runningAvg: this.getAvgHours(this.props.usageData),
                maintained: this.props.pendingMaintainanceDevices.length,

            }
        }

    }



    getAvgHours = (usageData:any) => {
        let avg = 0;

        if (usageData && usageData.series) {
            let { series } = usageData;
            series = series.length ? series[0] : [];

            if (series.length === 0)
                return 0;

            avg = series.reduce((a:any, b:any) => a + b, 0);


            avg = (avg / (series.length));
            if (avg)
                avg = avg.toFixed(1) as any;

            avg = isNaN(avg) ? 0 : avg;

        }

        return avg;
    }

    ChartContentLoader = (height:any) => {
        return <ContentLoader height={height} width="100%">

        </ContentLoader>
    }

    loaderInsideCard = () => {
        return <div className="spinner">
            <Loader type="ThreeDots" color="#30B99B" height={30} width={30} />
        </div>
    }


    componentWillMount = () => {
        this.props.getStats(this.props.currentCustomerId, this.props.currentUserId);

        // it returns 7 days data 
        let aw_data = {
            customerId: this.props.currentCustomerId,
            deviceId: null,
            batchId: null,
            date: null,
        };

        //usage report 
        // it returns 30 days data 
        this.props.getUsageReport({
            customerId: this.props.currentCustomerId,
            userId: this.props.currentUserId
        })

        this.props.getAlarmAndWarningReport(aw_data)
        let date = new Date();
        let currentDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let data = {
            customerId: this.props.currentCustomerId,
            // customerId: 'QACustomer',
            date: currentDate,
        }
        this.props.getMaintenanceReport(data);
    }

    isDifferentFromPrevious = (nextProps:any, currentProps:any, key:any) => {
        return JSON.stringify(nextProps[key]) !== JSON.stringify(currentProps[key]);
    }

    componentWillReceiveProps(nextProps:any) {
        if (this.isDifferentFromPrevious(nextProps, this.props, 'dashboardDeviceStats') || this.isDifferentFromPrevious(nextProps, this.props, 'pendingMaintainanceDevices') || this.isDifferentFromPrevious(nextProps, this.props, 'usageData')) {
            this.setState({
                computedData: {
                    ...this.state.computedData,
                    configuredDevices: nextProps.dashboardDeviceStats && nextProps.dashboardDeviceStats.configured ? nextProps.dashboardDeviceStats.configured : 0,
                    unConfiguredDevices: nextProps.dashboardDeviceStats && nextProps.dashboardDeviceStats.unConfigured ? nextProps.dashboardDeviceStats.unConfigured : 0,
                    offlineDevices: nextProps.dashboardDeviceStats && nextProps.dashboardDeviceStats.offline ? nextProps.dashboardDeviceStats.offline : 0,
                    onlineDevices: nextProps.dashboardDeviceStats && nextProps.dashboardDeviceStats.online ? nextProps.dashboardDeviceStats.online : 0,
                    firmwareUpdates: nextProps.dashboardDeviceStats && nextProps.dashboardDeviceStats.firmware ? nextProps.dashboardDeviceStats.firmware : 0,
                    myDevices: nextProps.dashboardDeviceStats && nextProps.dashboardDeviceStats.totalDevices ? nextProps.dashboardDeviceStats.totalDevices : 0,


                    runningAvg: this.getAvgHours(nextProps.usageData),
                    maintained: nextProps.pendingMaintainanceDevices.length,
                }
            })
        }
    }

    getPieChartHeader = () => {
        return <div><span></span></div> // add a 1px header
    }

    NoDataPieChart = () => {
        return <div className="mb-7">
            <div className="centered-container">
                <img
                    className="defaultPieChart"
                    src={chartImg}
                    alt="..."
                />
                <div className="centered-label">No data</div>
            </div>
        </div>
    }

    getApexPieChart = (data:any) => {

        return <div>
            {this.updateForceLayout()}
            <Chart
                width={PIE_CHART_SIZE}
                height={PIE_CHART_SIZE}
                options={data}
                series={data.series}
                type="pie"

            />
        </div>

    }

    PieChartsSection = () => {
        let { data1, data2, data3 } = getFanStatusData(this.state.computedData, this.props);
        return <div ><Card

            title={this.getPieChartHeader()}
            category=""
            customClass="pie-chart-abs-height"
            content={
                <div>
                    {
                        <div>
                            <Row
                                id="chartPreferences"
                                style={{ height: 'auto' }}
                            >
                                <Col md={6} xs={12} className="text-center  remove-padding">
                                    <div className={"header"}>
                                        <h4 className="title">{`Devices Stats`}</h4>
                                        <p className="category">{`Total Count: ${this.state.computedData.myDevices}`}</p>
                                    </div>
                                    {this.props.isGettingStats ? this.loaderInsideCard() :
                                        this.state.computedData.myDevices === 0 ? <span>{this.NoDataPieChart()} {createOnlyLegend({ names: data1.labels, types: data1.colors })}</span> :
                                            this.getApexPieChart(data1)}

                                </Col>

                                <Col md={6} xs={12} className="text-center  remove-padding">
                                    <div className={"header" }>
                                        <h4 className="title">{`Configured Stats`}</h4>
                                        <p className="category">{`Total Count: ${this.state.computedData.configuredDevices}`}</p>
                                    </div>
                                    {this.props.isGettingStats ? this.loaderInsideCard() :
                                        this.state.computedData.configuredDevices === 0 ? <span>{this.NoDataPieChart()} {createOnlyLegend({ names: data2.labels, types: data2.colors })}</span> :
                                            this.getApexPieChart(data2)}
                                </Col>

                            </Row>
                            <hr></hr>
                            <Row>
                                <Col md={12} xs={12} className="text-center  remove-padding">
                                    <div className={"header"}>
                                        <h4 className="title">{`Maintenance Stats`}</h4>
                                        <p className="category">{`Total Count: ${this.props.maintainedDevices.length + this.props.pendingMaintainanceDevices.length}`}</p>
                                    </div>
                                    {this.props.isGettingMaintenanceReport ? this.loaderInsideCard() :

                                        this.props.maintainedDevices.length + this.props.pendingMaintainanceDevices.length === 0 ? <span>{this.NoDataPieChart()} {createOnlyLegend({ names: data3.labels, types: data3.colors })}</span> :
                                            this.getApexPieChart(data3)}
                                </Col>
                            </Row>



                        </div>
                    }
                </div>
            }
        />
        </div>
    }

    AlarmWarningSection = () => {
        let arr = this.props.alarmsWarningData ? this.props.alarmsWarningData : [];
        return <div> <SizeMe>{(size) =>
            <Card
                id="chartHours"
                title={`Device Alarms & Warnings (${this.props.alarmsWarningData.length})`}
                category={`All Data`}
                detailsButtonText={'View Detail'}
                detailsButtonCallback={() => { this.props.history.push("/admin/alarmAndWarningReport") }}
                customClass="custom-card-leftMargin"
                content={
                    this.props.isGettingAlarmsReport ? this.ChartContentLoader(this.isMobileScreen(size) ? "200px" : "360px") :
                        <div >
                            {this.updateForceLayout()}
                            <Chart
                                options={AlarmsWarningApexData(arr).options}
                                series={AlarmsWarningApexData(arr).series}

                            />
                        </div>
                }

            />}</SizeMe></div>
    }

    UserProfileSection = () => {
        return <UserCard
            title={"Profile Info"}
            avatar={this.props.userInfo.profileImage === null || this.props.userInfo.profileImage === "" ? defaultAvatar :
                "data:image/jpeg;base64," + this.props.userInfo.profileImage}
            fullName={<span>{`${this.props.userInfo.firstName} ${this.props.userInfo.lastName}`}</span>}
            email={this.props.userInfo.userId}
            lastLogin={this.props.userInfo.lastLogin}
            description={<span><i className="fa fa-circle text-success mr-10" />Online</span>}
            attributes={this.props.userInfo}
        />


    }

    MaintenanceChartSection = () => {

        return <div> <SizeMe>{(size) => <Card
            statsIcon="fa fa-clock-o"
            id="chartHours"
            title={`Device Maintenance (${this.props.maintainedDevices.length + this.props.pendingMaintainanceDevices.length})`}
            category={`Last ${MAINTENANCE_REPORT_DAYS} days performance`}
            detailsButtonText={'View Detail'}
            detailsButtonCallback={() => { this.props.history.push("/admin/maintenanceReport") }}
            customClass="custom-card-leftMargin"
            content={
                this.props.isGettingMaintenanceReport ? this.ChartContentLoader(this.isMobileScreen(size) ? "200px" : "360px") :
                    <div >
                        {this.updateForceLayout()}
                        <Chart
                            options={MaintenanceApexData(this.props.maintainedDevices, this.props.pendingMaintainanceDevices).options}
                            series={MaintenanceApexData(this.props.maintainedDevices, this.props.pendingMaintainanceDevices).series}
                            type="bar"
                        />
                    </div>
            }
        />}</SizeMe></div>


    }

    UsageDataSection = () => {
        return <div> <SizeMe>{(size) =>

            <Card
                id="chartActivity"
                title={<div>Device Usage </div>}
                category={`Last ${USAGE_REPORT_DAYS} days performance`}
                detailsButtonText={'View Detail'}
                detailsButtonCallback={() => { this.props.history.push("/admin/usageReport") }}
                customClass="custom-card-leftMargin"
                content={
                    this.props.isGettingUsageData ? this.ChartContentLoader(this.isMobileScreen(size) ? "200px" : "360px") :
                        <div>
                            {this.updateForceLayout()}
                            <Chart
                                options={UsageApexData(this.props.usageData).options}
                                series={UsageApexData(this.props.usageData).series}

                            />
                        </div>


                }
            // marginBeforeFooter={true}
            />

        }</SizeMe></div>
    }

    AuditLogsSection = () => {
        return <div className="hidden">
            <Card
                title={<div className="to-be-done">Audit Logs</div>}
                category="Commands"
                content={
                    <div className="table-full-width">
                        <table className="table">
                            <Tasks />
                        </table>
                    </div>
                }
            />
        </div>
    }

    isMobileScreen = (size:any) => {
        return size && size.width && size.width <= MOBILE_SCREEN_BREAK_POINT;
    }

    getStatsSection = () => {
        let { myDevices, configuredDevices, offlineDevices, alarms, warnings, runningAvg, maintained, firmwareUpdates } = this.state.computedData;
        return <SizeMe>{({ size }) =>
            <div>
                <StackGrid gridRef={(grid:any) => this.setState({statsgrid :grid})} columnWidth={this.isMobileScreen(size) ? "100%" : "25%"} gutterWidth={GUTTER_WIDTH} gutterHeight={GUTTER_HEIGHT}>

                    <div>
                        <StatsCard
                            bigIcon={<i className="pe-7s-menu text-warning" />}
                            statsText="Total Devices"
                            statsValue={this.props.isGettingStats ? this.loaderInsideCard() : myDevices}
                            statsIcon={<i className="fa fa-refresh" />}
                            statsIconText={'All Data'}

                        /></div>
                    <div>
                        <StatsCard
                            bigIcon={<i className="pe-7s-clock text-success" />}
                            statsText={<div >Avg. Running Hours</div>}
                            statsValue={this.props.isGettingUsageData ? this.loaderInsideCard() : runningAvg}
                            statsIcon={<i className="fa fa-calendar-o" />}
                            statsIconText={`Last ${USAGE_REPORT_DAYS} days`}

                        /></div>

                    <div> <StatsCard
                        bigIcon={<i className="pe-7s-power text-danger" />}
                        statsText={<div>To be maintained</div>}
                        statsValue={this.props.isGettingStats ? this.loaderInsideCard() : maintained}
                        statsIcon={<i className=" fa fa-calendar-o" />}
                        statsIconText={`Last ${MAINTENANCE_REPORT_DAYS} days`}

                    /></div>

                    <div> <StatsCard
                        bigIcon={<i className="pe-7s-attention text-warning" />}
                        statsText={<div>Firmware Updates</div>}
                        statsValue={this.props.isGettingStats ? this.loaderInsideCard() : firmwareUpdates}
                        statsIcon={<i className="fa fa-calendar-o" />}
                        statsIconText={`Last ${FIRMWARE_UPDATE_REPORT_DAYS} days`}

                    />
                    </div></StackGrid>
                <span className="hidden">{this.isMobileScreen(size) ? setTimeout(() => this.updateForceLayout(), 1000) : setTimeout(() => this.updateForceLayout(), 1000)}</span>
            </div>

        }</SizeMe>
    }

    updateForceLayout = () => {
        if (this.state.chartgrid != null)
            this.state.chartgrid.updateLayout();

        if (this.state.infogrid != null)
            this.state.infogrid.updateLayout();

        if (this.state.statsgrid != null)
            this.state.statsgrid.updateLayout();
    }

    render() {
        return (
            <div className="content dashboard-main">             
                <Row><Col md={12} xs={12} className="text-end"> <small><label id="last-updated-label" className="float-right last-updated-margin" ><i className="fa fa-refresh" /> {`Last Updated at ${moment(new Date()).format('hh:mm a')}`}</label></small></Col></Row>

                <Grid fluid>
                    <Row>
                        <Col md={12} xs={12}>
                            {this.getStatsSection()}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={7} xs={12}>
                            <StackGrid
                                gridRef={(grid:any) => this.setState({chartgrid :grid})}
                                component={"div"}
                                monitorImageLoading={true}
                                enableSSR={true}
                                columnWidth={"100%"}
                                gutterWidth={GUTTER_WIDTH}
                                gutterHeight={GUTTER_HEIGHT}>
                                <div key={1}>{this.UsageDataSection()}</div>
                                <div key={2}>{this.AlarmWarningSection()}</div>
                                <div key={3}>{this.MaintenanceChartSection()}</div>

                            </StackGrid>
                        </Col>
                        <Col md={5} xs={12}>
                            <StackGrid
                                gridRef={(grid:any) => this.setState({infogrid :grid})}
                                component={"div"}
                                monitorImageLoading={true}
                                enableSSR={true}
                                columnWidth={"100%"}
                                gutterWidth={GUTTER_WIDTH}
                                gutterHeight={GUTTER_HEIGHT}>
                                <div key={4}> {this.UserProfileSection()}</div>
                                <div key={5}> {this.PieChartsSection()}</div>
                                <div key={6}>{this.AuditLogsSection()}</div>
                            </StackGrid>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    companies: state.Company ? state.Company.Companies : [],
    dashboardDeviceStats: state.Dashboard && state.Dashboard.dashboardStats ? state.Dashboard.dashboardStats : [],
    isGettingStats: state.Dashboard ? state.Dashboard.isGettingStats : false,
    currentCustomerId: state.User && state.User.UserInfo.customerId ? state.User.UserInfo.customerId : '',
    currentUserId: state.User && state.User.UserInfo.userId ? state.User.UserInfo.userId : '',
    isGettingCompanies: state.Company && state.Company.isGettingCompanies ? state.Company.isGettingCompanies : false,
    permissions: state.User.UserInfo && state.User.UserInfo.userPermission ? state.User.UserInfo.userPermission : {},
    isGettingAlarmsReport: state.Dashboard ? state.Dashboard.isGettingAlarmsReport : false,
    maintainedDevices: state.Dashboard && state.Dashboard.maintenanceReport ? state.Dashboard.maintenanceReport.maintainedDevices : [],
    pendingMaintainanceDevices: state.Dashboard && state.Dashboard.maintenanceReport ? state.Dashboard.maintenanceReport.pendingDevices : [],
    alarmsWarningData: state.Dashboard && state.Dashboard.alarmsWarningData ? state.Dashboard.alarmsWarningData : [],
    isGettingMaintenanceReport: state.Dashboard ? state.Dashboard.isGettingMaintenanceReport : false,
    userInfo: state.User && state.User.UserInfo ? state.User.UserInfo : null,

    usageData: state.Dashboard && state.Dashboard.usageReport ? state.Dashboard.usageReport : [],
    isGettingUsageData: state.Dashboard.isGettingUsageData
})
const mapDispatchToProps = {
    getStats: dashboardActions.getDashboardDeviceStats,
    getUserProfiles: userProfileActions.GetUserProfiles,
    getAlarmAndWarningReport: dashboardActions.getAlarmAndWarningReport,
    getMaintenanceReport: dashboardActions.getDashboardMaintainanceReport,
    getUsageReport: dashboardActions.getUsageReport
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardJS);
