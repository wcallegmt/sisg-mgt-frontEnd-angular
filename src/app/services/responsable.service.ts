import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponsableModel } from '../models/responsable.model';

const URI_API = environment.URI_API;

const headers = new HttpHeaders({
  Authorization : localStorage.getItem('token')
});

@Injectable({
  providedIn: 'root'
})
export class ResponsableService {

  constructor(private http: HttpClient) { }

  onAddResponsable( body: ResponsableModel ) {
    return this.http.post( URI_API + `/Responsable/Add`, body, {headers} );
  }

  onGetListresponsable(page = 1, rowsForPage = 10, qName = '', qDocumento = '', qsuario = '', qType = '', showInactive = false ) {
    showInactive = showInactive ? false : true;
    const params = `page=${ page }&rowsForPage=${ rowsForPage }&qName=${ qName }&qDoc=${ qDocumento }&qUser=${ qsuario }&qType=${ qType }&showInactive=${ showInactive }`;

    return this.http.get( URI_API + `/Responsable/Get?${params}` , {headers} );
  }

  onGetListProduct( query = '' ) {
    return this.http.get( URI_API + `/Product/GetAll?q=${query}`, {headers} );
  }

  onGetComisionResponsable( id: number ) {
    return this.http.get(URI_API + `/Responsable/GetComision?id=${id}`, {headers});
  }

  onUpdateResponsable( body: ResponsableModel ) {
    return this.http.put( URI_API + `/Responsable/Update/${ body.idResponsable }`, body, {headers} );
  }
}
