import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalDialogService {

  genericSubject: Subject<any> = new Subject();

  constructor(
    private dialog: MatDialog
  ) { }

  generalDialogOpen(component: ComponentType<any>, data, panel?: string) {
    this.dialog.open(component, { data: data, panelClass: panel})
  }

  generalDialogClose() {
    this.dialog.closeAll()
  }

  setGenericSubject(flag) {
    this.genericSubject.next(flag)
  }

  getGenericSubject() {
    return this.genericSubject
  }
}
