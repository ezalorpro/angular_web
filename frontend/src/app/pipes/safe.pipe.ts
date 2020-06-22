import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'Safe'
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) { }

  public transform(value: any) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

