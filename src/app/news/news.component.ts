
import { Component, OnInit, NgZone } from '@angular/core';
import { NewsService } from '../news.service'
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  
  loading = true;

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

  constructor(private NewsService: NewsService, public ngZone: NgZone) { }

  ngOnInit() {
    this.getNews();
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

