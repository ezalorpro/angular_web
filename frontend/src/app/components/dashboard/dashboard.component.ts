import { Component, OnInit } from '@angular/core';
import { of, Subscription, Observable } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { ScrollService } from '../../services/scroll.service';
import { ModalDialogService } from 'src/app/services/modal-dialog.service';
import { PokemonDialogComponent } from '../pokemon-dialog/pokemon-dialog.component';
import { trigger, transition, useAnimation } from '@angular/animations';
import { FadeInOutAnimation } from 'src/app/animations/generic.animation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [FadeInOutAnimation('300ms', '300ms')]
})
export class DashboardComponent implements OnInit {

  pokemons_images = [];
  pokemon_ob: Observable<any>;
  next_url: string;
  loading: boolean = false;
  scroll_subscription: Subscription;
  error_connection: boolean;
  pokemons_number: string;

  constructor(
    private restService: RestService,
    private scrollService: ScrollService,
    private modalDialog: ModalDialogService
  ) { }

  ngOnInit(): void {
    let clientHeight = this.scrollService.getElementRef()['nativeElement']['clientHeight']
    let clientWidth = this.scrollService.getElementRef()['nativeElement']['clientWidth']
    this.pokemons_number = (((clientHeight * clientWidth) / 31635) + 20).toFixed(0)
    this.next_url = `https://pokeapi.co/api/v2/pokemon?limit=${this.pokemons_number}`
    this.initSubscribe()
    
  }

  pokemon_function() {
    return this.restService.getGeneral(this.next_url, this.next_url, true)
  }

  morePokemons() {
    if (!this.loading) {
      this.error_connection = null
      this.loading = true
      this.pokemon_function().subscribe(
        data => {
          this.pokemons_images = this.pokemons_images.concat(data['results'])
          this.pokemon_ob = of(this.pokemons_images)
          this.next_url = data['next']
          this.loading = false
        },
        error => {
          console.log(error)
          this.loading = false
          this.error_connection = true
        }
      )
    }
  }
  
  initSubscribe() {
    this.scroll_subscription = this.scrollService.getScrollEventInit().subscribe(
      () => {
        this.morePokemons()
      }
    )
  }

  pokemons_details(data) {
    this.modalDialog.generalDialogOpen(PokemonDialogComponent, data, 'pokemon-dialog')
  }

  ngOnDestroy() {
    this.scroll_subscription.unsubscribe()
  }

}
