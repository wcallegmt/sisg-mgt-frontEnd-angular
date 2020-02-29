import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ExpenseModel } from '../models/expense.model';

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

  onAddExpense( body: ExpenseModel ) {
    return this.http.post( URI_API + `/Expense/Add`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetExpense( page: number, rowsForPage: number, qNumeration = '', qPartner = '', qDoc = '', qOffice = '', qVoucher = '', qGteTotal = 0, qLteTotal = 0, qEqTotal = 0, showInactive: boolean ) {
    showInactive = showInactive ? false : true;

    const params = `page=${page}&rowsForPage=${rowsForPage}&querySocio=${qPartner}&queryDoc=${qDoc}&queryOffice=${qOffice}&queryVoucher=${ qVoucher }&qGteTotal=${ qGteTotal }&qLteTotal=${ qLteTotal }&qEqTotal=${ qEqTotal }&showInactive=${ showInactive }&queryNumber=${ qNumeration }`;

    return this.http.get( URI_API + `/Expense/Get?${params}`, { headers: { Authorization: localStorage.getItem('token') } }  );
  }

  onUpdateExpense( body: ExpenseModel ) {
    return this.http.put( URI_API + `/Expense/Update/${body.idExpense}`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onDeleteExpense( body: ExpenseModel ) {
    return this.http.delete( URI_API + `/Expense/Delete/${body.idExpense}/${ body.statusRegister }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetChartTotal() {
    return this.http.get( URI_API + `/Expense/Chart/TotalExpensePartner`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetChartTotalPeriod() {
    return this.http.get( URI_API + `/Expense/Chart/TotalPerdiod`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
