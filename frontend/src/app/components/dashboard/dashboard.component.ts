import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { RestService } from 'src/app/services/rest/rest.service';
import { switchMap } from 'rxjs/operators';
import { ScrollService } from './scroll.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pokemons_images = [];
  pokemon_ob: any;//Observable<Array<any>>;
  next_url: string = 'https://pokeapi.co/api/v2/pokemon-form?limit=30';
  range: Array<number> = [0, 30];
  loading: boolean = false;

  constructor(
    private restService: RestService,
    private scrollService: ScrollService
  ) { }

  ngOnInit(): void {
    // this.pokemon_ob = this.pokemon_function()
    this.morePokemons()
  }

  pokemon_function() {
    return this.restService.getGeneral(this.next_url).pipe(
      switchMap(data => {
        this.next_url = data['next'];
        for (let index = this.range[0]; index < this.range[1]; index++) {
          this.pokemons_images.push(this.restService.getGeneral(data['results'][index]['url']))
        }
        return forkJoin(this.pokemons_images)
        }
      )
    )
  }

  morePokemons() {
    this.scrollService.getScrollEvent().subscribe(
      () => {
        this.loading = true
        this.pokemon_function().subscribe(
          data => {
            this.pokemon_ob = of(data)
            this.loading = false
          }
        )
      }
    )
  }

}
