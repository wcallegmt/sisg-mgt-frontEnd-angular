import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-employee',
  templateUrl: './profile-employee.component.html',
  styleUrls: ['./profile-employee.component.css']
})
export class ProfileEmployeeComponent implements OnInit {
  
  idEmployee = 0;

  titleButton = 'Guardar cambios';
  employeeName = 'Gregory J. Arcia S.';
  rol= 'Empleado';
  documentNumber = '15158265';
  nacionalidad = 'Perú';
  fechaNacimiento = 'November 15, 2015';
  sex ='Masculino';
  address = 'Lima, Av Arenales 2523';
  phone = '+51 215151545';
  email = 'contacto@maximogt.com';
  area = 'Sistemas';
  inicioTrabajo ="Marzo 27, 2020";
  fechaContrato = "Abril 27, 2020";
  sueldo = "S/. 1000";
  
  constructor() { }

  ngOnInit() {
  }

}
