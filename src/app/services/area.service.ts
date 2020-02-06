import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AreaModel } from '../models/area.model';

const URI_API = environment.URI_API;

const headers = new HttpHeaders({
  Authorization : 'token'
});

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor( private http: HttpClient ) { }

  onGetCompanyAll( q = '' ) {
    return this.http.get( URI_API + `/Empresa/GetAll?q=${ q }`, {headers} );
  }

  onGetArea( page = 1, rowsForPage = 10, qArea = '', qCompany = '', showInactive = false ) {
    showInactive = showInactive ? false : true;
    const params = `page=${ page }&rowsForPage=${ rowsForPage }&queryArea=${ qArea }&queryEmpresa=${ qCompany }&showInactive=${ showInactive }`;

    return this.http.get( URI_API + `/Area/Get?${ params }`, {headers} );
  }

  onAddArea( body: AreaModel ) {
    return this.http.post( URI_API + '/Area/Add' , body, {headers});
  }

  onUpdateArea( body: AreaModel ) {
    return this.http.put( URI_API + `/Area/Update/${ body.idArea }`, body, {headers} );
  }

  onDeleteArea( body: AreaModel ) {
    return this.http.delete( URI_API + `/Area/Delete/${ body.idArea }/${ body.idCompany }/${ body.statusRegister }`, {headers} );
  }
}
