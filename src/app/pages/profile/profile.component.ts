import { Component, OnInit } from '@angular/core';
import { ProfileModel, ProfileInfoModel, ChangePasswordModel } from '../../models/profile.model';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { EmployeeService } from '../../services/employee.service';
import * as $ from 'jquery';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  dataTypeDocument: any[] = [];
  dataNationality: any[] = [];
  dataLanguage: any[] = [];

  bodyProfile: ProfileModel;
  bodyProfileInfo: ProfileInfoModel;
  bodyChangePassword: ChangePasswordModel;

  fileProfile: File = null;
  srcImage = 'no image';
  ladingImg = false;
  loading = false;
  maxDate = new Date();

  lenghtDocument = 8;

  constructor(private userSvc: UserService, private employeeSvc: EmployeeService, private uploadSvc: UploadService) { }

  ngOnInit() {


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

    this.userSvc.onGetLanguage().subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataLanguage = res.data;

    });

    this.bodyProfile = new ProfileModel();
    this.bodyProfileInfo = new ProfileInfoModel();
    this.bodyChangePassword = new ChangePasswordModel();

    this.onLoadDataProfile();
    this.onLoadDataProfileInfo();
  }

  onLoadDataProfile() {
    this.userSvc.onGetProfile().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      const dataNat = this.dataNationality.find( element => element.idNacionalidad === res.data.idNacionalidad );
      if (dataNat) {
        this.bodyProfile.nameNationality = dataNat.nombrePais || 'Sin especificar' ;
      }

      this.bodyProfile.idTypeDocument = res.data.idTipoDocumento;
      this.bodyProfile.idNationality = res.data.idNacionalidad;
      this.bodyProfile.document = res.data.documento;
      this.bodyProfile.name = res.data.nombre;
      this.bodyProfile.surname = res.data.apellido;
      this.bodyProfile.email = res.data.email;
      this.bodyProfile.phone = res.data.telefono || '(+00) 000 0000';
      this.bodyProfile.address = res.data.direccion;
      this.bodyProfile.sex = res.data.sexo;

      if (res.data.fechaNacimiento) {
        const dateTemp = new Date( res.data.fechaNacimiento );
        const month = dateTemp.getMonth() < 10 ? `0${dateTemp.getMonth() + 1}` : dateTemp.getMonth() + 1;
        this.bodyProfile.dateBorn = `${ dateTemp.getFullYear() }-${ month }-${ dateTemp.getDate() }`;
      }

      // this.bodyProfile.dateBorn = res.data.fechaNacimiento;
      this.bodyProfile.nameUser = res.data.nombreUsuario;
      this.bodyProfile.dateRegister = res.data.fechaRegistro || new Date();


      this.srcImage = `${ environment.URI_API }/Image/user/${ res.data.imagen }?token=${ localStorage.getItem('token') }`;

    });
  }

  onLoadDataProfileInfo() {
    this.userSvc.onGetProfile().subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.bodyProfileInfo.aboutMe = res.data.sobreMi || '';
      this.bodyProfileInfo.facebook = res.data.linkFacebook || '';
      this.bodyProfileInfo.instagram = res.data.linkInstagram || '';
      this.bodyProfileInfo.google = res.data.linkGoogle || '';

      let languages = ['ES'];
      if (res.data.idiomas) {
        const temp = res.data.idiomas.toString();
        languages = temp.split(',');
      }

      this.bodyProfileInfo.languages = languages;
    });

  }

  onChangeNationality() {
    const dataNat = this.dataNationality.find( element => element.idNacionalidad === Number(this.bodyProfile.idNationality) );
    if (dataNat) {
      this.bodyProfile.nameNationality = dataNat.nombrePais || 'Sin especificar' ;
    }
  }

  onChangeUploadProfile( file: FileList ) {
    this.fileProfile = file.item(0);
    this.ladingImg = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.srcImage = event.target.result;
      this.ladingImg = false;
    };
    reader.readAsDataURL(this.fileProfile);
  }

  onChangeTypeDocument() {
    const dataTemp = this.dataTypeDocument.find( element => Number(element.idTipoDocumento) === Number(this.bodyProfile.idTypeDocument ) );

    if (dataTemp) {
      this.lenghtDocument = dataTemp.longitud;
    }
  }

  onSubmitProfile( form: any ) {
    if (form.valid) {
      this.loading = true;

      this.userSvc.onUpdateProfile( this.bodyProfile ).subscribe( (res: any) => {

        if (!res.ok) {
          throw new Error( res.error );
        }

        if (Number(res.data.showError) === 0) {

          if (this.fileProfile !== null) {

            this.uploadSvc.onUploadImg( 'user', res.data.idUser, this.fileProfile ).subscribe( (resUpload: any) => {
              if (!resUpload.ok) {
                throw new Error( resUpload.error );
              }

            });

          }

        }

        const { message, css } = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css, 'alertProfile');
        this.loading = false;

      });
    }
  }

  onSubmitProfileInfo( formInfo: any ) {

    if (formInfo.valid) {
      this.loading = true;

      this.userSvc.onUpdateProfileInfo( this.bodyProfileInfo ).subscribe( (res: any) => {

        if (!res.ok) {
          throw new Error( res.error );
        }

        const { message, css } = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css, 'alertProfileInfo');
        this.loading = false;

      });

    }
  }

  onShowAlert( msg = '', css = 'success', idComponent: string ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;

    $(`#${idComponent}`).html(htmlAlert);
  }

  onGetErrors( showError: number ) {
    let arrErrors = showError === 0 ? [`Se actualizó con éxito`] : ['Ya existe un registro'];
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
      arrErrors = ['No se encontró registro de usuario'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['La contraseña actual es inválida'];
    }

    return { message: arrErrors.join(', '), css };

  }

  onChangePassword(frm: any) {
    if (frm.valid) {

      this.userSvc.onChangePassword( this.bodyChangePassword ).subscribe( (res: any) => {
        if ( !res.ok ) {
          throw new Error( res.error );
        }

        const { message, css } = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css, 'alertChangePassword');

        if (res.data.showError === 0) {
          this.onShowAlert('Se cambio la contraseña con éxito', 'success', 'alertChangePassword');
          this.onCancelChangePassword();
        }

        this.loading = false;
      });
    }
  }

  onCancelChangePassword() {
    // console.log('cancel change password');
    $('#frmChangePassword').trigger('reset');
    this.bodyChangePassword = new ChangePasswordModel();
  }

}
