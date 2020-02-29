import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-partner',
  templateUrl: './profile-partner.component.html',
  styleUrls: ['./profile-partner.component.css']
})
export class ProfilePartnerComponent implements OnInit {
  
  titleButton = 'Guardar cambios';
  miNombre = 'William';
  partnerName = 'Gregory J. Arcia S.';
  documentNumber = "15158265";
  nacionalidad = "Perú";
  fechaNacimiento = "November 15, 2015";
  sex ="Masculino";
  address = "Lima, Av Arenales 2523";
  phone = "+51 215151545";
  email = "contacto@maximogt.com";
  cantSucursales = "109";
  responsableName = "William C. Jurez T.";

  constructor() { }

  ngOnInit() {
  }

}
