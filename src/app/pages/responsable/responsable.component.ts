import { Component, OnInit } from '@angular/core';
import { ResponsableModel, ComisionResponsableModel } from 'src/app/models/responsable.model';
import { PagerService } from '../../services/pager.service';
import { ResponsableService } from '../../services/responsable.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsableComponent implements OnInit {
  dataResponsable: any[] = [];
  dataCompany: any[] = [];
  dataTypeDocument: any[] = [];
  dataNationality: any[] = [];
  dataProduct: any[] = [];
  bodyResponsable: ResponsableModel;
  qName = '';
  qDocument = '';
  qUsuario = '';
  qTypeSeller = '';
  showInactive = false;
  loading = false;
  loadData = false;
  titleModal = 'Nuevo responsable';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };
  lenghtDocument = 8;

  constructor( private pagerSvc: PagerService, private respSvc: ResponsableService, private userSvc: UserService ) { }

  ngOnInit() {
    this.bodyResponsable = new ResponsableModel();

    this.userSvc.onGetTypeDocument().subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataTypeDocument = res.data;
    });

    this.userSvc.onGetNationaltity('').subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataNationality = res.data;
    });

    this.respSvc.onGetListProduct( '' ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataProduct = res.data;
    });

    this.onGetListResponsable(1);
  }

  onGetListResponsable( page: number, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.respSvc.onGetListresponsable( page, this.rowsForPage, this.qName, this.qDocument, this.qUsuario, this.qTypeSeller, this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataResponsable = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataResponsable.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }
    });
  }

  onEditResponsable( idResponsable: number ) {
    console.log('click');
  }

  onShowConfirm( idResponsable: number ) {
    console.log('lorem');
  }

  onSubmitResponsable( $event ) {
    if ($event.valid) {
      console.log('submit responsable', this.bodyResponsable);
      if (!this.loadData) {
        this.respSvc.onAddResponsable( this.bodyResponsable ).subscribe( (res: any) => {
          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            $('#btnCloseModalArea').trigger('click');
            this.onResetForm();
            this.onGetListResponsable(1);
          }
          this.loading = false;
        });
      }
    }
  }

  onResetForm() {
    console.log('reset');
  }

  onUpdateStatus() {
    console.log('change');
  }

  onChangeTypeDocument() {
    console.log('change doc');
  }

  onAddComision() {
    this.bodyResponsable.comision.push( new ComisionResponsableModel() );
  }

  onDeleteComission(index: number) {
    this.bodyResponsable.comision[index] = null;
    this.bodyResponsable.comision = this.bodyResponsable.comision.filter( element => element !== null );
  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertResponsableModal' ) {

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
    const idComponent = showError === 0 ? 'alertResponsableTable' : 'alertResponsableModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('un registro con este documento');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('con este usuario');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No se encontró registro de nacionalidad'];
    }
    
    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['No se encontró registro de empresa'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }
}
