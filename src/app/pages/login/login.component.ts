import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { LoginModel } from '../../models/login.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  bodyLogin: LoginModel;
  loading = false;
  constructor(private router: Router, private userSvc: UserService) { }

  ngOnInit() {
    this.bodyLogin = new LoginModel();

    if ( localStorage.getItem('userLogin') ) {
      this.bodyLogin.userName = localStorage.getItem('userLogin');
    }
  }

  onLogin($event) {
    this.loading = true;
    if ($event.valid) {
      this.userSvc.onLogin( this.bodyLogin ).subscribe( (res: any) => {
        this.loading = false;
        if ( !res.ok ) {
          return this.onShowAlert( res.error.message, 'danger' );
        }

        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('admin/dashboard');
        if (this.bodyLogin.rememberMe) {
          localStorage.setItem( 'userLogin', this.bodyLogin.userName );
        }
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
    htmlAlert += ``;

    $(`#alertLogin`).html(htmlAlert);
  }

}
