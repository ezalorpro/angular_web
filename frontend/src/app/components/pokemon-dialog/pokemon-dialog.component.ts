import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-dialog',
  templateUrl: './pokemon-dialog.component.html',
  styleUrls: ['./pokemon-dialog.component.css']
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
    this.pokemon_subscription = this.restService.getGeneral(this.data['url']).subscribe(
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
