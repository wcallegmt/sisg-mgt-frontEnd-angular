import { Component, OnInit } from '@angular/core';
import { AreaModel } from '../../models/area.model';
import { AreaService } from '../../services/area.service';
import { PagerService } from '../../services/pager.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  dataArea: any[] = [];
  dataCompany: any[] = [];
  bodyArea: AreaModel;
  qArea = '';
  qEmpresa = '';
  showInactive = false;
  loading = false;
  loadData = false;
  titleModal = 'Nueva área';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };

  constructor( private areaSvc: AreaService, private pagerSvc: PagerService ) { }

  ngOnInit() {
    this.bodyArea = new AreaModel();
    this.areaSvc.onGetCompanyAll( '' ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataCompany = res.data;
    });

    this.onGetListArea(1);
  }

  onGetListArea( page, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.areaSvc.onGetArea( page, this.rowsForPage, this.qArea, this.qEmpresa, this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataArea = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataArea.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }
    });
  }

  onEditArea( idArea: number ) {
    const dataTemp = this.dataArea.find( element => element.idArea === idArea );

    if ( ! dataTemp ) {
      throw new Error('No se encontró área');
    }

    this.bodyArea.idArea = dataTemp.idArea;
    this.bodyArea.idCompany = dataTemp.idEmpresa;
    this.bodyArea.nameArea = dataTemp.nombreArea;
    this.bodyArea.description = dataTemp.descripcion;

    this.loadData = true;
    this.titleModal = 'Editar área';
    this.textButton = 'Guardar cambios';
    $('#btnShowModalArea').trigger('click');
  }

  onShowConfirm( idArea: number ) {
    const dataTemp = this.dataArea.find( element => element.idArea === idArea );

    if ( ! dataTemp ) {
      throw new Error('No se encontró área');
    }
    this.bodyArea.idArea = dataTemp.idArea;
    this.bodyArea.idCompany = dataTemp.idEmpresa;
    this.bodyArea.statusRegister = !dataTemp.estadoRegistro;
  }

  onResetForm() {
    $('#frmArea').trigger('reset');
    this.bodyArea = new AreaModel();
    this.loadData = false;
    this.titleModal = 'Nueva área';
    this.textButton = 'Guardar';
  }

  onSubmitArea( $event ) {
    if ( $event.valid ) {
      this.loading = true;
      if (! this.loadData ) {

        this.areaSvc.onAddArea( this.bodyArea ).subscribe( (res: any) => {
          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            $('#btnCloseModalArea').trigger('click');
            this.onResetForm();
            this.onGetListArea(1);
          }
          this.loading = false;
        });

      } else {
        this.areaSvc.onUpdateArea( this.bodyArea ).subscribe( (res: any) => {
          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            $('#btnCloseModalArea').trigger('click');
            this.onResetForm();
            this.onGetListArea(1);
          }
          this.loading = false;
        });
      }
    }
  }

  onUpdateStatus() {
    this.loading = true;
    this.areaSvc.onDeleteArea( this.bodyArea ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertAreaTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } con éxito`, css, 'alertAreaTable');
        $('#btnCloseConfirmArea').trigger('click');
        this.onResetForm();
        this.onGetListArea(1);
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
    let arrErrors = showError === 0 ? [`Se ${ action } con éxito`] : ['Ya existe'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertAreaTable' : 'alertAreaModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('un registro con este nombre');
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
    if ( showError & 256 ) {
      arrErrors = ['No se encontró registro de área'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

}
