import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-responsable',
  templateUrl: './profile-responsable.component.html',
  styleUrls: ['./profile-responsable.component.css']
})
export class ProfileResponsableComponent implements OnInit {

  idResponsable = 0;

  titleButton = 'Guardar cambios';
  miNombre = 'William';
  responsableName = 'Gregory J. Arcia S.';
  tipoResponsable = 'Administrador de Grupo';
  documentNumber = '15158265';
  nacionalidad = 'Perú';
  fechaNacimiento = 'November 15, 2015';
  sex ='Masculino';
  address = 'Lima, Av Arenales 2523';
  phone = '+51 215151545';
  email = 'contacto@maximogt.com';
  totalSucursales = '109';
  totalSocios = '150';
  constructor() { 

    
  }

  ngOnInit() {
  }

}
