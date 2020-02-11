import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PartnerModel } from '../models/partner.model';

const URI_API = environment.URI_API;

const headers = new HttpHeaders({
  Authorization : localStorage.getItem('token')
});

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor( private http: HttpClient ) { }

  onGetResponsable( query = '' ) {
    return this.http.get( URI_API + `/Responsable/GetAll?q=${query}`, {headers} );
  }

  onGetPartner( page: number, rowsForPage: number, qName = '', qDoc = '', qUser = '', qDirectCompany = '2', qAllow = '2' , showInactive = false ) {
    showInactive = showInactive ? false : true;
    const params = `page=${page}&rowsForPage=${rowsForPage}&qName=${qName}&qDoc=${qDoc}&qUser=${qUser}&qDirectCompany=${qDirectCompany}&qAllow=${qAllow}&showInactive=${showInactive}`;
    return this.http.get( URI_API + `/Partner/Get?${params}`, {headers} );
  }

  onAddPartner( body: PartnerModel ) {
    return this.http.post( URI_API + `/Partner/Add`, body, {headers} );
  }

  onUpdatePartner( body: PartnerModel ) {
    return this.http.put( URI_API + `/Partner/Update/${ body.idPartner }`, body, {headers} );
  }

}
