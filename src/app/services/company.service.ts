import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CompanyModel } from '../models/company.model';

const URI_API = environment.URI_API;


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor( private http: HttpClient ) { }

  onGetListCompany( page = 1, rowsForPage = 10, qRuc = '', qBussinessName = '', qAddress = '', showInactive = false ) {
    showInactive = showInactive ? false : true;
    const params = `page=${ page }&rowsForPage=${ rowsForPage }&qDoc=${ qRuc }&qName=${ qBussinessName }&qAddress=${ qAddress }&showInactive=${ showInactive }`;

    return this.http.get( URI_API + `/Company/Get?${ params }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetNationaltity( q = '' ) {
    return this.http.get( URI_API + `/Nationality/GetAll?q=${ q }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onAddCompany( body: CompanyModel ) {
    return this.http.post( URI_API + `/Company/Add`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onUpdateCompany( body: CompanyModel ) {
    return this.http.put( URI_API + `/Company/Update/${ body.idCompany }`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onDeleteCompany( body: CompanyModel ) {
    return this.http.delete( URI_API + `/Company/Delete/${ body.idCompany }/${ body.statusRegister }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }
}
