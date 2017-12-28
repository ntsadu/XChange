import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable }  from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

// Google new API
const sources: string = "financial-post";
const apiKey: string = "77f73964d6884030a622b888eeac3f07";
const NEWS_API_URL: string = "https://newsapi.org/v2/everything?sources=" + sources + "&apiKey=" + apiKey;

@Injectable()
export class NewsService {
 
  constructor(private http: HttpClient) { }

  public getNews() {
    return this.http.get(NEWS_API_URL);
  }
    
}
