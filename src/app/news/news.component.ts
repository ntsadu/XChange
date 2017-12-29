
import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service'
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { User } from 'interfaces/xchange-interfaces/interfaces';
import { LoginService } from 'app/login.service';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  
  // currentUser: User = JSON.parse(localStorage.getItem('user'));
  currentUser: User = this.loginService.subscribers.getValue();
  id = this.currentUser.userId;
  firstname: string = this.currentUser.firstName;
  lastname: string = this.currentUser.lastName;
  email: string = this.currentUser.email;
  username: string = this.currentUser.username;
  password: string = this.currentUser.password;

  

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

  constructor(private NewsService: NewsService, private loginService: LoginService) { }

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
    })
  }


}

