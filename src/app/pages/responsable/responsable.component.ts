import { Component, OnInit } from '@angular/core';
import { ResponsableModel, ComisionResponsableModel } from 'src/app/models/responsable.model';
import { PagerService } from '../../services/pager.service';
import { ResponsableService } from '../../services/responsable.service';
import * as $ from 'jquery';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsableComponent implements OnInit {
  today = new Date();
  month = this.today.getMonth() + 1;
  maxDate = `${ this.today.getFullYear() - 15 }-${this.month < 10 ? '0' + this.month : this.month }-${this.today.getDate()}`;
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

  constructor( private pagerSvc: PagerService, private respSvc: ResponsableService, private employeeSvc: EmployeeService ) { }

  ngOnInit() {
    this.bodyResponsable = new ResponsableModel();

    this.employeeSvc.onGetTypeDocument().subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataTypeDocument = res.data;
    });

    this.employeeSvc.onGetNationaltity('').subscribe( (res: any) => {
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
    const dataTemp = this.dataResponsable.find( element => element.idResponsable ===  idResponsable);
    if (!dataTemp) {
      throw Error('No se encontró empleado');
    }

    this.loading = true;

    this.respSvc.onGetComisionResponsable( dataTemp.idResponsable ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }
      const dateBornTemp  = new Date(dataTemp.fechaNacimiento);
      const month = (dateBornTemp.getMonth() + 1);
      this.loadData = true;

      this.bodyResponsable.idResponsable = dataTemp.idResponsable;
      this.bodyResponsable.idTypeDocument = dataTemp.idTipoDocumento;
      this.bodyResponsable.idNationality = dataTemp.idNacionalidad;
      this.bodyResponsable.typeSeller = dataTemp.tipoVendedor;
      this.bodyResponsable.document = dataTemp.documento;
      this.bodyResponsable.name = dataTemp.nombre;
      this.bodyResponsable.surname = dataTemp.apellido;
      this.bodyResponsable.email = dataTemp.email;
      this.bodyResponsable.phone = dataTemp.telefono;
      this.bodyResponsable.address = dataTemp.direccion;
      this.bodyResponsable.dateBorn = `${dateBornTemp.getFullYear()}-${ month < 10 ? '0' + month : month  }-${dateBornTemp.getDate()}`;
      this.bodyResponsable.sex = dataTemp.sexo;
      this.bodyResponsable.nameUser = dataTemp.nombreUsuario;
      this.bodyResponsable.comision = res.data;
      $('#btnShowModalResponsable').trigger('click');
      this.loading = false;
    });


    console.log('click');
  }

  onShowConfirm( idResponsable: number ) {
    const dataTemp = this.dataResponsable.find( element => element.idResponsable ===  idResponsable);
    if (!dataTemp) {
      throw Error('No se encontró empleado');
    }

    this.bodyResponsable.idResponsable = dataTemp.idResponsable;
    this.bodyResponsable.statusRegister = !dataTemp.estadoRegistro;
  }

  onSubmitResponsable( $event ) {
    this.loading = true;
    if ($event.valid) {
      if (!this.loadData) {
        this.respSvc.onAddResponsable( this.bodyResponsable ).subscribe( (res: any) => {

          if ( !res.ok ) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          const { messageComission, cssComission, successComission } = this.onGetErrorsComission( res.errorsComission );

          if ( res.data.showError === 0 && successComission === false ) {
            $('#btnCloseModalResponsable').trigger('click');
            this.onResetForm();
            this.onGetListResponsable(1);
            this.onShowAlert(message, css, idComponent);
            this.onShowAlertComission(messageComission, cssComission, 'alertResponsableComissionTable');
          } else {
            if (res.data.showError !== 0) {
              this.onShowAlert(message, css);
            }
            this.onShowAlertComission(messageComission, cssComission);
          }

          this.loading = false;
        });
      } else {

        this.respSvc.onUpdateResponsable( this.bodyResponsable ).subscribe( (res: any) => {
          if ( !res.ok ) {
            throw new Error( res.error );
          }
        
          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          const { messageComission, cssComission, successComission } = this.onGetErrorsComission( res.errorsComission );

          if ( res.data.showError === 0 && successComission ) {
            $('#btnCloseModalResponsable').trigger('click');
            this.onResetForm();
            this.onGetListResponsable(1);
            this.onShowAlert(message, css, idComponent);
          } else {
            if (res.data.showError !== 0) {
              this.onShowAlert(message, css);
            }
            this.onShowAlertComission(messageComission, cssComission);
          }

          this.loading = false;

        });

        // console.log('submit responsable', this.bodyResponsable);
      }
    }
  }

  onResetForm() {
    this.bodyResponsable = new ResponsableModel();
    $('#frmResponsable').trigger('reset');
    this.loadData = false;
    this.titleModal = 'Nuevo responsable';
    this.textButton = 'Guardar';
  }

  onUpdateStatus() {
    this.loading = true;

    this.respSvc.onDeleteResponsable( this.bodyResponsable ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertResponsableTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } con éxito`, css, 'alertResponsableTable');
        this.onResetForm();
        this.onGetListResponsable(1);
      }
      $('#btnCloseConfirmResponsable').trigger('click');
      this.loading = false;
    });
  }

  onChangeTypeDocument() {
    const dataTemp = this.dataTypeDocument.find( element => Number(element.idTipoDocumento) === Number(this.bodyResponsable.idTypeDocument ) );

    if (dataTemp) {
      this.lenghtDocument = dataTemp.longitud;
    }
  }

  onAddComision() {
    this.bodyResponsable.comision.push( new ComisionResponsableModel() );
  }

  onChangeProductResp( indexComision: number ) {
    const comisionCurrent = this.bodyResponsable.comision[indexComision];
    // console.log('current', comisionCurrent);
    const countRepeat = this.bodyResponsable.comision.filter( element => element.idProduct === comisionCurrent.idProduct ).length;
    if (countRepeat > 1) {
      $('#frmComission').trigger('reset');
      this.bodyResponsable.comision[indexComision].idProduct = null;
      // console.log(countRepeat);
    }
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

  onShowAlertComission( msg = '', css = 'success', idComponent = 'alertResponsableComission' ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;
    htmlAlert += ``;
    
    $(`#${idComponent}`).html(htmlAlert);
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

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['No se encontró registro del responsable'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors = ['¡Existen socios relacionados con este responsable, elimine socio!'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

  onGetErrorsComission( arrError: any[] ) {
    console.log(arrError);
    let successComission = true;
    const arrMessages = [];
    const cssComission = arrError.length > 0 ? 'danger' : 'success';

    for (const error of arrError) {

      // tslint:disable-next-line: no-bitwise
      if (Number(error.showError) & 64) {
        successComission = false;
        arrMessages.push('No se encontró registro de producto');
      }

      // tslint:disable-next-line: no-bitwise
      if (Number(error.showError) & 128) {
        successComission = false;
        arrMessages.push('No se encontró registro de producto');
      }

      // tslint:disable-next-line: no-bitwise
      if (Number(error.showError) & 256) {
        successComission = false;
        const dataProductTemp = this.dataProduct.find( element => element.idProducto === Number(error.idProduct) );
        let nameProduct = '';
        if (dataProductTemp) {
          nameProduct = dataProductTemp.nombreProducto;
        }
        arrMessages.push('Ya existe una comisión con el producto: ' + nameProduct);
      }

    }

    return { messageComission: arrMessages.join(', '), cssComission, successComission };
  }
}
