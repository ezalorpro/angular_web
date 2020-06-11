import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { RestService } from 'src/app/services/rest/rest.service';
import { switchMap } from 'rxjs/operators';

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

  @ViewChild('MyContainer') container;

  constructor(
    private restService: RestService
  ) { }

  ngOnInit(): void {
    this.pokemon_ob = this.pokemon_function()
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

  @HostListener("scroll", ['$event'])
  morePokemons($event: Event) {
    
    const height = $event.target['clientHeight']
    const containerHeight = $event.srcElement['scrollHeight']
    const current_scroll = $event.srcElement['scrollTop']
    if ((containerHeight - height) == current_scroll) {
      this.loading = true
      this.pokemon_function().subscribe(
        data => {
          this.pokemon_ob = of(data)
          this.loading = false
        }
      )
    }
  }

  palCielo() {
    this.container['nativeElement']['scrollTop'] = 0
  }
}
