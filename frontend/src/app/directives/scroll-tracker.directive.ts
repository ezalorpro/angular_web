import { Directive, HostListener, ElementRef } from '@angular/core';
import { ScrollService } from "src/app/services/scroll.service";

@Directive({
  selector: '[appScrollTracker]'
})
export class ScrollTrackerDirective {

  constructor(
    private scrollService: ScrollService,
    private ref: ElementRef
  ) {
    scrollService.setElementRef(ref)
   }

  @HostListener('scroll', ['$event'])
  scrollEvent($event: Event) {

    const height = $event.target['clientHeight']
    const containerHeight = $event.srcElement['scrollHeight']
    const current_scroll = $event.srcElement['scrollTop']

    if (current_scroll >= 300) {
      this.scrollService.setCurrentScrollTop(true)
    } else {
      this.scrollService.setCurrentScrollTop(false)
    }

    if (((containerHeight - height) == current_scroll) && containerHeight != 0 && current_scroll != 0) {
      this.scrollService.setScrollEventInit()
    }

    if ((containerHeight - height) == current_scroll) {
      this.scrollService.setScrollEventLater()
    }
  }

}
