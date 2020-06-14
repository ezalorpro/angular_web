import { Component, OnInit } from '@angular/core';
import { of, Subscription, Observable } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { ScrollService } from './scroll.service';
import { ModalDialogService } from 'src/app/services/modal-dialog.service';
import { PokemonDialogComponent } from '../pokemon-dialog/pokemon-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pokemons_images = [];
  pokemon_ob: Observable<any>;
  next_url: string = 'https://pokeapi.co/api/v2/pokemon?limit=50';
  loading: boolean = false;
  scroll_subscription: Subscription;

  constructor(
    private restService: RestService,
    private scrollService: ScrollService,
    private modalDialog: ModalDialogService
  ) { }

  ngOnInit(): void {
    this.morePokemons()
  }

  pokemon_function() {
    return this.restService.getGeneral(this.next_url)
  }

  morePokemons() {
    this.scroll_subscription = this.scrollService.getScrollEvent().subscribe(
      () => {
        this.loading = true
        this.pokemon_function().subscribe(
          data => {
            this.pokemons_images = this.pokemons_images.concat(data['results'])
            this.pokemon_ob = of(this.pokemons_images)
            this.next_url = data['next']
            this.loading = false
          }
        )
      }
    )
  }

  pokemons_details(data) {
    this.modalDialog.generalDialogOpen(PokemonDialogComponent, data)
  }

  ngOnDestroy() {
    this.scroll_subscription.unsubscribe()
  }

}
