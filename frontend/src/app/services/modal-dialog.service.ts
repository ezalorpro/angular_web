import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class ModalDialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  generalDialogOpen(component: ComponentType<any>, data, panel?: string) {
    this.dialog.open(component, { data: data, panelClass: panel})
  }

  generalDialogClose() {
    this.dialog.closeAll()
  }
}
