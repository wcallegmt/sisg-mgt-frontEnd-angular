import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const URI_API = environment.URI_API;

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  onUploadImg( component: string, idComponent: number,  file: File ) {
    const formData = new FormData();
    formData.append('inputFile', file);

    return this.http.put( URI_API + `/Upload/${ component }/${ idComponent }`, formData, { headers: { Authorization: localStorage.getItem('token') } } );
  }

  onUploadDocument( component: string, idComponent: number, file: File ) {
    const formData = new FormData();
    formData.append('inputFile', file);

    return this.http.put( URI_API + `/Upload/Documents/${component}/${idComponent}`, formData, { headers: { Authorization: localStorage.getItem('token') } } );
  }

}
