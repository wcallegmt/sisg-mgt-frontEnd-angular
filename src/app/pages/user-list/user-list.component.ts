import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { PagerService } from '../../services/pager.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  dataUser: any[] = [];
  dataCompany: any[] = [];
  dataSede: any[] = [];
  dataArea: any[] = [];
  dataTypeDocument: any[] = [];
  dataNationality: any[] = [];
  bodyUser: UserModel;
  qEmployee = '';
  qDocumento = '';
  qsuario = '';
  qArea = '';
  qEmpresa = '';
  showInactive = false;
  loading = false;
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

  constructor(private userSvc: UserService, private pagerSvc: PagerService) { }

  ngOnInit() {
    this.bodyUser = new UserModel();

    this.userSvc.onGetCompanyAll( '' ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataCompany = res.data;
    });

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

    this.onGetListUser(1);
  }

  onGetListUser( page, chk = false ) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.userSvc.onGetListUser( page
                                , this.rowsForPage
                                , this.qEmployee
                                , this.qDocumento
                                , this.qsuario
                                , this.qArea
                                , this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataUser = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {
        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataUser.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }
    });
  }

  onChangeTypeDocument() {
    const dataTemp = this.dataTypeDocument.find( element => Number(element.idTipoDocumento) === Number(this.bodyUser.idTypeDocument ) );

    if (dataTemp) {
      this.lenghtDocument = dataTemp.longitud;
    }
  }

  onChangeCompany() {
    this.userSvc.onGetAreaOfCompany( this.bodyUser.idCompany ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataArea = res.data;
    });

    this.userSvc.onGetSedeAll( this.bodyUser.idCompany ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataSede = res.data;
    });

  }

  onEditUser( idEmpleado: number ) {
    const dataTemp = this.dataUser.find( element => element.idEmpleado === idEmpleado );
    if ( !dataTemp ) {
      throw new Error('No se encontró registro');
    }
    this.bodyUser.idEmployee = dataTemp.idEmpleado;
    this.bodyUser.idCompany = dataTemp.idEmpresa;
    this.bodyUser.idSede = dataTemp.idSede;
    this.bodyUser.idArea = dataTemp.idArea;
    this.bodyUser.idTypeDocument = dataTemp.idTipoDocumento;
    this.bodyUser.idNationality = dataTemp.idNacionalidad;
    this.bodyUser.document = dataTemp.documento;
    this.bodyUser.name = dataTemp.nombre;
    this.bodyUser.surname = dataTemp.apellido;
    this.bodyUser.email = dataTemp.email;
    this.bodyUser.phone = dataTemp.telefono;
    this.bodyUser.address = dataTemp.direccion;
    this.bodyUser.sex = dataTemp.sexo;
    this.bodyUser.dateBorn = dataTemp.fechaNacimiento;
    this.bodyUser.nameUser = dataTemp.nombreUsuario;
    this.onChangeCompany();
  }

  onShowConfirm( idEmpleado: number ) {
    const dataTemp = this.dataUser.find( element => element.idEmpleado === idEmpleado );

    if ( ! dataTemp ) {
      throw new Error('No se encontró área');
    }
    this.bodyUser.idEmployee = dataTemp.idEmpleado;
    this.bodyUser.idCompany = dataTemp.idEmpresa;
    this.bodyUser.statusRegister = !dataTemp.estadoRegistro;
  }

  onUpdateStatus() {
    this.loading = true;
    this.userSvc.onDeleteUser( this.bodyUser ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertCompanyTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } con éxito`, css, 'alertUserTable');
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
      this.userSvc.onUpdateUser( this.bodyUser ).subscribe( (res: any) => {
        if ( !res.ok ) {
          throw new Error( res.error );
        }

        const { message, css , idComponent} = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css, idComponent);

        if ( res.data.showError === 0) {
          $('#frmUserEdit').trigger('reset');
          this.bodyUser = new UserModel();
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

  onShowAlert( msg = '', css = 'success', idAlert = 'alertUserTable' ) {

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
    const arrErrors = showError === 0 ? [`Se insertó con éxito`] : ['Ya existe un registro'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertUserTable' : 'alertUserModal';
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
      arrErrors.push('tipo de documento inválido');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors.push('empresa inválida');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors.push('área inválida');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors.push('nacionalidad inválida');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 128 ) {
      arrErrors.push('sede inválida');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 256 ) {
      arrErrors.push('No se enconró registro');
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

}
