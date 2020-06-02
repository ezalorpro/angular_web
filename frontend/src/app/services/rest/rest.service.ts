import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Data } from '../../models/data.model';
import { API_URL } from '../../env';
import { Post } from 'src/app/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  
  constructor(private httpclient: HttpClient) { }

  private _handleError(error: HttpErrorResponse | any) {
    return throwError(error.message || 'Error: unable to complete request')
  }

  getData(): Observable<Data[]>{
    return this.httpclient.get<Data[]>(`${API_URL}/data/`).pipe(catchError(this._handleError))
  }

  getUserData(username: string): Observable<Data>{
    return this.httpclient.post<Data>(`${API_URL}/data/`, username).pipe(catchError(this._handleError))
  }

  getPostData(username: string): Observable<Post[]> {
    return this.httpclient.get<Post[]>(`${API_URL}/posts/${username}/`).pipe(catchError(this._handleError))
  }

  getPosts(): Observable<Post[]> {
    return this.httpclient.get<Post[]>(`${API_URL}/posts/`).pipe(catchError(this._handleError))
  }
}
