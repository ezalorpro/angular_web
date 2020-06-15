import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appPokemonTypes]'
})
export class PokemonTypesDirective {

  @Input() pokemon_type: string;

  constructor(
    private el: ElementRef
  ) { }

  ngOnChanges() {

    console.log(this.pokemon_type)

    if (this.pokemon_type == 'grass') {
      this.el.nativeElement.style.backgroundColor = '#95e471';
    }

    if (this.pokemon_type == 'poison') {
      this.el.nativeElement.style.backgroundColor = '#853c9b';
    }

    if (this.pokemon_type == 'water') {
      this.el.nativeElement.style.backgroundColor = '#4487eb';
    }

    if (this.pokemon_type == 'fire') {
      this.el.nativeElement.style.backgroundColor = '#eb4f44';
    }

    if (this.pokemon_type == 'flying') {
      this.el.nativeElement.style.backgroundColor = '#9daef7';
    }

    if (this.pokemon_type == 'electric') {
      this.el.nativeElement.style.backgroundColor = '#f8eb73';
    }

    if (this.pokemon_type == 'normal') {
      this.el.nativeElement.style.backgroundColor = '#ecece4';
    }

    if (this.pokemon_type == 'bug') {
      this.el.nativeElement.style.backgroundColor = '#92b378';
    }

    if (this.pokemon_type == 'dark') {
      this.el.nativeElement.style.backgroundColor = '#3d332a';
    }

    if (this.pokemon_type == 'dragon') {
      this.el.nativeElement.style.backgroundColor = '#825ed6';
    }

    if (this.pokemon_type == 'fairy') {
      this.el.nativeElement.style.backgroundColor = '#e5b7ee';
    }

    if (this.pokemon_type == 'fighting') {
      this.el.nativeElement.style.backgroundColor = '#a75b3d';
    }

    if (this.pokemon_type == 'ghost') {
      this.el.nativeElement.style.backgroundColor = '#4e3d75';
    }

    if (this.pokemon_type == 'ground') {
      this.el.nativeElement.style.backgroundColor = '#cec489';
    }

    if (this.pokemon_type == 'ice') {
      this.el.nativeElement.style.backgroundColor = '#a9eff1';
    }

    if (this.pokemon_type == 'psychic') {
      this.el.nativeElement.style.backgroundColor = '#e969e2';
    }

    if (this.pokemon_type == 'rock') {
      this.el.nativeElement.style.backgroundColor = '#a09766';
    }

    if (this.pokemon_type == 'steel') {
      this.el.nativeElement.style.backgroundColor = '#e2e2e2';
    }

  }

}
