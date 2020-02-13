import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel } from '../../models/employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  today = new Date();
  month = this.today.getMonth() + 1;
  maxDate = `${ this.today.getFullYear() - 15 }-${this.month < 10 ? '0' + this.month : this.month }-${this.today.getDate()}`;
  dataCompany: any[] = [];
  dataSede: any[] = [];
  dataArea: any[] = [];
  dataTypeDocument: any[] = [];
  dataNationality: any[] = [];
  bodyEmployee: EmployeeModel;

  loading = false;

  lenghtDocument = 8;

  constructor( private employeeSvc: EmployeeService ) { }

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

  onSubmitForm( $event ) {
    this.loading = true;
    if ($event.valid) {
      this.employeeSvc.onAddEmployee( this.bodyEmployee ).subscribe( (res: any) => {
        if ( !res.ok ) {
          throw new Error( res.error );
        }

        const { message, css } = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css);

        if ( res.data.showError === 0) {
          $('#frmEmployee').trigger('reset');
          this.bodyEmployee = new EmployeeModel();
        }
        this.loading = false;
      });
    }
  }

  onShowAlert( msg = '', css = 'success' ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;

    $(`#alertUser`).html(htmlAlert);
  }

  onGetErrors( showError: number ) {
    const arrErrors = showError === 0 ? [`Se insertó con éxito`] : ['Ya existe un registro'];
    const css = showError === 0 ? 'success' : 'danger';
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

    return { message: arrErrors.join(', '), css };

  }

}
