import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel } from '../../models/employee.model';
import { UploadService } from '../../services/upload.service';

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

  fileEmploye: File;

  srcImage = './assets/vuexy/images/logo/no-image.jpg';

  loading = false;
  loadImg = false;
  validFile = false;
  validSizeFile = false;

  lenghtDocument = 8;

  filesValid = ['JPG', 'JPEG', 'PNG'];

  constructor( private employeeSvc: EmployeeService, private uploadSvc: UploadService ) { }

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

      this.employeeSvc.onAddEmployee( this.bodyEmployee ).subscribe( async (res: any) => {
        if ( !res.ok ) {
          throw new Error( res.error );
        }

        const { message, css } = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css);

        if ( res.data.showError === 0) {

          if (this.fileEmploye !== null) {
            await this.onUpload( res.data.idPersona );
          }


          $('#frmEmployee').trigger('reset');
          this.bodyEmployee = new EmployeeModel();
          this.fileEmploye = null;

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
    let arrErrors = showError === 0 ? [`Se agrego un empleado con éxito`] : ['Ya existe un empleado'];
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
      arrErrors.push('con este email');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['No se encontró tipo de documento'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['No se encontró la empresa especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors = ['No se encontró el área especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 128 ) {
      arrErrors = ['No se encontró la nacionalidad especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 256 ) {
      arrErrors = ['No se encontró la sede especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 512 ) {
      arrErrors = ['No se encontró la empresa especificada'];
    }

    return { message: arrErrors.join(', '), css };

  }

  onChangeImg( file: FileList ) {
    this.loadImg = true;
    this.fileEmploye = file.item(0);
    const auxtype = file[0].name;
    const typeFile = auxtype.split('.');
    const extension = typeFile[typeFile.length - 1];
    const size = parseFloat( (file[0].size / 1000).toFixed(2) );
    // console.log( extension.toUpperCase() );
    

    if (this.filesValid.indexOf( extension.toUpperCase() ) < 0) {
      this.validFile = false;
      this.loadImg = false;
      // this.srcImage = './assets/images/005-declined.png';
      return;
    }

    if (size > 250) {
      this.validSizeFile = false;
      this.loadImg = false;
      return;
    }

    this.validFile = true;
    this.validSizeFile = true;

    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.srcImage = event.target.result;
      this.loadImg = false;
    };
    reader.readAsDataURL(this.fileEmploye);
    // this.srcImage = './assets/images/001-accepted.png';
    // this.fileEmploye = file.item(0);
  }


  onUpload( id: number ): Promise<any> {
    return new Promise( (resolve) => {
      this.uploadSvc.onUploadImg( 'user', id , this.fileEmploye ).subscribe( (resUpload: any) => {
        if (! resUpload.ok) {
          throw new Error( resUpload.error );
        }

        console.log('response upload', resUpload);
        resolve( {ok: true} );
      });
    });
  }


}
