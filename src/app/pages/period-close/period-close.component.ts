import { Component, OnInit } from '@angular/core';
import { PeriodService } from '../../services/period.service';
import { PeriodClose } from '../../models/period.model';

import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ExpenseService } from '../../services/expense.service';
import { UtilitiesService } from '../../services/utilities.service';

import { formatNumber } from '@angular/common';

import * as $ from 'jquery';



@Component({
  selector: 'app-period-close',
  templateUrl: './period-close.component.html',
  styleUrls: ['./period-close.component.css']
})

export class PeriodCloseComponent implements OnInit {

  bodyClose: PeriodClose;
  statusPeriod = false;
  loading = false;
  colors: string[] = [
    'rgba(170, 0, 255, .5)',
    'rgba(102, 153, 255, .5)',
    'rgba(255, 255, 5 , .5)',
    'rgba(102, 204, 0 , .5)',
    'rgba(255, 51, 102 , .5)',
    'rgba(249, 231, 159, .5)',
    'rgba(115, 198, 182, .5)',
    'rgba(231, 76, 60 , .5)',
    'rgba(29, 233, 182, .5)',
    'rgba(24, 255, 255, .5)',
    'rgba(20, 143, 119, .5)',
    'rgba(46, 134, 193 , .5)',
    'rgba(68, 138, 255 .5)',
    'rgba(64, 196, 255 .5)'
  ];

  // variables bar chart

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          // console.log('label', label);
          return 'S/ ' + formatNumber( value, 'en', '.2-2' );
        }
      },
    }
  };
  barChartLabels: Label[] = [];
  barChartPlugins = [pluginDataLabels];

  barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40] }
  ];

  // variables polar chart

  polarCharOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return '';
          // return 'PEN ' + formatNumber( value, 'en', '.2-2' );
        }
      },
    }
  };

  polarAreaChartLabels: Label[] = [];
  polarAreaChartData: SingleDataSet = [];
  polarChartColors = [
    {
      backgroundColor: [],
      borderColor: []
    },
  ];

  constructor(private periodSvc: PeriodService, private expenseSvc: ExpenseService, private utilitieSvc: UtilitiesService) { }

  ngOnInit() {

    this.onLoadStatusPeriod();
    this.bodyClose = new PeriodClose();

    this.onGetExpenseBranch().then( async (dataChartExpense: any) => {

      this.barChartLabels = dataChartExpense.labels;
      this.barChartData = [{data: dataChartExpense.data , label: 'Gastos en el periodo'}];

      const dataPeriod = await this.onGetTotalExpensePeriod();
      if (!dataPeriod.ok) {
        throw new Error( dataPeriod.error );
      }

      this.bodyClose.countExpenses = dataPeriod.data.countDocuments;
      this.bodyClose.totalExpenses = dataPeriod.data.totalGastoPeriodo;

    }).catch( e => {
      throw new Error( e );
    });


    this.onGetUtilitiesBranch().then( async (dataChartExpense: any) => {

      this.polarAreaChartLabels = dataChartExpense.labels;
      this.polarAreaChartData = dataChartExpense.data;
      this.polarChartColors[0].backgroundColor = dataChartExpense.colors;
      this.polarChartColors[0].borderColor = dataChartExpense.colors;

      const dataPeriod = await this.onGetTotalUtilitiePeriod();
      if (!dataPeriod.ok) {
        throw new Error( dataPeriod.error );
      }

      this.bodyClose.countUtilities = dataPeriod.data.countDocuments;
      this.bodyClose.totalBrutoUtilities = dataPeriod.data.totalUtilidadPeriodo;

    }).catch( e => {
      throw new Error( e );
    });

  }

  onGetExpenseBranch(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.expenseSvc.onGetChartTotal().subscribe( (res: any) => {
        if (!res.ok) {
          reject( {ok: false, error: res.error} );
        }

        const labels: string[] = [];
        const data: string[] = [];
        const colors: string[] = [];
        let i = 0;
        for (const iterator of res.data) {
          labels.push( `${iterator.socio}` ); //, ${iterator.sucursal}
          data.push( iterator.totalGasto );
          colors.push( this.colors[i] );
          i ++;
        }

        resolve({ ok: true, labels, data, colors });

      });
    });
  }

  onGetTotalExpensePeriod(): Promise<any> {
    return new Promise( (resolve) => {
      this.expenseSvc.onGetChartTotalPeriod().subscribe( (res: any) => {
        if (!res.ok) {
          resolve({ok: false, error: res.error});
        }

        resolve({ok: true, data: res.data});
      });
    });
  }

  onGetTotalUtilitiePeriod(): Promise<any> {
    return new Promise( (resolve) => {
      this.utilitieSvc.onGetChartUtilitiePeriod().subscribe( (res: any) => {
        if (!res.ok) {
          resolve({ok: false, error: res.error});
        }

        resolve({ok: true, data: res.data});
      });
    });
  }

  onGetUtilitiesBranch(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.utilitieSvc.onGetChartUtilitiePartner().subscribe( (res: any) => {
        if (!res.ok) {
          reject( {ok: false, error: res.error} );
        }
  
        const labels: string[] = [];
        const data: string[] = [];
        const colors: string[] = [];
        let i = 0;
        for (const iterator of res.data) {
          labels.push( `${iterator.socio}` );
          data.push( iterator.totalUtilidad );
          colors.push( this.colors[i] );
          i ++;
        }

        resolve({ ok: true, labels, data, colors });
  
      });
    });
  }

  onClosePeriod() {
    this.loading = true;
    $('#btnCloseConfirmClosePeriod').trigger('click');
    this.periodSvc.onClosePeriod( this.bodyClose ).subscribe( (res: any) => {

      if (!res.ok) {
        throw new Error( res.error );
      }

      const {message, css} = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css);

      if (res.data.showError === 0) {
        this.statusPeriod = true;
      }

      this.loading = false;

    });
  }

  onLoadStatusPeriod() {
    this.periodSvc.onGetStatusPeriod().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      if (!res.data) {
        this.statusPeriod = true; // perioodo cerrado
        this.onShowAlert( '¡Periodo cerrado, por favor aperturar primero!', 'warning' );
      } else {
        this.bodyClose.datePeriod = new Date(res.data.fechaApertura);
      }

    });
  }

  onShowAlert( msg = '', css = 'success' ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;
    htmlAlert += ``;

    $(`#alertPeriodClose`).html(htmlAlert);
  }

  onGetErrors( showError: number ) {
    let arrErrors = showError === 0 ? [`Se cerró el periodo con éxito`] : [];
    const css = showError === 0 ? 'success' : 'danger';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors = ['¡EL periodo ya fue cerrado!'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors = ['No existe la empresa especificada'];
    }

    return { message: arrErrors.join(', '), css };

  }

}
