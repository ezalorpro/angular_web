import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { PrismJSService } from '../prism-js.service';

@Component({
  selector: 'app-post-content',
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.scss']
})
export class PostContentComponent implements OnInit, AfterViewChecked {

  @Input() post_content: string;
  is_highlighted: boolean;

  constructor(
    private prismJsService: PrismJSService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    if (this.post_content && !this.is_highlighted) {
      this.prismJsService.highlightAll();
      this.is_highlighted = true;
    }
  }

}
