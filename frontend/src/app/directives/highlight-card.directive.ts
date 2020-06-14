import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlightCard]'
})
export class HighlightCardDirective {

  constructor(
    private el: ElementRef,
  ) { }
  
  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight('#3f51b5ff', 'pointer', 'solid');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlight('#3f51b500', 'default', 'solid');
  }

  private highlight(color: string, cursor: string, borderstyle: string) {
    this.el.nativeElement.style.borderColor = color;
    this.el.nativeElement.style.cursor = cursor
    this.el.nativeElement.style.borderStyle = borderstyle
  }
}
