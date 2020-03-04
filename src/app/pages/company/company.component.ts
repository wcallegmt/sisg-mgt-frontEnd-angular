import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { CompanyModel } from '../../models/company.model';
import * as $ from 'jquery';
import { PagerService } from '../../services/pager.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  dataCompany: any[] = [];
  dataNationality: any[] = [];
  bodyCompany: CompanyModel;
  qDoc = '';
  qName = '';
  qAddress = '';
  showInactive = false;
  loading = false;
  loadingTable = false;
  loadData = false;
  titleModal = 'Nueva empresa';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };
  constructor( private companySvc: CompanyService, private pagerSvc: PagerService ) { }

  ngOnInit() {
    this.bodyCompany = new CompanyModel();
    this.onGetListCompany(1);
    this.companySvc.onGetNationaltity( '' ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataNationality = res.data;
    });
  }

  onGetListCompany(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.loadingTable = true;

    this.companySvc.onGetListCompany( page, this.rowsForPage, this.qDoc, this.qName, this.qAddress , this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataCompany = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataCompany.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }

      this.loadingTable = false;

    });

  }

  onEditCompany( idCompany: number ) {
    const dataTemp = this.dataCompany.find( element => element.idEmpresa === idCompany );

    if ( ! dataTemp ) {
      throw new Error('No se encontró empresa');
    }

    this.bodyCompany.idCompany = dataTemp.idEmpresa;
    this.bodyCompany.document = dataTemp.documento;
    this.bodyCompany.bussinessName = dataTemp.razonSocial;
    this.bodyCompany.tradeName = dataTemp.nombreComercial;
    this.bodyCompany.address = dataTemp.direccion;
    this.bodyCompany.legalRepresentative = dataTemp.representante;
    this.bodyCompany.idNationality = dataTemp.idNacionalidad;
    this.bodyCompany.email = dataTemp.email;
    this.bodyCompany.phone = dataTemp.telefono;
    this.loadData = true;
    this.titleModal = 'Editar empresa';
    this.textButton = 'Guardar cambios';
    $('#btnShowModalCompany').trigger('click');

  }

  onShowConfirm( idCompany: number ) {
    const dataTemp = this.dataCompany.find( element => element.idEmpresa === idCompany );

    if ( ! dataTemp ) {
      throw new Error('No se encontró empresa');
    }
    this.bodyCompany.idCompany = dataTemp.idEmpresa;
    this.bodyCompany.statusRegister = !dataTemp.estadoRegistro;
  }

  onUpdateStatus() {
    this.loading = true;
    this.companySvc.onDeleteCompany( this.bodyCompany ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertCompanyTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } con éxito`, css, 'alertCompanyTable');
        this.onResetForm();
        this.onGetListCompany(1);
      }
      $('#btnCloseConfirmCompany').trigger('click');
      this.loading = false;
    });
  }

  onSubmitCompany( $event ) {
    this.loading = true;

    if ( $event.valid ) {

      if ( !this.loadData ) {

        this.companySvc.onAddCompany( this.bodyCompany ).subscribe( (res: any) => {
          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            $('#btnCloseModalCompany').trigger('click');
            this.onResetForm();
            this.onGetListCompany(1);
          }
          this.loading = false;
        });

      } else {

        this.companySvc.onUpdateCompany( this.bodyCompany ).subscribe( (res: any) => {
          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            $('#btnCloseModalCompany').trigger('click');
            this.onResetForm();
            this.onGetListCompany(1);
          }
          this.loading = false;
        });

      }

    }
  }

  onResetForm() {
    $('#frmCompany').trigger('reset');
    this.bodyCompany = new CompanyModel();
    this.loadData = false;
    this.titleModal = 'Nueva emppresa';
    this.textButton = 'Guardar';
  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertCompanyTable' ) {

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
    const idComponent = showError === 0 ? 'alertCompanyTable' : 'alertCompanyModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('un registro con este ruc');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('con esta razón social');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No existe el pais especificado'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['No se encontró registro de empresa'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['¡Existen empleados con esta empresa, eliminar empleados!'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

}
