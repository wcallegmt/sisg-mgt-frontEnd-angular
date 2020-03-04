import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaymentUtilitieModel } from '../models/paymentUtilities.model';

const URI_API = environment.URI_API;
@Injectable({
  providedIn: 'root'
})
export class PaymentUtilitieService {

  constructor(private http: HttpClient) { }

  onGetPartnerForResp( id = 0 ) {
    return this.http.get( URI_API + `/Partner/GetForResponsable?idResponsable=${ id }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetBank() {
    return this.http.get( URI_API + `/Bank/GetAll`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetOfficeBranch( idPartner: number ) {
    return this.http.get( URI_API + `/OfficeBranch/Partner/GetAll?idPartner=${idPartner}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetTotalDebt( idPayment: number, idUtilitie: number, payment: string) {
    return this.http.get( URI_API + `/Payment/GetDebt?idPayment=${ idPayment }&idUtilitie=${idUtilitie}&payment=${payment}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetDetailPayment( idUtilitie: number ) {
    return this.http.get( URI_API + `/Utilitie/Detail/Payment?idUtilitie=${idUtilitie}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onLastPayUtilitie( idUtilitie: number ) {
    return this.http.get( URI_API + `/PaymentUtilitie/LastPay?idUtilitie=${idUtilitie}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onAddPayment( body: PaymentUtilitieModel ) {
    return this.http.post( URI_API + `/PaymentUilitie/Add`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetListPayment( page: number, showInactive: boolean, rowsForPage = 10, qPartner = '', qOffice = '', qPaymentType = '', qGteAmount = 0, qLteAmount = 0, qEqAmount = 0, qOperation = '', qBank = '' ) {
    showInactive = showInactive ? false : true;
    const params = `page=${page}&rowsForPage=${rowsForPage}&qPartner=${qPartner}&qOffice=${qOffice}&qPaymentType=${qPaymentType}&qGteAmount=${qGteAmount}&qLteAmount=${qLteAmount}&qEqAmount=${qEqAmount}&qOperation=${qOperation}&showInactive=${showInactive}&qBank=${qBank}`;

    return this.http.get( URI_API + `/PaymentUtiltie/Get?${params}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onUpdatePayment( body: PaymentUtilitieModel ) {
    return this.http.put( URI_API + `/PaymentUtilitie/Update/${ body.idPaymentUtilitie }`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onDeletePayment( idPayment: number ) {
    return this.http.delete( URI_API + `/PaymentUtilitie/Delete/${ idPayment }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
