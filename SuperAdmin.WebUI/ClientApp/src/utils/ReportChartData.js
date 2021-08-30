import moment from 'moment';
import { arrayUnion } from './index';
import Chartist from 'chartist';
import React from 'react';
import chartistPluginAxisTitle from "chartist-plugin-axistitle";
import { Left } from 'react-bootstrap/lib/Media';
import {MOBILE_SCREEN_BREAK_POINT} from 'constants/index'


export const GUTTER_WIDTH = 20;
export const GUTTER_HEIGHT = 6;

export const createLegend = (json) => {
  var legend = [];
  for (var i = 0; i < json["names"].length; i++) {
    var type = "fa fa-circle text-" + json["types"][i];
    legend.push(React.createElement("i", { className: type }));
    legend.push(" ");
    legend.push(json["names"][i]);
  }
  return legend;
}

export const createOnlyLegend = (json) => {
  var legend = [];
  for (var i = 0; i < json["names"].length; i++) {
    var type = "fa fa-circle";
    var circle_color = json["types"][i];
    legend.push(React.createElement("i", { className: type, style:{color: circle_color} }));
    legend.push(" ");
    legend.push(React.createElement("span",{style:{color: 'rgb(55, 61, 63)',
      fontSize: '12px',
      fontWeight: '400',
      }},json["names"][i]));
  }
  return legend;
}



export const UsageApexData = (usageData) => {

  return {
    series: [
      {
        name: "Usage Hours per Day",
        type: 'area',
        data: usageData && usageData.series && usageData.series.length ? usageData.series[0] : []
        // data: []
      },
    ],
    options: {
      width: "100%",
      height: 350,
      chart: {
        width: "500px",
        height: 350,
        type: "line",
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: true,
            zoomout: true,
            pan: false,
            reset: true | '<img src="/static/icons/reset.png" width="20">',
            customIcons: []
          }
        }
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      tooltip: {
        enabled: false
      },
      fill: {
        type: 'solid',
        opacity: [0.35, 1],
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: 'smooth',
        lineCap:'round',
        width:2
      },
      markers: {
        size: 1
      },
      yaxis: [
        {
          title: {
            text: 'Running Hours',
          },
        }],
      xaxis: {
        type: 'date',
        categories: usageData && usageData.labels && usageData.labels.length ? usageData.labels : [],
        // categories: []
        title: {
          text: 'Timeline',
          offsetY: -2
        }
      },
      legend: {
        position: "right",
        verticalAlign: "top",
        containerMargin: {
          left: 35,
          right: 60
        }
      },
      noData: {
        text: 'No Data Available',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '14px',
          fontFamily: undefined
        }
      },
      responsive: [
        {
          breakpoint: MOBILE_SCREEN_BREAK_POINT,
          height: 500,
          options: {
            plotOptions: {
              bar: {
                horizontal: true
              },
              chart: {
                width: "100%",
                height: 500,
                type: "line"
              },
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]


    }
  }

}
export const AlarmsWarningApexData = (reportData) => {
  let alarmsReportData = reportData && reportData.length ? reportData : [];

  let dateLine = alarmsReportData.map((item) => {
    return moment(item.timestamp).format('L');
  });


  let timeLine = alarmsReportData.map((item) => {
    let dt = moment(item.timestamp).format('L');
    return { time: moment(item.timestamp).format('LT'), type: item.type, date: dt };
  });

  dateLine = arrayUnion(dateLine, dateLine, (d1, d2) => { return d1 === d2 });

  let alarmSeries = dateLine.map((dateObj) => {
    let data = timeLine.filter((item) => item.date == dateObj && item.type == 'Alarm');
    return data.length;
  })
  let warningsSeries = dateLine.map((dateObj) => {
    let data = timeLine.filter((item) => item.date == dateObj && item.type == 'Warning');
    return data.length;
  })

  return {
    series: [
      {
        name: "Alarms",
        data: alarmSeries
        // data: []
       
      },
      {
        name: 'Warnings',
        data: warningsSeries,
        // data: []
      }
    ],
    options: {
      chart: {
        width: "500px",
        height: 350,
        type: "line",
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: true,
            zoomout: true,
            pan: false,
            reset: true | '<img src="/static/icons/reset.png" width="20">',
            customIcons: []
          }
        }
      },
      colors: ['#ff6633', '#FFCC00'],
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: 'smooth',
        lineCap:'round',
        width:2
      },
      markers: {
        size: 1
      },
      yaxis: [
        {
          title: {
            text: 'Frequency of Alarms & Warnings',
          },
        }],
      xaxis: {
        type: 'datetime',
        categories: dateLine,
        // categories: [],
        title: {
          text: 'Timeline',
          offsetY: 10
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
       
      },
      noData: {
        text: 'No Data Available',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '14px',
          fontFamily: undefined
        }
      },
      responsive: [
        {
          breakpoint: MOBILE_SCREEN_BREAK_POINT,
          height: 500,
          options: {
            plotOptions: {
              bar: {
                horizontal: true
              },
              chart: {
                width: "275px",
                height: 500,
                type: "line"
              },
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]


    }
  }

}


export const MaintenanceApexData = (maintainedDevices, pendingMaintainanceDevices) => {
  // Extracting expected & Last Maintenance Date of Maintained Devices
  let expectedMaintenanceDate = maintainedDevices.map((item) => {
    if (item.expectedMaintenanceDate != "") {
      return moment(item.expectedMaintenanceDate).format('L');
    }
  });
  let LastMaintenanceDate = maintainedDevices.map((item) => {
    if (item.lastMaintenanceDate != "") {
      return moment(item.lastMaintenanceDate).format('L');
    }
  });

  let maintainedDevicesDates = arrayUnion(expectedMaintenanceDate, LastMaintenanceDate, (d1, d2) => { return d1 === d2 })


  let expectedMaintenanceDate_pending = pendingMaintainanceDevices.map((item) => {
    if (item.expectedMaintenanceDate != "") {
      return moment(item.expectedMaintenanceDate).format('L');
    }
  });
  let LastMaintenanceDate_pending = pendingMaintainanceDevices.map((item) => {
    if (item.lastMaintenanceDate != "") {
      return moment(item.lastMaintenanceDate).format('L');
    }
  });
  let pendingDevicesDates = arrayUnion(expectedMaintenanceDate_pending, LastMaintenanceDate_pending, (d1, d2) => { return d1 === d2 })

  //Labels for Graph 
  let dateLabels = arrayUnion(maintainedDevicesDates, pendingDevicesDates, (d1, d2) => { return d1 === d2 })

  var finalLabels = dateLabels.filter(function (item) {
    return item != null;
  });

  let maintainedSeries = finalLabels.map((dateObj) => {
    let data = maintainedDevices.filter((item) => moment(item.lastMaintenanceDate).format('L') === dateObj);
    return  data.length;
  })
  let pendingSeries = finalLabels.map((dateObj) => {
    let data = pendingMaintainanceDevices.filter((item) => moment(item.expectedMaintenanceDate).format('L') === dateObj);
    return data.length;
  })

  return {
    series: [  {
      name: "Maintained",
      data: maintainedSeries
      // data: []
     
    },
    {
      name: 'Pending',
      data: pendingSeries,
      // data: []
    }],
    options:{
    chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: false,
        selection: false,
        zoom: false,
        zoomin: true,
        zoomout: true,
        pan: false,
        reset: true | '<img src="/static/icons/reset.png" width="20">',
        customIcons: []
      }
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      maxItems: 8,
      columnWidth: '20%'
    }
  },
  colors: ['#5cb85c', '#ff6347'],
  dataLabels: {
    enabled: false,
    offsetX: -6,
    style: {
      fontSize: '12px',
      colors: ['#fff']
    }
  },
  stroke: {
    show: true,
    width: 2,
  },
  xaxis: {
    categories: finalLabels,
    // categories:[],
    type: 'datetime',
    title: {
      text: 'Timeline',
      offsetY: 10
    }
  },
  yaxis:{
    labels: {
      formatter: function (value) {
        return Number(value).toFixed(0);
      }
    },
    title:{
      text:'No of Devices'
    }
  },
  legend: {
    position: "bottom",
    horizontalAlign: "left",
    onItemHover: {
      highlightDataSeries: true
    },
    markers:{
      radius: 12
    }
   
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy'
    }
  },
  noData: {
    text: 'No Data Available',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: undefined,
      fontSize: '14px',
      fontFamily: undefined
    }
  },
  responsive: [
    {
      breakpoint: MOBILE_SCREEN_BREAK_POINT,
      height: 500,
      options: {
        plotOptions: {
          bar: {
            horizontal: false
          },
          chart: {
            width: "275px",
            height: 500,
            type: "bar"
          },
        },
        legend: {
          position: "bottom"
        }
      }
    }
  ]
}}

}

export const getFanStatusData = (statsData, propsData) => {
  let { myDevices, configuredDevices, offlineDevices, onlineDevices, firmware, unConfiguredDevices } = statsData;
  let { maintainedDevices } = propsData;
  let { pendingMaintainanceDevices } = propsData;
  maintainedDevices = maintainedDevices.length;
  pendingMaintainanceDevices = pendingMaintainanceDevices.length;

  let maintenancePiSeries = [pendingMaintainanceDevices, maintainedDevices]
  let configuredPieSeries = [configuredDevices, unConfiguredDevices]
  let onlineOfflinePieSeries = [offlineDevices, onlineDevices]

  return {
      data1: {
          labels: ['Configured', `Unconfigured`], 
          // series: configuredPieSeries,
          series: configuredPieSeries,
          colors:['#7AC142','#6CA0DC'],
          chart: {
              width: 128,
              type: 'pie',
              offsetX: 0
          },
          legend: {
              position: 'bottom',
              horizontalAlign: "center",
              fontSize: '12px',
              onItemHover: {
                  highlightDataSeries: true
              },
              markers: {
                  radius: 12
              },
              width: 220
          },
          dataLabels: {
              enabled: true,
              formatter: function (val, opts) {
                  return configuredPieSeries[opts.seriesIndex]
              },
          },
          responsive: [
              {
                  breakpoint: MOBILE_SCREEN_BREAK_POINT,
                  options: {
                      chart: {
                          offsetX: 50
                      },
                  },
                  legend: {
                      position: "bottom"
                  }
              }

          ]
      },
      data2: {
          labels: ['Offline', `Online`],
          series: onlineOfflinePieSeries,
          colors:['#FF6961', '#77DD77'],
          chart: {
              width: 128,
              type: 'pie',
              offsetX: 0
          },
          legend: {
              position: 'bottom',
              horizontalAlign: "center",
              fontSize: '12px',
              onItemHover: {
                  highlightDataSeries: true
              },
              markers: {
                  radius: 12
              }
          },
          dataLabels: {
              enabled: true,
              formatter: function (val, opts) {
                  return onlineOfflinePieSeries[opts.seriesIndex]
              },
          },
          responsive: [
              {
                  breakpoint: MOBILE_SCREEN_BREAK_POINT,
                  options: {
                      chart: {
                          offsetX: 50
                      },
                  },
                  legend: {
                      position: "bottom"
                  }
              }

          ]
      },
      data3: {
          labels: ['Pending', `Maintained`],
          series: maintenancePiSeries,

          colors:['#47B39C','#FFC154'],
          chart: {
              width: 128,
              type: 'pie',
              offsetX: 100
          },
          legend: {
              position: 'bottom',
              horizontalAlign: "center",
              fontSize: '12px',
              onItemHover: {
                  highlightDataSeries: true
              },
              markers: {
                  radius: 12
              }
          },
          dataLabels: {
              enabled: true,
              formatter: function (val, opts) {
                  return maintenancePiSeries[opts.seriesIndex]
              },
          },
          responsive: [
              {
                  breakpoint: MOBILE_SCREEN_BREAK_POINT,
                  options: {
                      chart: {
                          offsetX: 50
                      },
                  },
                  legend: {
                      position: "bottom"
                  }
              }

          ]
      }


  };

}


export const MaintainenanceGraphicalApexReport = (reportData) =>{
  let expectedMaintenanceDate = reportData.map((item) => {
    if (item.expectedMaintenanceDate != "") {
      return moment(item.expectedMaintenanceDate).format('L');
    }
  });
  let LastMaintenanceDate = reportData.map((item) => {
    if (item.lastMaintenanceDate != "") {
      return moment(item.lastMaintenanceDate).format('L');
    }
  });

  let maintainedDevicesDates = arrayUnion(expectedMaintenanceDate, LastMaintenanceDate, (d1, d2) => { return d1 === d2 })

  var finalLabels = maintainedDevicesDates.filter(function (item) {
    return item != null;
  });

  let maintainedSeries = finalLabels.map((dateObj) => {
    let data = reportData.filter((item) => moment(item.lastMaintenanceDate).format('L') === dateObj);
    return  data.length;
  })
  let upcomingMaintenanceSeries = finalLabels.map((dateObj) => {
    let data = reportData.filter((item) => moment(item.expectedMaintenanceDate).format('L') === dateObj);
    return data.length;
  })
  return {
    series: [  {
      name: "Maintained",
      data: maintainedSeries
      // data: []
     
    },
    {
      name: 'Pending',
      data: upcomingMaintenanceSeries,
      // data: []
    }],
    options:{
    chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: false,
        selection: false,
        zoom: false,
        zoomin: true,
        zoomout: true,
        pan: false,
        reset: true | '<img src="/static/icons/reset.png" width="20">',
        customIcons: []
      }
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      maxItems: 8,
      columnWidth: '20%'
    }
  },
  colors: ['#5cb85c', '#ff6347'],
  dataLabels: {
    enabled: false,
    offsetX: -6,
    style: {
      fontSize: '12px',
      colors: ['#fff']
    }
  },
  stroke: {
    show: true,
    width: 2,
  },
  xaxis: {
    categories: finalLabels,
    // categories:[],
    type: 'datetime',
    title: {
      text: 'Timeline',
      offsetY: 10
    }
  },
  yaxis:{
    labels: {
      formatter: function (value) {
        return Number(value).toFixed(0);
      }
    },
    title:{
      text:'No of Devices'
    }
  },
  legend: {
    position: "bottom",
    horizontalAlign: "left",
    onItemHover: {
      highlightDataSeries: true
    },
    markers:{
      radius: 12
    }
   
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy'
    }
  },
  noData: {
    text: 'No Data Available',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: undefined,
      fontSize: '14px',
      fontFamily: undefined
    }
  },
  responsive: [
    {
      breakpoint: MOBILE_SCREEN_BREAK_POINT,
      height: 500,
      options: {
        plotOptions: {
          bar: {
            horizontal: false
          },
          chart: {
            width: "275px",
            height: 500,
            type: "bar"
          },
        },
        legend: {
          position: "bottom"
        }
      }
    }
  ]
}}

}





