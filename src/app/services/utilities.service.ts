import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UtilitieModel } from '../models/utilitie.model';

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

  onAddUtilitie( body: UtilitieModel ) {
    return this.http.post( URI_API + `/Utilitie/Add`, body, { headers: {Authorization: localStorage.getItem( 'token' ) } } );
  }

  onGetUtilities( page: number, rowsForPage: number,  qPartner = '',  qBranch = '', qResponsable = '',  qNumeration = '',  qLteUtilitie = 0,  qGteUtilitie = 0 , qEqUtilitie = 0, showInactive = false ) {
    showInactive = showInactive ? false : true;
    const params = `page=${page}&rowsForPage=${rowsForPage}&qPartner=${qPartner}&qBranch=${qBranch}&qResponsable=${qResponsable}&qNumeration=${qNumeration}&qLteUtilitie=${qLteUtilitie}&qGteUtilitie=${qGteUtilitie}&qEqUtilitie=${qEqUtilitie}&showInactive=${showInactive}`;

    return this.http.get( URI_API + `/Utilitie/Get?${ params }`, {headers: {Authorization: localStorage.getItem( 'token' ) } } );
  }

  onGetDetailUtilitie( id: number ) {
    return this.http.put( URI_API + `/Utilitie/GetDetail/${ id }`, {}, {headers: {Authorization: localStorage.getItem( 'token' ) } } );
  }

  onUpdateUtilitie( body: UtilitieModel ) {
    return this.http.put( URI_API + `/Utilitie/Update/${ body.idUtilitie }`, body, { headers: {Authorization: localStorage.getItem( 'token' ) } } );
  }

  onDeleteUtilitie( body: UtilitieModel ) {
    return this.http.delete( URI_API + `/Utilitie/Delete/${ body.idUtilitie }/${ body.statusRegister }`, { headers: {Authorization: localStorage.getItem( 'token' ) } } );
  }

  onGetChartUtilitiePartner() {
    return this.http.get( URI_API + `/Utilitie/Chart/TotalPartner`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetChartUtilitiePeriod() {
    return this.http.get( URI_API + `/Utilitie/Chart/TotalPeriod`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
