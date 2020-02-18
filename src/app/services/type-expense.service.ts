import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TypeExpenseModel } from '../models/typeExpense';


const URI_API = environment.URI_API;
@Injectable({
  providedIn: 'root'
})
export class TypeExpenseService {

  constructor( private http: HttpClient ) { }

  onGetListTypeExpense( page: number, rowsForPage: number, qName = '', showInactive: boolean ) {
    showInactive = showInactive ? false : true;
    const params = `&page=${page}&rowsForPage=${rowsForPage}&qName=${qName}&showInactive=${showInactive}`;
    return this.http.get( URI_API + `/TypeExpense/Get?${params}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onAddTypeExpense( body: TypeExpenseModel ) {
    return this.http.post( URI_API + `/TypeExpense/Add`, body , { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onUpdateTypeExpense( body: TypeExpenseModel ) {
    return this.http.put( URI_API + `/TypeExpense/Update/${ body.idTypeExpense }`, body , { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onDeleteTypeExpense( body: TypeExpenseModel ) {
    return this.http.delete( URI_API + `/TypeExpense/delete/${ body.idTypeExpense }/${ body.statusRegister }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
