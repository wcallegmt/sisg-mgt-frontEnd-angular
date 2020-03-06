import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() imgUserSession: string;

  dataUser: any = {};

  constructor(private router: Router) { }

  ngOnInit() {

    this.dataUser = JSON.parse( localStorage.getItem('dataUser') ) ;
    // console.log(this.dataUser);
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('dataUser');
    
    this.router.navigateByUrl('login');
  }

}
