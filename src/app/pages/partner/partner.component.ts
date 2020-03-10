import { Component, OnInit } from '@angular/core';
import { PagerService } from '../../services/pager.service';
import { ResponsableService } from '../../services/responsable.service';
import { PartnerModel } from 'src/app/models/partner.model';
import { PartnerService } from '../../services/partner.service';
import { UploadService } from '../../services/upload.service';
import { environment } from '../../../environments/environment';
import { EmployeeService } from '../../services/employee.service';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit {
  today = this.calendar.getToday();
  maxDate = this.calendar.getToday();

  isDisabled: any;
  isWeekend: any;
  brithDate = {
    year: this.calendar.getToday().year - 18,
    month: this.calendar.getToday().month,
    day: this.calendar.getToday().day
  };
  
  dataResponsable: any[] = [];
  dataCompany: any[] = [];
  dataTypeDocument: any[] = [];
  dataNationality: any[] = [];
  dataPartner: any[] = [];
  bodyPartner: PartnerModel;
  filePartner: File;
  qName = '';
  qDocument = '';
  qUsuario = '';
  qDirectCompany = '2';
  qAllow = '2';
  showInactive = false;
  loadImg = false;
  loadingTable = false;
  loadData = false;
  loading = false;
  validFile = false;
  validSizeFile = false;
  srcImage = './assets/vuexy/images/logo/no-image.jpg';
  titleModal = 'Nuevo socio';
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

  filesValid = ['JPG', 'JPEG', 'PNG'];

  constructor( private pagerSvc: PagerService,
    // tslint:disable-next-line: align
    private employeeSvc: EmployeeService,
    // tslint:disable-next-line: align
    private respSvc: ResponsableService,
    // tslint:disable-next-line: align
    private partnerSvc: PartnerService,
    // tslint:disable-next-line: align
    private uploadSvc: UploadService,
    // tslint:disable-next-line: align
    private calendar: NgbCalendar) { }

  ngOnInit() {
    
    this.isDisabled = (date: NgbDate, current: {month: number}) => date.month !== current.month;
    this.isWeekend = (date: NgbDate) =>  this.calendar.getWeekday(date) >= 6;

    this.bodyPartner = new PartnerModel();
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

    this.partnerSvc.onGetResponsable( '' ).subscribe( (res: any) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        this.dataResponsable = res.data;
    });

    this.onGetListPartner(1);
  }

  onGetListPartner(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }

    this.loadingTable = true;

    this.partnerSvc.onGetPartner( page, this.rowsForPage, this.qName, this.qDocument, this.qUsuario, this.qDirectCompany, this.qAllow, this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataPartner = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataPartner.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
      }

      this.loadingTable = false;

    });
    console.log('paginate');
  }

  onUpdateStatus() {
    this.loading = true;
    this.partnerSvc.onDeletePartner( this.bodyPartner ).subscribe( (res: any) =>{
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertPartnerTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } un socio con éxito`, css, 'alertPartnerTable');
        this.onResetForm();
        this.onGetListPartner(1);
      }
      $('#btnCloseConfirmPartner').trigger('click');
      this.loading = false;
    });
  }

  onResetForm() {
    $('#frmPartner').trigger('reset');
    this.bodyPartner = new PartnerModel();
    $('#frmPartner').trigger('refresh');
    // console.log(this.bodyPartner.dateBorn);
    this.srcImage = './assets/vuexy/images/logo/no-image.jpg';
    this.loadData = false;
    this.titleModal = 'Nuevo socio';
    this.textButton = 'Guardar';
    this.filePartner = null;

    this.bodyPartner.directToCompany = 'true' ;
    this.bodyPartner.allowBussiness = 'true' ;
    this.bodyPartner.idNationality = '170';
    $('#alertPartnerModal').html('');
    this.brithDate = {
      year: this.calendar.getToday().year - 18,
      month: this.calendar.getToday().month,
      day: this.calendar.getToday().day
    };
  }

  onSubmitPartner(frm: NgForm) {
    this.loading = true;
    // console.log('body socio', this.bodyPartner);
    // // tslint:disable-next-line: no-debugger
    // debugger;

    if (frm.valid) {

      const tempMonth = Number( this.brithDate.month ) < 9 ? '0' + this.brithDate.month : this.brithDate.month ;
      const tempDay = Number( this.brithDate.day ) < 9 ? '0' + ( Number( this.brithDate.day ) + 1 ) : ( Number( this.brithDate.day )  + 1 );

      this.bodyPartner.dateBorn = `${ this.brithDate.year }-${ tempMonth }-${ tempDay }`;

      if (!this.loadData) {
        this.partnerSvc.onAddPartner( this.bodyPartner ).subscribe( async (res: any) => {
          if (! res.ok) {
            throw new Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            if (this.filePartner !== null) {

              await this.onUploadImg( res.data.idPersona );

            }

            $('#btnCloseModalPartner').trigger('click');
            this.onResetForm();
            this.onGetListPartner(1);
          }
          this.loading = false;
        });
      } else {

        this.partnerSvc.onUpdatePartner( this.bodyPartner ).subscribe( async (res: any) => {
            if (! res.ok) {
              throw new Error( res.error );
            }

            const { message, css, idComponent } = this.onGetErrors( res.data.showError );
            this.onShowAlert(message, css, idComponent);

            if ( res.data.showError === 0) {
              if (this.filePartner !== null) {
                await this.onUploadImg( res.data.idPersona );
              }

              $('#btnCloseModalPartner').trigger('click');
              this.onResetForm();
              this.onGetListPartner(1);
            }
            this.loading = false;
        });

      }

    }
  }

  onUploadImg( idPartner: number ): Promise<boolean> {
    return new Promise( (resolve) => {
      this.uploadSvc.onUploadImg( 'user', idPartner , this.filePartner ).subscribe( (resUpload: any) => {
        if (! resUpload.ok) {
          console.warn(resUpload.error);
          resolve( true );
        }
  
        console.log('response upload', resUpload);

        resolve(true);
      });
    });
  }

  onChangeTypeDocument() {
    const dataTemp = this.dataTypeDocument.find( element => Number(element.idTipoDocumento) === Number(this.bodyPartner.idTypeDocument ) );

    if (dataTemp) {
      this.lenghtDocument = dataTemp.longitud;

      $('#txtDocPartner').attr({
        minlength: dataTemp.longitud
      });

      $('#txtDocPartner').trigger('reset');
    }
  }

  onEditPartner(idPartner: number) {
    const dataTemp = this.dataPartner.find( element => element.idSocio === idPartner  );
    if (!dataTemp) {
      throw new Error( 'No se encontró socio' );
    }

    this.loading = true;

    this.bodyPartner.idPartner = dataTemp.idSocio;
    this.bodyPartner.idResponsable = dataTemp.directoEmpresa ? null :  dataTemp.idResponsable;
    this.bodyPartner.idTypeDocument = dataTemp.idTipoDocumento;
    this.bodyPartner.idNationality = dataTemp.idNacionalidad;
    this.bodyPartner.directToCompany = dataTemp.directoEmpresa ? 'true' : 'false' ;
    this.bodyPartner.allowBussiness = dataTemp.habilitado ? 'true' : 'false' ;
    this.bodyPartner.document = dataTemp.documento;
    this.bodyPartner.name = dataTemp.nombre;
    this.bodyPartner.surname = dataTemp.apellido;
    this.bodyPartner.email = dataTemp.email;
    this.bodyPartner.phone = dataTemp.telefono || '';
    this.bodyPartner.address = dataTemp.direccion;
    this.bodyPartner.sex = dataTemp.sexo;

    const birthDate = new Date( dataTemp.fechaNacimiento );
    this.brithDate = {
      year : birthDate.getFullYear(),
      month : birthDate.getMonth() + 1,
      day : birthDate.getDate()
    };
    this.bodyPartner.nameUser = dataTemp.nombreUsuario;

    console.log(dataTemp);

    this.srcImage = environment.URI_API + `/Image/user/${dataTemp.imagen}?token=${ localStorage.getItem('token') }`;

    this.loadData = true;
    this.titleModal = 'Editar Socio';
    this.textButton = 'Guardar cambios';
    $('#btnShowModalPartner').trigger('click');
    this.loading = false;
  }

  onShowConfirm( idPartner: number ) {
    this.loading = true;
    const dataTemp = this.dataPartner.find( element => element.idSocio === idPartner  );
    if (!dataTemp) {
      throw new Error( 'No se encontró socio' );
    }

    this.bodyPartner.idPartner = dataTemp.idSocio;
    this.bodyPartner.statusRegister = !dataTemp.estadoRegistro;
    this.loading = false;
  }

  onChangeImg( file: FileList ) {
    this.filePartner = file.item(0);

    const auxtype = file[0].name;
    const typeFile = auxtype.split('.');
    const extension = typeFile[typeFile.length - 1];
    const size = parseFloat( (file[0].size / 1000).toFixed(2) );

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

    this.loadImg = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.srcImage = event.target.result;
      this.loadImg = false;
    };
    reader.readAsDataURL(this.filePartner);
  }

  onChangeDirectCompany() {
    if (this.bodyPartner.directToCompany) {
      this.bodyPartner.idResponsable = null;
    }
  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertPartnerTable' ) {

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
    const action = this.loadData ? 'actualizó' : 'agregó';
    let arrErrors = showError === 0 ? [`Se ${ action } un socio con éxito`] : ['Ya existe'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertPartnerTable' : 'alertPartnerModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('con este documento');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('con este usuario');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors.push('con este email');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['No existe la nacionalidad especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['No existe la empresa especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 64 ) {
      arrErrors = ['No existe el responsable especificado'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 128 ) {
      arrErrors = ['No se encontró registro del socio'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 256 ) {
      arrErrors = ['Existen sucursales para este socio, elimine sucursales primero'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

}
