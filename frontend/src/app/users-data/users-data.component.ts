import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { Data } from '../models/data.model';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.css']
})
export class UsersDataComponent implements OnInit {

  dataSub: Subscription;
  user_data: MatTableDataSource<Data[]>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  headers = [
    'id', 'username', 'first_name', 'last_name',
    'email', 'roles', 'location', 'gender', 'information'
  ];
  header_obj = {
    id: 'id',
    username: 'Usuario',
    first_name: 'Nombre',
    last_name: 'Apellido',
    email: 'Correo',
    roles: 'Roles',
    gender: 'Genero',
    information: 'Informacion',
    location: 'Localizacion'
  }

  constructor(private restService: RestService) { }

  ngOnInit(): void {
    this.dataSub = this.restService
      .getData()
      .subscribe(
        res => {
          this.user_data = new MatTableDataSource(res['data']);
          this.user_data.sort = this.sort;
        },
        error => {
          console.log('oops', error)
        }
      );
    
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

}
