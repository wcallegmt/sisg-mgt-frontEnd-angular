import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ExpenseModel } from '../models/expense.model';

const URI_API = environment.URI_API;
@Injectable({
  providedIn: 'root'
})
export class PaymentUtilitieService {

  constructor(private http: HttpClient) { }

  onGetPartnerForResp( id = 0 ) {
    return this.http.get( URI_API + `/Partner/GetForResponsable?idResponsable=${ id }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
