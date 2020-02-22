import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(private http: HttpClient) { }

  onGetTotalBranch( idPartner: number, idBranch: number ) {
    return this.http.get( URI_API + `/Utilitie/GetExpense/Office?idPartner=${idPartner}&idBranch=${idBranch}`, {headers: {Authorization: localStorage.getItem( 'token' ) } } );
  }

  onGetProductComission( idPartner: number, idBranch: number ) {
    return this.http.get( URI_API + `/Utilitie/GetProduct/Comission?idPartner=${idPartner}&idBranch=${idBranch}`, {headers: {Authorization: localStorage.getItem( 'token' ) } } );
  }
  
}
