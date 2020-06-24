import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CacheItem } from '../models/Cache.model';

@Injectable({
  providedIn: 'root'
})
export class CacheGetService {
  
  cache: CacheItem[] = [];

  constructor(
    private httpClient: HttpClient,
  ) { }

  get(url: string, data_type: string, cacheTime?: number, forceRefresh: boolean = false, unit: number = 60000){
    let cachedItem: CacheItem = this.getCachedItem(data_type);
    if (cachedItem != undefined && !forceRefresh) {
      if (Date.now() < cachedItem.timestampCached) {
        return of(cachedItem.data);
      }
    }
    
    return this.httpClient.get(url).pipe(
      map(data => {
        if (cacheTime) {
          if (cachedItem == undefined) {
            cachedItem = new CacheItem();
            cachedItem.url = url;
            cachedItem.data_type = data_type
            this.cache.push(cachedItem);
          }
          cachedItem.data = data;
          cachedItem.timestampCached = Date.now() + cacheTime * unit;
        }
        return data;
      })
    );
  }

  getLocal(url: string, data_type: string, cacheTime?: number, forceRefresh: boolean = false, unit: number = 60000) {
    let cachedItem: CacheItem = this.getCachedLocalItem(data_type);

    if (cachedItem != undefined && !forceRefresh) {
      if (Date.now() < cachedItem.timestampCached) {
        return of(cachedItem.data);
      }
    }

    return this.httpClient.get(url).pipe(
      map(data => {
        if (cacheTime) {
          if (cachedItem == undefined) {
            cachedItem = new CacheItem();
            cachedItem.url = url;
            cachedItem.data_type = data_type
            cachedItem.data = data;
            cachedItem.timestampCached = Date.now() + cacheTime * unit;
            localStorage.setItem(data_type, JSON.stringify(cachedItem))
          } else {
            cachedItem.data = data;
            cachedItem.timestampCached = Date.now() + cacheTime * unit;
          }
          
        }
        return data;
      })
    );
  }

  private getCachedItem(data_type: string): CacheItem {
    return this.cache.find(item => item.data_type == data_type);
  }

  private getCachedLocalItem(data_type: string): CacheItem {
    return JSON.parse(localStorage.getItem(data_type))
  }

  removeCachedItem(data_type: string) {
    const index = this.cache.lastIndexOf(this.getCachedItem(data_type))
    this.cache.splice(index, 1)
  }

  removeCachedLocalItem(data_type: string) {
    localStorage.removeItem(data_type)
  }

}
