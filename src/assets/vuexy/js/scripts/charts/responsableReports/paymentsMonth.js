$(window).on("load", function () {

  var $primary = '#7367F0';
  var $success = '#28C76F';
  var $danger = '#EA5455';
  var $warning = '#FF9F43';
  var $label_color = '#1E1E1E';
  var grid_line_color = '#dae1e7';
  var scatter_grid_color = '#f3f3f3';
  var $scatter_point_light = '#D1D4DB';
  var $scatter_point_dark = '#5175E0';
  var $white = '#fff';
  var $black = '#000';

  var themeColors = [$primary, $success, $danger, $warning, $label_color];

  // Line Chart
  // ------------------------------------------

  //Get the context of the Chart canvas element we want to select
  var lineChartctx = $("#paymentsMonth");

  // Chart Options
  var linechartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'top',
    },
    hover: {
      mode: 'label'
    },
    scales: {
      xAxes: [{
        display: true,
        gridLines: {
          color: grid_line_color,
        },
        scaleLabel: {
          display: true,
        }
      }],
      yAxes: [{
        display: true,
        gridLines: {
          color: grid_line_color,
        },
        scaleLabel: {
          display: true,
        }
      }]
    },
    title: {
      display: false,
      text: 'Pagos recibidos por mes'
    }
  };

  // Chart Data
  var linechartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: "Ganancia por Mes",
      data: [86, 114, 106, 106, 500],
      borderColor: $success,
      fill: false
    }]
  };

  var lineChartconfig = {
    type: 'line',

    // Chart Options
    options: linechartOptions,

    data: linechartData
  };

  // Create the chart
  var lineChart = new Chart(lineChartctx, lineChartconfig);

});