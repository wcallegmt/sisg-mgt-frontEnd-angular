import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-partner',
  templateUrl: './profile-partner.component.html',
  styleUrls: ['./profile-partner.component.css']
})
export class ProfilePartnerComponent implements OnInit {
  
  titleButton = 'Guardar cambios';
  miNombre = 'William';
  
  constructor() { }

  ngOnInit() {
  }

}
