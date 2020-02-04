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
  dataArea: any[] = [];
  dataTypeDocument: any[] = [];
  bodyUser: UserModel;
  qEmployee = '';
  qDocumento = '';
  qsuario = '';
  qArea = '';
  qEmpresa = '';
  showInactive = false;
  loading = false;
  loadData = false;
  titleModal = 'Nuevo usuario';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };

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

  onEditUser( idUser: number ) {
    console.log('edit');
  }

  onShowConfirm( idUser: number ) {
    console.log('hello');
  }

  onResetForm() {
    console.log('reset form');
  }

  onUpdateStatus() {
    console.log('change status');
  }

  onSubmitUser( $event ) {
    console.log('submit');
  }

}
