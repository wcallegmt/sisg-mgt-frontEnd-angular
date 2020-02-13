import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  headers = new HttpHeaders();
  constructor(private http: HttpClient) { }

  onVerifyCredentials() {
    this.headers.append('Authorization', localStorage.getItem('token'));
    return this.http.get( URI_API + `/Verify/Authorization`, { headers: { Authorization: localStorage.getItem('token') } } );
  }
}
