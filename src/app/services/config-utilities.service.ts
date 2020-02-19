import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ConfigUtilitiesModel } from '../models/configUtilities.modelo';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class ConfigUtilitiesService {

  constructor(private http: HttpClient) { }

  onGetConfigUtilities() {
    return this.http.get( URI_API + `/Utilities/Config/Get`, {headers: { Authorization: localStorage.getItem('token') } } );
  }
  
  onUpdateConfigUtilities( body: ConfigUtilitiesModel ) {
    return this.http.post( URI_API + `/Utilities/Config/Update`, body, {headers: { Authorization: localStorage.getItem('token') } } );
  }

}
