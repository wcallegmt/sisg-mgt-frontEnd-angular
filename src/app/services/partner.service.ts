import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PartnerModel } from '../models/partner.model';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor( private http: HttpClient ) { }

  onGetResponsable( query = '' ) {
    return this.http.get( URI_API + `/Responsable/GetAll?q=${query}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetPartner( page: number, rowsForPage: number, qName = '', qDoc = '', qUser = '', qDirectCompany = '2', qAllow = '2' , showInactive = false ) {
    showInactive = showInactive ? false : true;
    const params = `page=${page}&rowsForPage=${rowsForPage}&qName=${qName}&qDoc=${qDoc}&qUser=${qUser}&qDirectCompany=${qDirectCompany}&qAllow=${qAllow}&showInactive=${showInactive}`;
    return this.http.get( URI_API + `/Partner/Get?${params}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onAddPartner( body: PartnerModel ) {
    return this.http.post( URI_API + `/Partner/Add`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onUpdatePartner( body: PartnerModel ) {
    return this.http.put( URI_API + `/Partner/Update/${ body.idPartner }`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onDeletePartner( body: PartnerModel ) {
    return this.http.delete( URI_API + `/Partner/Delete/${body.idPartner}/${body.statusRegister}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetProfilePartner( id: number ) {
    return this.http.get( URI_API + `/Partner/Profile/${ id }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onChartUtilitieProduct( id: number, month: number, year: number ) {
    return this.http.get( URI_API + `/Partner/ChartUtilitieProduct/${ id }?month=${ month }&year=${ year }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onChartUtilitieProductBranch( id: number, month: number, year: number ) {
    return this.http.get( URI_API + `/Partner/ChartUtilitieProductOffice/${ id }?month=${ month }&year=${ year }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetOfficeBranchByPartner( id: number, qName: string, qType: string, qUbigeo: string, qProduct: string) {
    const params = `?qName=${ qName }&qType=${ qType }&qUbigeo=${ qUbigeo }&qProduct=${ qProduct }`;
    return this.http.get( URI_API + `/Partner/GetOfficeBranch/${ id }${ params }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetPaymentsByPartner( id: number, month: number, year: number, qBranch: string, qLteDebt: number, qGteDebt: number, qEqDebt: number, qLtePay: number, qGtePay: number, qEqPay: number, qOperation: string, qBank: string) {
    const params = `?qMonthPay=${ month }&qYearPayq=${ year }&qBranch=${ qBranch }&qLteDebt=${ qLteDebt }&qGteDebt=${ qGteDebt }&qEqDebt=${ qEqDebt }&qLtePay=${ qLtePay }&qGtePay=${ qGtePay }&qEqPay=${ qEqPay }&qOperation=${ qOperation }&qBank=${ qBank }`;


    return this.http.get( URI_API + `/Partner/GetPayments/${ id }${ params }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
