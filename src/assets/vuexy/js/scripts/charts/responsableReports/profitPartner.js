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

  // Horizontal Chart
  // -------------------------------------

  // Get the context of the Chart canvas element we want to select
  var horizontalChartctx = $("#profitPartner");

  var horizontalchartOptions = {
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      rectangle: {
        borderWidth: 2,
        borderSkipped: 'right',
        borderSkipped: 'top',
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 500,
    legend: {
      display: false,
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
      display: true,
      text: 'Socios que mejores ganancia le deja'
    }
  };

  // Chart Data
  var horizontalchartData = {
    labels: ["Juan Camejo", "Pedro Martinez", "Julieta Venegas", "Pedrito Escamoso", "Nicolas Maduro"],
    datasets: [{
      label: "Ganancia por Socios",
      data: [878, 767, 734, 784, 733],
      backgroundColor: themeColors,
      borderColor: "transparent"
    }]
  };

  var horizontalChartconfig = {
    type: 'horizontalBar',

    // Chart Options
    options: horizontalchartOptions,

    data: horizontalchartData
  };

  // Create the chart
  var horizontalChart = new Chart(horizontalChartctx, horizontalChartconfig);


});