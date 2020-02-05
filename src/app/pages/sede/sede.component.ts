import { Component, OnInit } from '@angular/core';
import { SedeModel } from '../../models/sede.model';
import { SedeService } from '../../services/sede.service';
import { PagerService } from '../../services/pager.service';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.css']
})
export class SedeComponent implements OnInit {
  dataSede: any[] = [];
  dataCompany: any[] = [];
  bodySede: SedeModel;

  qSede = '';
  qAddress = '';
  qCompany = '';
  showInactive = false;
  loading = false;
  loadData = false;
  titleModal = 'Nueva sede';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };
  constructor(private sedeSvc: SedeService,  private pagerSvc: PagerService) { }

  ngOnInit() {
    this.bodySede = new SedeModel();
    this.sedeSvc.onGetCompanyAll( '' ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataCompany = res.data;
    });

    this.onGetListSede(1);
  }

  onGetListSede( page, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.sedeSvc.onGetSede( page, this.rowsForPage, this.qSede, this.qAddress, this.qCompany, this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataSede = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataSede.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }
    });
  }

  onEditSede( idSede: number ) {
    const dataTemp = this.dataSede.find( element => element.idSede === idSede );

    if ( ! dataTemp ) {
      throw new Error('No se encontró área');
    }

    this.bodySede.idSede = dataTemp.idSede;
    this.bodySede.idCompany = dataTemp.idEmpresa;
    this.bodySede.nameSede = dataTemp.nombreSede;
    this.bodySede.addressSede = dataTemp.direccionSede;

    this.loadData = true;
    this.titleModal = 'Editar sede';
    this.textButton = 'Guardar cambios';
    $('#btnShowModalSede').trigger('click');
  }

  onShowConfirm( idSede: number ) {
    const dataTemp = this.dataSede.find( element => element.idSede === idSede );

    if ( ! dataTemp ) {
      throw new Error('No se encontró sede');
    }
    this.bodySede.idSede = dataTemp.idSede;
    this.bodySede.idCompany = dataTemp.idEmpresa;
    this.bodySede.statusRegister = !dataTemp.estadoRegistro;
  }

  onResetForm() {
    $('#frmSede').trigger('reset');
    this.bodySede = new SedeModel();
    this.loadData = false;
    this.titleModal = 'Nueva sede';
    this.textButton = 'Guardar';
  }

  onSubmitSede( $event ) {
    if ( $event.valid ) {
      this.loading = true;
      if (! this.loadData ) {

        this.sedeSvc.onAddSede( this.bodySede ).subscribe( (res: any) => {
          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            $('#btnCloseModalSede').trigger('click');
            this.onResetForm();
            this.onGetListSede(1);
          }
          this.loading = false;
        });

      } else {
        this.sedeSvc.onUpdateSede( this.bodySede ).subscribe( (res: any) => {
          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            $('#btnCloseModalSede').trigger('click');
            this.onResetForm();
            this.onGetListSede(1);
          }
          this.loading = false;
        });
      }
    }
  }

  onUpdateStatus() {
    this.loading = true;
    this.sedeSvc.onDeleteSede( this.bodySede ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertCompanyTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } con éxito`, css, 'alertSedeTable');
        $('#btnCloseConfirmSede').trigger('click');
        this.onResetForm();
        this.onGetListSede(1);
      }
      this.loading = false;

    });
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
    const action = this.loadData ? 'actualizó' : 'insertó';
    let arrErrors = showError === 0 ? [`Se ${ action } con éxito`] : ['Ya existe un registro'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertSedeTable' : 'alertSedeModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push(' con este nombre');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors = ['No existe la empresa especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No se encontró registro de sede'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

}
