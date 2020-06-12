import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  scroll_event;

  setScrollEvent($event) {
    this.scroll_event = $event;
  }

  getScrollEvent() {
    return this.scroll_event
  }
}
