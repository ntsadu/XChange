import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

const quote = "%22";
const colon = "%3A";
const comma = "%2C";
const slash = "%2F";
const open_brace = "%7B";
const close_brace = "%7D";
const open_bracket = "%5B";
const close_bracket = "%5D";

const TICKER_END_POINT = "https://s.tradingview.com/tickerswidgetembed/#%7B%22symbols%22%3A%5B";
const TICKER_META_DATA = "%5D%2C%22locale%22%3A%22en%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A104%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22tickers%22%7D";

@Injectable()
export class TickerService {

    setTicker(companies:{symbol: string, name: string}[]):string{

        let endpoint = TICKER_END_POINT;

        _.map(companies, (c)=>{
            if(c.symbol != companies[companies.length - 1].symbol) endpoint = endpoint + `${open_brace}${quote}proName${quote}${colon}${quote}${c.symbol}${quote}${comma}${quote}title${quote}${colon}${quote}${c.name}${quote}${close_brace}${comma}`;
            else endpoint = endpoint + `${open_brace}${quote}proName${quote}${colon}${quote}${c.symbol}${quote}${comma}${quote}title${quote}${colon}${quote}${c.name}${quote}${close_brace}`;
        });

        endpoint = endpoint + TICKER_META_DATA;

        return endpoint;
    }

}