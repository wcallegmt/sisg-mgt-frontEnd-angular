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

  async ngOnInit() {
    await this.onLoadSession();
  }

  onLoadSession(): Promise<any> {
    
    return new Promise( (resolve) => {

  
      const dataUser = JSON.parse( localStorage.getItem('dataUser') );
      this.imgUserSession = `${ environment.URI_API }/Image/user/${ dataUser.imagen }?token=${ localStorage.getItem('token') }`;

      resolve( {ok: true} );

    });

  }

}
