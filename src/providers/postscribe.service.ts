import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import postscribe from 'postscribe';

@Injectable()
export class PostscribeService {

    postscribeChart(symbol:string, callback?:()=>void){
        postscribe('#tv-container', 
        `<script> 
          new TradingView.widget({
            "width": 717,
            "height": 350,
            "symbol": "${symbol}",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "Light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "details": true,
            "hideideas": true
          });
        </script>`
        ); 

        if(!_.isNil(callback)) callback();
    }

}