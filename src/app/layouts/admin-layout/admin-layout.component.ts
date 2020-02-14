import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  
  imgUserSession = '';
  constructor(private userSvc: UserService) { }

  ngOnInit() {
    this.onLoadSession();
  }

  onLoadSession() {
    this.userSvc.onGetProfile().subscribe( (res: any) => {
      
      if (!res.ok) {
        throw new Error( res.error );
      }
      
      this.imgUserSession = `${ environment.URI_API }/Image/user/${ res.data.imagen }?token=${ localStorage.getItem('token') }`;
      localStorage.setItem('dataUser', res.data.stringIfy());

    });

  }

}
