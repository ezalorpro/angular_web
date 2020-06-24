import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { Subscription } from 'rxjs';
import { FadeInOutAnimation } from 'src/app/animations/generic.animation';

@Component({
  selector: 'app-pokemon-dialog',
  templateUrl: './pokemon-dialog.component.html',
  styleUrls: ['./pokemon-dialog.component.css'],
  animations: [FadeInOutAnimation()]
})
export class PokemonDialogComponent implements OnInit {

  pokemon_subscription: Subscription;
  fetched_data;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PokemonDialogComponent>,
    private restService: RestService,
  ) { }

  ngOnInit(): void {
    this.pokemon_subscription = this.restService.getGeneral(this.data['url'], this.data['name'], true).subscribe(
      data => {
        this.fetched_data = data;
      }
    )
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.pokemon_subscription.unsubscribe()
  }

}
