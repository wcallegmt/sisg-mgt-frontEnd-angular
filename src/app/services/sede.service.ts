import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SedeModel } from '../models/sede.model';

const URI_API = environment.URI_API;

const headers = new HttpHeaders({
  Authorization : 'token'
});

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  constructor( private http: HttpClient ) { }

  onGetCompanyAll( q = '' ) {
    return this.http.get( URI_API + `/Empresa/GetAll?q=${ q }`, {headers} );
  }

  onGetSede( page = 1, rowsForPage = 10, qSede = '', qAdress = '', qCompany = '', showInactive = false ) {
    showInactive = showInactive ? false : true;
    const params = `page=${ page }&rowsForPage=${ rowsForPage }&qSede=${ qSede }&qAdress=${ qAdress }&qCompany=${ qCompany }&showInactive=${ showInactive }`;

    return this.http.get( URI_API + `/Sede/Get?${ params }`, {headers} );
  }

  onAddSede( body: SedeModel ) {
    return this.http.post( URI_API + '/Sede/Add' , {body}, {headers});
  }

  onUpdateSede( body: SedeModel ) {
    return this.http.put( URI_API + `/Sede/Update/${ body.idSede }`, {body}, {headers} );
  }

  onDeleteSede( body: SedeModel ) {
    return this.http.delete( URI_API + `/Sede/Delete/${ body.idSede }/${ body.idCompany }/${ body.statusRegister }`, {headers} );
  }


}
