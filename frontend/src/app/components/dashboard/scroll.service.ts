import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  scroll_event: BehaviorSubject<boolean> = new BehaviorSubject(false);

  setScrollEvent(scroll_bottom) {
    this.scroll_event.next(scroll_bottom);
  }

  getScrollEvent() {
    return this.scroll_event
  }
}
