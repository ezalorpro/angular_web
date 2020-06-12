import { Component, HostListener, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ScrollService } from './components/dashboard/scroll.service';

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

  @HostListener('scroll', ['$event'])
  morePokemons($event: Event) {
    
    const height = $event.target['clientHeight']
    const containerHeight = $event.srcElement['scrollHeight']
    const current_scroll = $event.srcElement['scrollTop']

    console.log($event.target['clientHeight'])
    console.log($event.target['scrollHeight'])
    console.log($event.target['scrollTop'])
    console.log(this.show_button = true)

    if (current_scroll >= 300) {
      this.show_button = true
    } else {
      this.show_button = false
    }

    if (((containerHeight - height) == current_scroll) && containerHeight != 0 && current_scroll != 0) {
      this.scrollService.setScrollEvent(true)
    }
  }

  palCielo() {
    this.container['elementRef']['nativeElement']['scrollTop'] = 0
  }

}
