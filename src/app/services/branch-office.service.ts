import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BranchOfficeModel } from '../models/branchOffice.model';

const URI_API = environment.URI_API;


@Injectable({
  providedIn: 'root'
})
export class BranchOfficeService {

  constructor(private http: HttpClient) { }

  onGetDepartment( query = '' ) {
    return this.http.get( URI_API + `/Department/Get?q=${query}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetProvince( query = '', department: string ) {
    return this.http.get( URI_API + `/Province/Get?q=${query}&department=${department}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetDistrit( query = '', department: string, province: string ) {
    return this.http.get( URI_API + `/Distrit/Get?q=${query}&department=${department}&province=${province}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onAddBranchOffice( body: BranchOfficeModel ) {
    return this.http.post( URI_API + `/BranchOffice/Add`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onUpdateBranchOffice( body: BranchOfficeModel ) {
    return this.http.put( URI_API + `/BranchOffice/Update/${ body.idBranchOffice }`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onDeleteBranchOffice( body: BranchOfficeModel ) {
    return this.http.delete( URI_API + `/BranchOffice/Delete/${ body.idBranchOffice }/${ body.statusRegister }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onPartnetGetAll( query = '' ) {
    return this.http.get( URI_API + `/Partner/GetAll?query=${query}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetBranchOffice(page = 1, rowsForPage = 10, qName = '', qType = '', qUbigeo = '', qPartner = '', qDoc = '', showInactive = false, idEmpresa = '') {
    showInactive = showInactive ? false : true;
    const params = `page=${page}&rowsForPage=${rowsForPage}&qName=${qName}&qType=${qType}&qUbigeo=${qUbigeo}&qPartner=${qPartner}&qDoc=${qDoc}&showInactive=${showInactive}&idEmpresa=${idEmpresa}`
    return this.http.get( URI_API + `/BranchOffice/Get?${params}`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetComisionBranch( idBranch: number ) {
    return this.http.put( URI_API + `/BranchOffice/GetComission/${idBranch}`, {} , { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
