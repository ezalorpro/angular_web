import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { startWith, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css']
})
export class TagInputComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<string[]>;

  @Input() tags: string[];
  @Input() allTags: string[];
  @Input() tagCtrl;
  dummy_tagCtrl = new FormControl();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('chipList') chipList: MatChipList;

  constructor() { }

  ngOnInit() {
    this.tagCtrl.setValue(this.tags);
    if (this.tags.length < 1) {
      this.chipList.errorState = true
    }
    this.dummy_tagCtrl.setValidators([Validators.required])
    this.filteredTags = this.dummy_tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (!this.tags.includes(value.trim())) {
      
      if ((value || '').trim()) {
        this.tags.push(value.trim().toLowerCase());
      }

      this.tagCtrl.setValue(this.tags);
      this.dummy_tagCtrl.setValue(null)
    }

    if (input) {
      input.value = '';
    }

    if (this.tags.length > 0) {
      this.chipList.errorState = false
    }
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.tagCtrl.setValue(this.tags);
      
      if (this.tags.length < 1) {
        this.chipList.errorState = true
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.tags.includes(event.option.viewValue.toLowerCase())){
      this.tags.push(event.option.viewValue.toLowerCase());
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue(this.tags);
      this.dummy_tagCtrl.setValue(null)

      if (this.tags.length > 0) {
        this.chipList.errorState = false
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.includes(filterValue) && !this.tags.includes(tag));
  }

}
