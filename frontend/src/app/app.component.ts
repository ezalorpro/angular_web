import { Component, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ScrollService } from './services/scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Probando backend';
  @ViewChild('MyContainer') container;
  show_button: boolean = false;
  

  constructor(
    public media: MediaObserver,
    private scrollService: ScrollService
  ) { }

  ngAfterViewInit() {
    this.scrollService.getCurrentScrollTop().subscribe(
      (flag) => {
        this.show_button = flag
      }
    )
  }

  palCielo() {
    this.container['elementRef']['nativeElement']['scrollTop'] = 0
  }

}
