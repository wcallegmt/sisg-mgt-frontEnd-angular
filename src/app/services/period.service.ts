import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PeriodOpen, PeriodClose } from '../models/period.model';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  constructor(private http: HttpClient) { }

  onGetStatusPeriod() {
    return this.http.get( URI_API + '/Period/GetStatus', {headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetNumerationPeriod() {
    return this.http.get( URI_API + '/Period/GetNumeration', {headers: { Authorization: localStorage.getItem('token') } } );
  }

  onOpenPeriod( body: PeriodOpen ) {
    return this.http.post( URI_API + `/Period/Add`, body, {headers: { Authorization: localStorage.getItem('token') } } );
  }

  onClosePeriod( body: PeriodClose ) {
    return this.http.post( URI_API + '/Period/Close', body, {headers: { Authorization: localStorage.getItem('token') } });
  }

}
