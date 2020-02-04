import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../models/user.model';

const URI_API = environment.URI_API;

const headers = new HttpHeaders({
  Authorization : 'token'
});
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  onGetListUser(page = 1, rowsForPage = 10, qEmployee = '', qDocumento = '', qsuario = '', qArea = '', showInactive = false ) {
    showInactive = showInactive ? false : true;
    const params = `page=${ page }&rowsForPage=${ rowsForPage }&qEmployee=${ qEmployee }&qDoc=${ qDocumento }&qUser=${ qsuario }&qArea=${ qArea }&showInactive=${ showInactive }`;

    return this.http.get( URI_API + `/User/Get?${ params }`, {headers} );
  }

  onGetAreaOfCompany( idCompany: number, query = '' ) {
    return this.http.get( URI_API + `/Area/OfCompany?idCompany=${ idCompany }&q=${ query }`, {headers} );
  }

  onGetCompanyAll( q = '' ) {
    return this.http.get( URI_API + `/Empresa/GetAll?q=${ q }`, {headers} );
  }

  onGetTypeDocument() {
    return this.http.get( URI_API + `/TipoDocumento/Get`, {headers} );
  }

  onGetNationaltity( q = '' ) {
    return this.http.get( URI_API + `/Nationality/GetAll?q=${ q }`, {headers} );
  }

  onAddUser( body: UserModel ) {
    return this.http.post( URI_API + `/User/Add`, {body}, {headers} );
  }

}
