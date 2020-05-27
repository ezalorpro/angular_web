import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Data } from '../models/data.model';
import { API_URL } from '../env';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  
  constructor(private httpclient: HttpClient) { }

  private _handleError(err: HttpErrorResponse | any) {
    return throwError(err.message || 'Error: unable to complete request')
  }

  getData(): Observable<Data[]>{
    return this.httpclient.get<Data[]>(`${API_URL}/data/`).pipe(catchError(this._handleError))
  }
}
