import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // Pie
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          // const label = ctx.chart.data.labels[ctx.dataIndex];
          return value;
        },
      },
    }
  };
  pieChartLabels: Label[] = ['Responsables', 'Socios', 'Sucursales'];
  pieChartData: number[] = [];
  pieChartPlugins = [pluginDataLabels];
  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
      borderColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)']
    },
  ];


  constructor(private dashSvc: DashboardService) { }

  ngOnInit() {
    this.dashSvc.onGetChartEntity().subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }
      this.pieChartData.push(res.data.totalResponsable);
      this.pieChartData.push(res.data.totalSocio);
      this.pieChartData.push(res.data.totalSucursal);

    });
  }

}
