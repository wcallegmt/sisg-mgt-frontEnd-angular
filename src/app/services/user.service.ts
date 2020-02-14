import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../models/login.model';
import { ProfileModel, ProfileInfoModel } from '../models/profile.model';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  onLogin( body: LoginModel ){
    return this.http.post(URI_API + `/Login`, body);
  }

  onGetProfile() {
    return this.http.post( URI_API + `/Profile/Get`, {}, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onUpdateProfile( body: ProfileModel ) {
    return this.http.post( URI_API + `/Profile/Update`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onUpdateProfileInfo( body: ProfileInfoModel ) {
    return this.http.post( URI_API + `/ProfileInfo/Update`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetLanguage() {
    return this.http.get( URI_API + `/Language/Get`,  { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
