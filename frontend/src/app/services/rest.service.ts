import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserData } from '../models/userdata.model';
import { API_URL } from '../env';
import { CacheGetService } from './cache-get.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  
  constructor(
    private httpclient: HttpClient,
    private cacheGetService: CacheGetService
  ) { }

  private _handleError(error: HttpErrorResponse | any) {
    return throwError(error.message || 'Error: unable to complete request')
  }

  getGeneral(url: string, data_type: string, forceRefresh: boolean = false): Observable<any> {
    return this.cacheGetService.get(url, data_type, 8, forceRefresh, 60000*60)
  }

  getUserData(): Observable<UserData>{
    return this.cacheGetService.get(`${API_URL}/userdata/`, 'userData', 10).pipe(catchError(this._handleError))
  }

  postUserData(data: UserData, file_data) {
    if (file_data) {
      data['avatar_file_data'] = file_data['data']
      data['avatar'] = file_data['name']
      data['avatar_url'] = '/static/images/'+ file_data['name']
    }

    this.cacheGetService.removeCachedItem(`${API_URL}/userdata/`)

    return this.httpclient.post(`${API_URL}/userdata/`, data)
  } 

  apiPostData(param?: number | string, data?: Object, tipo?: string): Observable<any> {
    if (tipo == 'get') {
      if (param) {
        return this.cacheGetService.get(`${API_URL}/posts/${param}/`, `postID${param}`, 10).pipe(catchError(this._handleError))
      }
      return this.cacheGetService.get(`${API_URL}/posts/`,'postsData', 10).pipe(catchError(this._handleError))
    }

    if (tipo == 'post') {
      this.cacheGetService.removeCachedItem('postsData')
      this.cacheGetService.removeCachedItem('tagsData')
      return this.httpclient.post(`${API_URL}/posts/`, data)
    }

    if (tipo == 'put') {
      this.cacheGetService.removeCachedItem('postsData')
      this.cacheGetService.removeCachedItem('tagsData')
      this.cacheGetService.removeCachedItem(`postID${data['id']}`)
      return this.httpclient.put(`${API_URL}/posts/`, data)
    }
    
    if (tipo == 'delete') {
      this.cacheGetService.removeCachedItem('postsData')
      this.cacheGetService.removeCachedItem(`postID${param}`)
      return this.httpclient.delete(`${API_URL}/posts/${param}/`)
    }
  }

  apiCommentsData(param?: number | string, data?: Object, tipo?: string, forceRefresh: boolean = false): Observable<any> {
    if (tipo == 'get') {
      return this.cacheGetService.get(`${API_URL}/posts/comments/${param}/`, `commentsID${param}`, 10, forceRefresh).pipe(catchError(this._handleError))
    }

    if (tipo == 'post') {
      return this.httpclient.post(`${API_URL}/posts/comments/${param}/`, data)
    }

    if (tipo == 'put') {
      return this.httpclient.put(`${API_URL}/posts/comments/${param}/`, data)
    }

    if (tipo == 'delete') {
      return this.httpclient.delete(`${API_URL}/posts/comments/${param}/`)
    }

  }

  getTags(): Observable<any> {
    return this.cacheGetService.get(`${API_URL}/tags/`, 'tagsData', 10).pipe(catchError(this._handleError))
  }
}
