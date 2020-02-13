import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductModel } from '../models/product.model';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  onAddProduct( body: ProductModel ) {
    return this.http.post( URI_API + `/Product/Add`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onGetProduct(page = 0, rowsForPage = 0, qName = '', qPatent = '2', qGtePercent = 0, qLtePercent = 0, qEqPercent = 0, showInactive = false ) {
    showInactive = showInactive ? false : true;
    const params = `page=${ page }&rowsForPage=${ rowsForPage }&qName=${ qName }&qPatent=${ qPatent }&qGtePercent=${ qGtePercent }&qLtePercent=${ qLtePercent }&qEqPercent=${qEqPercent}&showInactive=${ showInactive }`;
    return this.http.get( URI_API + `/Product/Get?${ params }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onUpdateproduct( body: ProductModel ) {
    return this.http.put( URI_API + `/Product/Update/${ body.idProduct }`, body, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onDeleteProduct( idProduct: number, statusRegister: boolean ) {
    return this.http.delete( URI_API + `/Product/Delete/${ idProduct }/${ statusRegister }`, { headers: { Authorization: localStorage.getItem('token') } } );
  }


}
