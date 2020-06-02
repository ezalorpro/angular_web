import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../services/rest/rest.service';
import { Data } from '../../models/data.model';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.css']
})
export class UsersDataComponent implements OnInit {

  dataSub: Subscription;
  userPostData: Subscription;
  PostDataSub: Subscription;
  DataSource: MatTableDataSource<Data>;
  users_data: Data[];
  post_data: MatTableDataSource<Post>;
  user_data: MatTableDataSource<Data[]>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  headers = [
    'id', 'username', 'first_name', 'last_name',
    'email', 'roles', 'location', 'gender', 'information'
  ];

  headers_post = [
    'id', 'title', 'post_date', 'post_modified', 'user_id'
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

  header_post = {
    id: 'id',
    title: 'Titulo',
    post_date: 'Publicacion',
    post_modified: 'Modificado',
    user_id: 'Autor',
  }

  constructor(private restService: RestService) { }

  ngOnInit(): void { }
  
  getUsersData(): void {
    this.dataSub = this.restService
      .getData()
      .subscribe(
        res => {
          this.users_data = res;
          console.log(this.users_data)
          this.DataSource = new MatTableDataSource(this.users_data);
          this.DataSource.sort = this.sort;
        },
        error => {
          console.log('error:', error)
        }
      );
  }

  getUserData(username: string): void {
    this.userPostData = this.restService
      .getUserData(username)
      .subscribe(
        res => {
          this.user_data = new MatTableDataSource(res['data'])
          this.user_data.sort = this.sort;
        },
        error => {
          console.log('error:', error)
        }
      );
  }

  cleanData(): void {
    this.DataSource = null;
    this.post_data = null;
  }

  getPosts(user_data: Data[]): void {
    this.PostDataSub = this.restService
      .getPostData(user_data['username'])
      .subscribe(
        res => {
          this.post_data = new MatTableDataSource(res)
          console.log(this.post_data)
        },
        error => {
          console.log('error:', error)
        }
      );
  }

  ngOnDestroy() {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }

}
