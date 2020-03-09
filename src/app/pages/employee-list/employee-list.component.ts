import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { PagerService } from '../../services/pager.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  today = new Date();
  month = this.today.getMonth() + 1;
  maxDate = `${ this.today.getFullYear() - 18 }-${ 12 }-${31}`;

  dataEmployee: any[] = [];
  dataCompany: any[] = [];
  dataSede: any[] = [];
  dataArea: any[] = [];
  dataTypeDocument: any[] = [];
  dataNationality: any[] = [];
  bodyEmployee: EmployeeModel;
  qEmployee = '';
  qDocumento = '';
  qsuario = '';
  qArea = '';
  qEmpresa = '';
  showInactive = false;
  loading = false;
  loadingTable = false;
  loadData = false;
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };
  lenghtDocument = 8;

  constructor(private employeeSvc: EmployeeService, private pagerSvc: PagerService) { }

  ngOnInit() {
    this.bodyEmployee = new EmployeeModel();

    this.employeeSvc.onGetCompanyAll( '' ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataCompany = res.data;
    });

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

    this.onGetListUser(1);
  }

  onGetListUser( page, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }
    
    this.loadingTable = true;

    this.employeeSvc.onGetListEmployee( page
                                , this.rowsForPage
                                , this.qEmployee
                                , this.qDocumento
                                , this.qsuario
                                , this.qArea
                                , this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataEmployee = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {
        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataEmployee.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }
      
      this.loadingTable = false;

    });
  }

  onChangeTypeDocument() {
    const dataTemp = this.dataTypeDocument.find( element => Number(element.idTipoDocumento) === Number(this.bodyEmployee.idTypeDocument ) );

    if (dataTemp) {
      this.lenghtDocument = dataTemp.longitud;
    }
  }

  onChangeCompany() {
    this.employeeSvc.onGetAreaOfCompany( this.bodyEmployee.idCompany ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataArea = res.data;
    });

    this.employeeSvc.onGetSedeAll( this.bodyEmployee.idCompany ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataSede = res.data;
    });

  }

  onResetForm() {
    $('#frmEmployeeEdit').trigger('reset');
    this.bodyEmployee = new EmployeeModel();
    $('#alertEmployeeModal').html('');
  }

  onEditUser( idEmpleado: number ) {
    const dataTemp = this.dataEmployee.find( element => element.idEmpleado === idEmpleado );
    if ( !dataTemp ) {
      throw new Error('No se encontró registro');
    }
    this.bodyEmployee.idEmployee = dataTemp.idEmpleado;
    this.bodyEmployee.idCompany = dataTemp.idEmpresa;
    this.bodyEmployee.idSede = dataTemp.idSede;
    this.bodyEmployee.idArea = dataTemp.idArea;
    this.bodyEmployee.idTypeDocument = dataTemp.idTipoDocumento;
    this.bodyEmployee.idNationality = dataTemp.idNacionalidad;
    this.bodyEmployee.document = dataTemp.documento;
    this.bodyEmployee.name = dataTemp.nombre;
    this.bodyEmployee.surname = dataTemp.apellido;
    this.bodyEmployee.email = dataTemp.email;
    this.bodyEmployee.phone = dataTemp.telefono;
    this.bodyEmployee.address = dataTemp.direccion;
    this.bodyEmployee.sex = dataTemp.sexo;
    
    const dateBornTemp  = new Date(dataTemp.fechaNacimiento);
    const month = (dateBornTemp.getMonth() + 1);
    const day = dateBornTemp.getDate() < 10 ? '0' + dateBornTemp.getDate() : dateBornTemp.getDate();
    // this.bodyEmployee.dateBorn = dataTemp.fechaNacimiento;

    this.bodyEmployee.dateBorn = `${dateBornTemp.getFullYear()}-${ month < 10 ? '0' + month : month  }-${ day }`;
    console.log(this.bodyEmployee.dateBorn);
    $('#dtpBorn').val( this.bodyEmployee.dateBorn );
    this.bodyEmployee.nameUser = dataTemp.nombreUsuario;
    this.onChangeCompany();
  }

  onShowConfirm( idEmpleado: number ) {
    const dataTemp = this.dataEmployee.find( element => element.idEmpleado === idEmpleado );

    if ( ! dataTemp ) {
      throw new Error('No se encontró área');
    }
    this.bodyEmployee.idEmployee = dataTemp.idEmpleado;
    this.bodyEmployee.idCompany = dataTemp.idEmpresa;
    this.bodyEmployee.statusRegister = !dataTemp.estadoRegistro;
  }

  onUpdateStatus() {
    this.loading = true;
    this.employeeSvc.onDeleteEmployee( this.bodyEmployee ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertCompanyTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } un empleado con éxito`, css, 'alertEmployeeTable');
        $('#btnCloseConfirmUser').trigger('click');
        // this.onResetForm();
        this.onGetListUser(1);
      }
      this.loading = false;
    });
  }

  onSubmitUser( $event ) {
    this.loading = true;
    if ($event.valid) {
      this.employeeSvc.onUpdateEmployee	( this.bodyEmployee ).subscribe( (res: any) => {
        if ( !res.ok ) {
          throw new Error( res.error );
        }

        const { message, css , idComponent} = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css, idComponent);

        if ( res.data.showError === 0) {
          $('#frmUserEdit').trigger('reset');
          this.bodyEmployee = new EmployeeModel();
          $('#btnCloseModalUser').trigger('click');
          this.onGetListUser(1);
        }
        this.loading = false;
      });
    }
  }

  onRestorePassword( idEmployee: number ) {
    console.log('restore password');
  }

  onShowAlert( msg = '', css = 'success', idAlert = 'alertEmployeeTable' ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;

    $(`#${ idAlert }`).html(htmlAlert);
  }

  onGetErrors( showError: number ) {
    const arrErrors = showError === 0 ? [`Se actualizó un empleado con éxito`] : ['Ya existe un registro'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertEmployeeTable' : 'alertEmployeeModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('con este Nro. documento');
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
      arrErrors.push('con este email');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors.push('tipo de documento inválido');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors.push('empresa inválida');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors.push('área inválida');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 128 ) {
      arrErrors.push('nacionalidad inválida');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 256 ) {
      arrErrors.push('sede inválida');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 512 ) {
      arrErrors.push('No se enconró registro');
    }

    return { message: `${ arrErrors.join(', ') }.`, css, idComponent };

  }

}
