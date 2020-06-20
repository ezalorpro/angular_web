import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  scroll_event_init: BehaviorSubject<boolean> = new BehaviorSubject(false);
  scroll_event_later: Subject<boolean> = new Subject();
  scrollTopFlag: Subject<boolean> = new Subject();

  setCurrentScrollTop(scrollTopFlag) {
    this.scrollTopFlag.next(scrollTopFlag)
  }

  getCurrentScrollTop() {
    return this.scrollTopFlag
  }

  setScrollEventInit() {
    this.scroll_event_init.next(true);
  }

  getScrollEventInit() {
    return this.scroll_event_init
  }

  setScrollEventLater() {
    this.scroll_event_later.next(true);
  }

  getScrollEventLater() {
    return this.scroll_event_later
  }
}