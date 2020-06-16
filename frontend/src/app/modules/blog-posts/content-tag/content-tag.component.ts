import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-content-tag',
  templateUrl: './content-tag.component.html',
  styleUrls: ['./content-tag.component.css']
})
export class ContentTagComponent implements OnInit {

  @Input() tagName: string;

  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    console.log(this.tagName)
  }
}
