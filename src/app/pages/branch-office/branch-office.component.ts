import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BranchOfficeService } from '../../services/branch-office.service';
import { BranchOfficeModel, ComisionPartnerModel } from 'src/app/models/branchOffice.model';
import { ResponsableService } from '../../services/responsable.service';
import * as $ from 'jquery';
import { Form } from '@angular/forms';


@Component({
  selector: 'app-branch-office',
  templateUrl: './branch-office.component.html',
  styleUrls: ['./branch-office.component.css']
})
export class BranchOfficeComponent implements OnInit {

  @ViewChild('mapBranch', {static: true}) mapElement: ElementRef;
  @ViewChild('paccard', {static: true}) cardElement: ElementRef;
  @ViewChild('pacInput', {static: true}) inputElement: ElementRef;
  @ViewChild('infowindowcontent', {static: true}) infoElement: ElementRef;

  map: google.maps.Map;

  dataPartner: any[] = [];
  dataDepartment: any[] = [];
  dataProvince: any[] = [];
  dataDistrit: any[] = [];
  dataProduct: any[] = [];

  arrLatLng = [-12.04670, -77.03220];

  bodyBranch: BranchOfficeModel;
  loading = false;

  constructor(private branchSvc: BranchOfficeService, private respSvc: ResponsableService) { }

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

    this.bodyBranch = new BranchOfficeModel();

    this.onLoadMap();
  }

  onLoadMap() {
    const latlng = new google.maps.LatLng( this.arrLatLng[0], this.arrLatLng[1] );
    const mapOptions: google.maps.MapOptions = {
      center: latlng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map( this.mapElement.nativeElement, mapOptions);

    const markBranch = new google.maps.Marker({
      title: this.bodyBranch.nameBranch,
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng,
      draggable: true
    });

    const infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent( this.infoElement.nativeElement );

    google.maps.event.addDomListener( markBranch, 'dragend', (event: any) => {
      this.bodyBranch.latitude =  event.latLng.lat() || 0;
      this.bodyBranch.longitude =  event.latLng.lng() || 0;
    });

    google.maps.event.addDomListener( markBranch, 'click', (event: Event) => {
      infoWindow.open(this.map, markBranch);
    });

    // busqueda por calle
    this.map.controls[ google.maps.ControlPosition.TOP_RIGHT ].push( this.cardElement.nativeElement );

    const autoComplete = new google.maps.places.Autocomplete( this.inputElement.nativeElement );
    autoComplete.bindTo('bounds', this.map);
    autoComplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    autoComplete.addListener( 'place_changed', () => {
      infoWindow.close();
      const place: google.maps.places.PlaceResult = autoComplete.getPlace();

      if (!place.geometry) {
        console.log('no se encontró direccion');
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);  // Why 17? Because it looks good.
      }

      markBranch.setPosition( place.geometry.location );
      // let address = '';
      if (place.address_components && this.bodyBranch.addressBranch === '') {
        this.bodyBranch.addressBranch = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infoWindow.open(this.map, markBranch);
    });
  }

  onResetForm() {
    $('#frmBranch').trigger('reset');
    this.bodyBranch = new BranchOfficeModel();
  }

  onSubmitBranch( event: any ) {
    if (event.valid) {

      this.loading = true;
      console.log(this.bodyBranch);

      this.branchSvc.onAddBranchOffice( this.bodyBranch ).subscribe( (res: any) => {
        if (!res.ok) {
          throw new Error( res.error );
        }

        const { message, css } = this.onGetErrors( res.data.showError );
        this.onShowAlert(message, css);

        if ( res.data.showError === 0) {
          this.onResetForm();
        }
        this.loading = false;
      });
    }
  }

  onChangeDepartment() {
    this.branchSvc.onGetProvince( '', this.bodyBranch.department ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataProvince = res.data;
    });
  }

  onChangeProvince() {
    this.branchSvc.onGetDistrit( '', this.bodyBranch.department, this.bodyBranch.province ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataDistrit = res.data;
    });
  }

  onChangeDistrit() {
    const dataTemp = this.dataDistrit.find( element => element.codigoDistrito === this.bodyBranch.distrit );
    if (!dataTemp) {
      throw new Error('No se encontró distrito' );
    }

    this.arrLatLng[0] = dataTemp.latitud || -12.04670;
    this.arrLatLng[1] = dataTemp.longitud || -77.03220;
    this.bodyBranch.ubigeo = dataTemp.ubigeo;
    this.onLoadMap();
  }

  onChangePartner() {
    const dataTemp = this.dataPartner.find( element => element.idSocio === Number(this.bodyBranch.idPartner) );
    if (!dataTemp) {
      throw new Error('No se encontró socio' );
    }

    this.bodyBranch.namePartner = `${dataTemp.apellidoNombre}  # ${ dataTemp.documento }`;
  }

  onAddComision() {
    this.bodyBranch.comission.push( new ComisionPartnerModel() );
  }

  onChangeProductPartner(indexComision: number) {
    const comisionCurrent = this.bodyBranch.comission[indexComision];
    // console.log('current', comisionCurrent);
    const countRepeat = this.bodyBranch.comission.filter( element => element.idProduct === comisionCurrent.idProduct ).length;
    if (countRepeat > 1) {
      $('#frmComissionPartner').trigger('reset');
      this.bodyBranch.comission[indexComision].idProduct = null;
    }
  }

  onDeleteComission(index: number) {
    this.bodyBranch.comission[index] = null;
    this.bodyBranch.comission = this.bodyBranch.comission.filter( element => element !== null );
  }

  onShowAlert( msg = '', css = 'success' ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;
    htmlAlert += ``;

    $(`#alertBranch`).html(htmlAlert);
  }

  onGetErrors( showError: number ) {
    let arrErrors = showError === 0 ? [`Se insertó con éxito`] : ['Ya existe'];
    const css = showError === 0 ? 'success' : 'danger';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('un registro con este nombre');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No se encontró registro de nacionalidad'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['No se encontró registro de sucursal'];
    }

    return { message: arrErrors.join(', '), css };

  }

}
