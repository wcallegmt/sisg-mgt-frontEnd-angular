import { Component, OnInit } from '@angular/core';
import { PeriodService } from '../../services/period.service';
import { PeriodOpen } from 'src/app/models/period.model';

@Component({
  selector: 'app-period-open',
  templateUrl: './period-open.component.html',
  styleUrls: ['./period-open.component.css']
})
export class PeriodOpenComponent implements OnInit {

  statusPeriod = false; // periodo cerrada
  bodyOpen: PeriodOpen;

  loading = false;
  constructor(private periodSvc: PeriodService) { }

  ngOnInit() {

    this.bodyOpen = new PeriodOpen();

    this.onLoadStatusPeriod();

  }

  onLoadStatusPeriod() {
    this.periodSvc.onGetStatusPeriod().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      if (res.data) {
        this.statusPeriod = true; // perioodo abierto
        this.onShowAlert( `Ya existe un periodo aperturado con código: ${ res.data.correlativoPeriodo || '' }`, 'warning' );
      } else {
        this.onLoadNumeration();
      }

    });
  }

  onLoadNumeration() {
    this.periodSvc.onGetNumerationPeriod().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.bodyOpen.numeration = res.data.numeration;

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

    $(`#alertPeriod`).html(htmlAlert);
  }

  onOpenPeriod() {

    if ( !this.statusPeriod ) {
      this.loading = true;

      this.periodSvc.onOpenPeriod( this.bodyOpen ).subscribe( (res: any) => {

        if (!res.ok) {
          throw new Error( res.error );
        }

        const { message, css } = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css);

        if (res.data.showError === 0) {
          this.statusPeriod = true;
        }

        this.loading = false;

      });
    }

  }

  onGetErrors( showError: number ) {
    let arrErrors = showError === 0 ? [`Se aperturó el periodo con éxito`] : [];
    const css = showError === 0 ? 'success' : 'danger';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('Ya existe un periodo para este mes');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('esta cerrado');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors = ['Existe un periodo aperturado, cierre primero'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No existe la empresa especificada'];
    }

    return { message: arrErrors.join(', '), css };

  }


}
