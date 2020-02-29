import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ExpenseModel } from '../models/expense.model';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  onGetChartEntity(  ) {
    return this.http.get( URI_API + `/Dashboard/Chart/Entity`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  
}
