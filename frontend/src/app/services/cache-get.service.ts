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

  private getCachedItem(data_type: string): CacheItem {
    return this.cache.find(item => item.data_type == data_type);
  }

  removeCachedItem(data_type: string) {
    const index = this.cache.lastIndexOf(this.getCachedItem(data_type))
    this.cache = this.cache.slice(0, index).concat(this.cache.slice(index + 1))
  }

}
