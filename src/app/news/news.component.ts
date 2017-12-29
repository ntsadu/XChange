
import { Component, OnInit, NgZone } from '@angular/core';
import { NewsService } from '../news.service'
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
<<<<<<< HEAD
import { User } from 'interfaces/xchange-interfaces/interfaces';
import { LoginService } from 'app/login.service';
=======
import * as _ from 'lodash';
>>>>>>> master


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  
<<<<<<< HEAD
  // currentUser: User = JSON.parse(localStorage.getItem('user'));
  currentUser: User = this.loginService.subscribers.getValue();
  id = this.currentUser.userId;
  firstname: string = this.currentUser.firstName;
  lastname: string = this.currentUser.lastName;
  email: string = this.currentUser.email;
  username: string = this.currentUser.username;
  password: string = this.currentUser.password;

  
=======
  loading = true;
>>>>>>> master

  News: any[];
  Articles: any[];
  
  Author: string[];
  Description: string[];
  PublishedAt:  Date[];
  SourceId: string[];
  SourceName: string[];
  Title: string[];
  Url: string[];
  UrlToImage: string[];

<<<<<<< HEAD
  constructor(private NewsService: NewsService, private loginService: LoginService) { }
=======
  constructor(private NewsService: NewsService, public ngZone: NgZone) { }
>>>>>>> master

  ngOnInit() {
    this.getNews();
    this.currentUser = this.loginService.subscribers.getValue();
  }

  getNews() {
    this.NewsService
    .getNews()
    .subscribe((news) => {
      this.News = <any>news;
      this.Articles = this.News["articles"];
      console.log(this.Articles);

      if(!_.isNil(this.Articles)){
        this.ngZone.run(()=>{
          this.loading = false;
        });
      }
    })
  }


}

