import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) { }

  onGetMoneyAll( q = '' ) {
    return this.http.get( URI_API + `/Money/GetAll?q=${ q }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetBranchByPartner( q = '', idPArtner: number ) {
    return this.http.get( URI_API + `/Sucursal/GetAllByPartner?q=${ q }&idPartner=${ idPArtner }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetTypeExpense( q = '' ) {
    return this.http.get( URI_API + `/TypeExpense/GetAll?q=${ q }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetTypeVoucher( q = '' ) {
    return this.http.get( URI_API + `/TypeVoucher/GetAll?q=${q}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
