import { ElementRef, Input, Directive } from '@angular/core';

@Directive({
  selector: '[appPokemonTypes]'
})
export class PokemonTypesDirective {

  @Input() pokemon_type: string;
  
  types: Object = {
    grass:  '#95e471'  ,  poison:   '#853c9b'  ,  water:  '#4487eb'  ,  fire:     '#eb4f44',
    flying: '#9daef7'  ,  electric: '#f8eb73'  ,  normal: '#ecece4'  ,  bug:      '#92b378',
    dark:   '#3d332a'  ,  dragon:   '#825ed6'  ,  fairy:  '#e5b7ee'  ,  fighting: '#a75b3d',
    ghost:  '#4e3d75'  ,  ground:   '#cec489'  ,  ice:    '#a9eff1'  ,  psychic:  '#e969e2',
    rock:   '#a09766'  ,  steel:    '#e2e2e2'
  }

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    this.el.nativeElement.style.backgroundColor = this.types[this.pokemon_type];
  }

}
