import { Component, OnInit } from '@angular/core';
import { ConfigUtilitiesModel } from 'src/app/models/configUtilities.modelo';
import { ConfigUtilitiesService } from 'src/app/services/config-utilities.service';

@Component({
  selector: 'app-config-utilities',
  templateUrl: './config-utilities.component.html',
  styleUrls: ['./config-utilities.component.css']
})
export class ConfigUtilitiesComponent implements OnInit {
  
  bodyConfig: ConfigUtilitiesModel;
  loading = false;

  constructor( private configUSvc: ConfigUtilitiesService ) { }

  ngOnInit() {

    this.bodyConfig = new ConfigUtilitiesModel();

    this.onLoadData();

  }

  onLoadData() {
    this.configUSvc.onGetConfigUtilities().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      this.bodyConfig.incomeTax = res.data.impuestoRenta || 0.00;
    });
  }

  onSubmitConfig( frmConfig: any ) {
    if (frmConfig.valid) {

      this.loading = true;

      this.configUSvc.onUpdateConfigUtilities( this.bodyConfig ).subscribe( (res: any) => {

        if (!res.ok) {
          throw new Error( res.error );
        }

        // alertConfigUtilities

        const { message, css } = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css, 'alertConfigUtilities');
        this.loading = false;

      });

    }
  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertAreaTable' ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;
    htmlAlert += ``;

    $(`#${ idComponent }`).html(htmlAlert);
  }

  onGetErrors( showError: number ) {

    const arrErrors = showError === 0 ? [`Se actualizó con éxito`] : [];
    const css = showError === 0 ? 'success' : 'danger';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('No se encontró registro de la empresa');
    }

    return { message: arrErrors.join(', '), css };

  }

}
