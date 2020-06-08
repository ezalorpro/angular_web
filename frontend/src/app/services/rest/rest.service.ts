import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserData } from '../../models/userdata.model';
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

  getUserData(): Observable<UserData>{
    return this.httpclient.get<UserData>(`${API_URL}/userdata/`).pipe(catchError(this._handleError))
  }

  postUserData(data: UserData, file_data) {
    if (file_data) {
      data['avatar_file_data'] = file_data['data']
      data['avatar'] = file_data['name']
      data['avatar_url'] = '/static/images/'+ file_data['name']
    }
    return this.httpclient.post(`${API_URL}/userdata/`, data)
  } 

  getPostData(username: string): Observable<Post[]> {
    return this.httpclient.get<Post[]>(`${API_URL}/posts/${username}/`).pipe(catchError(this._handleError))
  }

  getPosts(): Observable<Post[]> {
    return this.httpclient.get<Post[]>(`${API_URL}/posts/`).pipe(catchError(this._handleError))
  }
}
