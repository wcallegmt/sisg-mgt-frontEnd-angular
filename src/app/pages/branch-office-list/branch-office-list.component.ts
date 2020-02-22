import { Component, OnInit } from '@angular/core';
import { BranchOfficeService } from '../../services/branch-office.service';
import { PagerService } from '../../services/pager.service';
import { BranchOfficeModel, ComisionPartnerModel } from 'src/app/models/branchOffice.model';
import { ResponsableService } from '../../services/responsable.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-branch-office-list',
  templateUrl: './branch-office-list.component.html',
  styleUrls: ['./branch-office-list.component.css']
})
export class BranchOfficeListComponent implements OnInit {

  dataBranchOffice: any[] = [];

  dataPartner: any[] = [];
  dataDepartment: any[] = [];
  dataProvince: any[] = [];
  dataDistrit: any[] = [];
  dataProduct: any[] = [];

  bodyBranchEdit: BranchOfficeModel;

  showInactive = false;
  loading = false;
  actionConfirm = 'eliminar';

  rowsForPage = 10;
  qName = '';
  qType = 'ALL';
  qUbigeo = '';
  qDoc = '';
  qPartner = '';

  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0 
  };
  constructor(private branchSvc: BranchOfficeService, private pagerSvc: PagerService, private respSvc: ResponsableService) { }

  ngOnInit() {
    this.branchSvc.onPartnetGetAll( '' ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataPartner = res.data;
    });

    this.branchSvc.onGetDepartment( '' ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataDepartment = res.data;
    });

    this.respSvc.onGetListProduct( '' ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataProduct = res.data;
    });

    this.onGetListBranch(1);
    this.bodyBranchEdit = new BranchOfficeModel();
  }

  onChangePartner() {
    const dataTemp = this.dataPartner.find( element => element.idSocio === Number(this.bodyBranchEdit.idPartner) );
    if (!dataTemp) {
      throw new Error('No se encontró socio' );
    }

    this.bodyBranchEdit.namePartner = dataTemp.documento;
  }

  onGetListBranch( page: number, chk = false ) {

    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.branchSvc.onGetBranchOffice(page, this.rowsForPage, this.qName, this.qType, this.qUbigeo, this.qPartner, this.qDoc, this.showInactive ).subscribe( (res: any) => {

      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataBranchOffice = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataBranchOffice.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;

      }

    });
  }

  onEditBranch( idBranch: number ) {
    const dataTemp = this.dataBranchOffice.find( element => element.idSucursal === idBranch );

    if (!dataTemp) {
      throw new Error( 'No se encontró registro de sucursal' );
    }

    this.branchSvc.onGetProvince( '', dataTemp.departamento ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProvince = res.data;
    });

    this.branchSvc.onGetDistrit( '', dataTemp.departamento, dataTemp.provincia ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataDistrit = res.data;
    });

    this.bodyBranchEdit.idBranchOffice = dataTemp.idSucursal;
    this.bodyBranchEdit.nameBranch = dataTemp.nombreSucursal;
    this.bodyBranchEdit.addressBranch = dataTemp.direccionSucursal;
    this.bodyBranchEdit.ubigeo = dataTemp.ubigeo;
    this.bodyBranchEdit.department = dataTemp.departamento;
    this.bodyBranchEdit.province = dataTemp.provincia;
    this.bodyBranchEdit.distrit = dataTemp.distrito;
    this.bodyBranchEdit.width = dataTemp.ancho;
    this.bodyBranchEdit.height = dataTemp.alto;
    this.bodyBranchEdit.large = dataTemp.largo;
    this.bodyBranchEdit.idPartner = dataTemp.idSocio;
    this.bodyBranchEdit.typeBranch = dataTemp.tipoSucursal;
    this.bodyBranchEdit.categorie = dataTemp.categoriaSucursal;
    this.bodyBranchEdit.namePartner = dataTemp.documento;
    // this.bodyBranchEdit.comission = [];

    this.branchSvc.onGetComisionBranch( dataTemp.idSucursal ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.bodyBranchEdit.comission = res.data;
    });
  }

  onEditGeoLocation( idBranch: number ) {

  }

  onShowConfirm( idBranch: number ) {
    const dataTemp = this.dataBranchOffice.find( element => element.idSucursal === idBranch );

    if (!dataTemp) {
      throw new Error( 'No se encontró registro de sucursal' );
    }
    console.log(dataTemp);
    this.bodyBranchEdit.idBranchOffice = dataTemp.idSucursal;
    this.bodyBranchEdit.statusRegister = !dataTemp.estadoRegistro;
  }

  onSubmitBranch( form: any ) {
    if (form.valid) {

      let verifyProduct = true;
      let verifyPercentPartner = true;
      let verifyPercentCompany = true;
      let verifyHundred = true;

      for (const comission of this.bodyBranchEdit.comission) {
        if ( !comission.idProduct || comission.idProduct === 0  ) {
          verifyProduct = false;
        }

        if (!comission.percentPartner || comission.percentPartner <= 0) {
          verifyPercentPartner = false;
        }

        if (!comission.percentCompany || comission.percentCompany <= 0) {
          verifyPercentCompany = false;
        }

        if ((comission.percentPartner + comission.percentCompany) !== 100 ) {
          verifyHundred = false;
        }
      }

      if ( !verifyProduct || !verifyPercentPartner || !verifyPercentCompany ) {
        this.onShowAlert( `Verifique los datos comisión por producto, especifique los productos, los porcentajes no pueden ser menor o igual a 0.`, 'warning', 'alertBranchDetail' );
        return;
      } else if( !verifyHundred ) {
        this.onShowAlert( `Por favor asegurese que la suma del porcentaje entre el socio y la empresa sea igual a 100.`, 'warning', 'alertBranchDetail' );
        return;
      }

      this.loading = true;

      this.branchSvc.onUpdateBranchOffice( this.bodyBranchEdit ).subscribe( (res: any) => {
        if ( !res.ok ) {
          throw new Error( res.error );
        }

        const { message, css, idComponent } = this.onGetErrors( res.data.showError );
        const { messageDetail, cssDetail, successComission } = this.onGetErrorsDetail( res.errorsDetail );

        
        if ( res.data.showError === 0 && successComission) {
          this.onShowAlert(message, css, idComponent);
          $('#btnCloseModalBranch').trigger('click');
          this.onResetForm();
          this.onGetListBranch(1);
        }

        if (!successComission) {
          this.onShowAlert( messageDetail, cssDetail, 'alertBranchDetail' );
        }

        this.loading = false;
      });
    }
  }

  onResetForm() {
    $('#frmBranchEdit').trigger('reset');
    this.bodyBranchEdit = new BranchOfficeModel();
  }

  onUpdateStatus() {
    this.loading = true;

    this.branchSvc.onDeleteBranchOffice( this.bodyBranchEdit ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertBranchTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } con éxito`, css, 'alertBranchTable');
        this.onResetForm();
        this.onGetListBranch(1);
      }
      $('#btnCloseConfirmBrancdh').trigger('click');
      this.loading = false;
    });
  }

  onChangeDepartment() {
    this.branchSvc.onGetProvince( '', this.bodyBranchEdit.department ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProvince = res.data;
    });
  }

  onChangeProvince() {
    this.branchSvc.onGetDistrit( '', this.bodyBranchEdit.department, this.bodyBranchEdit.province ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataDistrit = res.data;
    });
  }

  onChangeDistrit() {
    const dataTemp = this.dataDistrit.find( element => element.codigoDistrito === this.bodyBranchEdit.distrit );
    if (!dataTemp) {
      throw new Error('No se encontró distrito' );
    }

  }

  onAddComision() {
    this.bodyBranchEdit.comission.push( new ComisionPartnerModel() );
  }

  onChangeProductPartner(indexComision: number) {
    const comisionCurrent = this.bodyBranchEdit.comission[indexComision];
    // console.log('current', comisionCurrent);
    const countRepeat = this.bodyBranchEdit.comission.filter( element => Number(element.idProduct) === Number(comisionCurrent.idProduct) ).length;
    if (countRepeat > 1) {
      $('#frmComissionPartner').trigger('reset');
      this.bodyBranchEdit.comission[indexComision].idProduct = null;
    }
  }

  onDeleteComission(index: number) {
    this.bodyBranchEdit.comission[index] = null;
    this.bodyBranchEdit.comission = this.bodyBranchEdit.comission.filter( element => element !== null );
  }

  onShowAlert( msg = '', css = 'success', idComponent = '' ) {

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
    let arrErrors = showError === 0 ? [`Se insertó con éxito`] : ['Ya existe'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertBranchTable' : 'alertBranchModal';
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
      arrErrors = ['No se encontró registro de socio'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No se encontró registro de sucursal'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['No se encontró registro de empresa'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['No se encontró registro de comisión por producto'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors = ['¡Existen gastos asociados a esta sucursal, elimine gastos primero!'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

  onGetErrorsDetail( errors: any[] ) {
    let successComission = true;
    const arrErrors = [];
    const cssDetail = errors.length === 0 ? 'success' : 'danger';

    for (const item of errors) {

      // tslint:disable-next-line: no-bitwise
      if ( Number(item.showError) & 1 ) {
        successComission = false;
        arrErrors.push('No se encontró registro de socio');
      }

      // tslint:disable-next-line: no-bitwise
      if ( Number(item.showError) & 2 ) {
        successComission = false;
        arrErrors.push('No se encontró registro de sucursal');
      }

      // tslint:disable-next-line: no-bitwise
      if ( Number(item.showError) & 4 ) {
        successComission = false;
        arrErrors.push('Ya existe una comisión con el mismo producto');
      }

      // tslint:disable-next-line: no-bitwise
      if ( Number(item.showError) & 8 ) {
        successComission = false;
        arrErrors.push('No se encontró registro del detalle');
      }

    }


    return { messageDetail: arrErrors.join(', '), cssDetail , successComission};

  }
}
