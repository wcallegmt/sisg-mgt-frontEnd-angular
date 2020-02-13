import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BranchOfficeModel } from '../models/branchOffice.model';

const URI_API = environment.URI_API;

const headers = new HttpHeaders({
  Authorization : localStorage.getItem('token')
});
@Injectable({
  providedIn: 'root'
})
export class BranchOfficeService {

  constructor(private http: HttpClient) { }

  onGetDepartment( query = '' ) {
    return this.http.get( URI_API + `/Department/Get?q=${query}`, {headers} );
  }

  onGetProvince( query = '', department: string ) {
    return this.http.get( URI_API + `/Province/Get?q=${query}&department=${department}`, {headers} );
  }

  onGetDistrit( query = '', department: string, province: string ) {
    return this.http.get( URI_API + `/Distrit/Get?q=${query}&department=${department}&province=${province}`, {headers} );
  }

  onAddBranchOffice( body: BranchOfficeModel ) {
    return this.http.post( URI_API + `/BranchOffice/Add`, body, {headers} );
  }

  onPartnetGetAll( query = '' ) {
    return this.http.get( URI_API + `/Partner/GetAll?query=${query}`, {headers} );
  }

}
