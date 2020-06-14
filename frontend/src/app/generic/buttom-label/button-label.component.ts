import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-label',
  templateUrl: './button-label.component.html',
  styleUrls: ['./button-label.component.css']
})
export class ButtonLabelComponent implements OnInit {

  @Input() labeltext: string;
  @Input() labelfor: string;
  @Input() flatflag?: boolean;
  @Input() labelcolor: string;
  buttonstyle: string;

  constructor() { }

  ngOnInit(): void {
    this.buttonstyle = this.flatflag ? 'button-flat' : 'button-rised';
  }

}
