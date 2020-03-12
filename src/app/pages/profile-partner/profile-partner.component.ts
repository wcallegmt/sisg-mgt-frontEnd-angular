import { Component, OnInit, Input } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-partner',
  templateUrl: './profile-partner.component.html',
  styleUrls: ['./profile-partner.component.css']
})
export class ProfilePartnerComponent implements OnInit {

  idPartner = 0;

  titleButton = 'Guardar cambios';
  miNombre = 'William';
  partnerName = 'Gregory J. Arcia S.';
  documentNumber = '15158265';
  nacionalidad = 'Perú';
  fechaNacimiento = 'November 15, 2015';
  sex ='Masculino';
  address = 'Lima, Av Arenales 2523';
  phone = '+51 215151545';
  email = 'contacto@maximogt.com';
  cantSucursales = '109';
  responsableName = 'William C. Jurez T.';

  constructor( private actvRouter: ActivatedRoute ) {
    this.actvRouter.params.subscribe( (res: any) => {
      // console.log(res);
      this.idPartner = res.id;
    });
  }

  ngOnInit() {
    console.log(this.idPartner);
  }

}
