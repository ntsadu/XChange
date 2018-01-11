import { Injectable, NgZone } from '@angular/core';
import { FetchingService } from './fetching.service';
import { ParsingService } from './parsing.service';
import { LoadService } from './load.service';

import * as moment from 'moment';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

export const FUNCTIONS = [
  { name: "Intraday", apiCall: "function=TIME_SERIES_INTRADAY"},
  { name: "Daily", apiCall: "function=TIME_SERIES_DAILY", forParsing: "Time Series (Daily)"},
  { name: "Weekly", apiCall: "function=TIME_SERIES_WEEKLY", forParsing: "Weekly Time Series"},
  { name: "Monthly", apiCall: "function=TIME_SERIES_MONTHLY", forParsing: "Monthly Time Series"},
  { name: "Daily Adjusted", apiCall: "function=TIME_SERIES_DAILY_ADJUSTED", forParsing: "Time Series(Daily)"},
  { name: "Weekly Adjusted", apiCall: "function=TIME_SERIES_WEEKLY_ADJUSTED", forParsing: "Weekly Adjusted Time Series"},
  { name: "Monthly Adjusted", apiCall: "function=TIME_SERIES_MONTHLY_ADJUSTED", forParsing: "Monthly Adjusted Time Series"}
];

export const INTERVALS = [
  { name: "1 minute", apiCall: "interval=1min", forParsing: "Time Series (1min)" },
  { name: "5 minute", apiCall: "interval=5min", forParsing: "Time Series (5min)" },
  { name: "15 minute", apiCall: "interval=15min", forParsing: "Time Series (15min)" },
  { name: "30 minute", apiCall: "interval=30min", forParsing: "Time Series (30min)" },
  { name: "60 minute", apiCall: "interval=60min", forParsing: "Time Series (60min)" }
];

@Injectable()
export class AlphaVantageService {

  subscription : Subscription;

  apiFunction: string = '';
  apiSymbol: string = '';
  apiInterval: string = '';
  apiParser: string[] = [];
  selectedFunction = "Daily";
  selectedInterval = " ";

  function_options:Array<string> = ["Intraday", "Daily", "Weekly", "Monthly"];
  interval_options:Array<string> = ["1 Minute", "5 Minute", "15 Minute", "30 Minute", "60 Minute"];
  interval_disabled = true;
  option = " ";

  ohlc_outlook = {open: " ", high: " ", low: " ", close: " ", volume: " "};
  ohlc_outlook_type = " ";
  closing_icon_class = "fa fa-arrow-up";
  closing_color_indicator = "black";
  closing_percent = " ";

  fav_icon_color = "#dadada";  
  fav_icon_active_color = "#ffff09";
  fav_icon_inactive_color = "#dadada";
  fav_tooltip_message = " ";

  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Time Series (Daily)'}
  ];

  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(2, 194, 2, 0.432)',
      borderColor: '#02c202',
      pointBackgroundColor: 'white',
      pointBorderColor: '#02c202',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  constructor(
    public ngZone : NgZone,
    public alphaFetcher : FetchingService,
    public alphaParser : ParsingService,
    public loadService : LoadService){ }

  public open(company : any) {
    // this.ngZone.run(()=>{this.loadService.loadingChart();});
    // this.currentCompany = company;
    // this.apiSymbol = company.symbol;

    // const config = new TemplateModalConfig<ModalContext, string, string>(this.modalTemplate);

    // config.closeResult = "closed!";
    // config.mustScroll = true;
    // config.context = { symbol: company.symbol, name: company.name, exchange: company.exchange, sector: company.sector, industry: company.industry, isFavorite: true, dataString: JSON.stringify(company)};

    this.selectedInterval = " "; 
    this.interval_disabled = true;
    this.apiFunction = _.filter(FUNCTIONS, (f)=>{if(f.name == this.selectedFunction) return f;})[0].apiCall;
    this.apiInterval = null;
    this.apiParser = this.alphaParser.buildParser(this.apiFunction, this.apiInterval);      

    // this.initTradingViewComponents(company.exchange, company.symbol, company.name);
    
    //Unsubcribes to previous observables that haven't finished loading
    if(!_.isNil(this.subscription)) this.subscription.unsubscribe();
    console.log(company);    

    this.subscription = this.alphaFetcher
      .getStockData(this.apiFunction, company.symbol, this.apiParser, this.apiInterval)
      .subscribe((results)=>{
        console.log(results.json());
        if(results.json()[this.apiParser[0]][this.apiParser[1]]){
          this.apiParser[1] = moment(this.apiParser[1]).subtract(1, 'days').format("YYYY-MM-DD");
        }
        
        switch(this.selectedFunction){
          case "Daily": this.processDailyTimeSeries(results); break;
          case "Weekly": this.processWeeklyTimeSeries(results); break;
          case "Monthly": this.processMonthlyTimeSeries(results); break;
        }
    });
  }

  public selectedFunctionEvent($event : any, company : any, callback?:(time_series:any[], chartLabels:any, chartData:any)=>any){

    console.log($event);

    if($event == "Intraday") {this.ngZone.run(()=>{this.interval_disabled = false});}
    else if($event != "Intraday"){
      this.ngZone.run(()=>{this.loadService.loadingChart()});

      this.selectedFunction = $event;
      
      this.selectedInterval = " "; 
      this.interval_disabled = true;
      this.apiFunction = _.filter(FUNCTIONS, (f)=>{if(f.name == this.selectedFunction) return f;})[0].apiCall;
      this.apiInterval = null;
      this.apiParser = this.alphaParser.buildParser(this.apiFunction, this.apiInterval);      
      this.alphaFetcher.getStockData(this.apiFunction, company.symbol, this.apiParser, this.apiInterval)

      .subscribe((results)=>{
        console.log(results.json());
        // results = results.json();
        if(results.json()[this.apiParser[0]][this.apiParser[1]]) this.apiParser[1] = moment(this.apiParser[1]).subtract(1, 'days').format("YYYY-MM-DD");

        console.log("$event: " + $event);
        console.log($event == "Weekly");
        if($event == "Daily"){this.processDailyTimeSeries(results);}
        else if($event == "Weekly"){ this.processWeeklyTimeSeries(results);}
        else if($event == "Monthly"){ this.processMonthlyTimeSeries(results);}
      });
    }

    
  }

  public processDailyTimeSeries(results : any, callback?:(time_series:any[], chartLabels:any, chartData:any)=>any){
      let time_series : any[] = [];
      Object.getOwnPropertyNames(results.json()["Time Series (Daily)"])
      .map((key: string) => {time_series.push({
        key: key, 
        open: parseFloat(results.json()["Time Series (Daily)"][key]["1. open"]).toFixed(2),
        high: parseFloat(results.json()["Time Series (Daily)"][key]["2. high"]).toFixed(2),
        low: parseFloat(results.json()["Time Series (Daily)"][key]["3. low"]).toFixed(2),
        close: parseFloat(results.json()["Time Series (Daily)"][key]["4. close"]).toFixed(2),
        volume: results.json()["Time Series (Daily)"][key]["5. volume"]});});
      
      let labels:any[] = [];
      let data:any[] = [];
  
      for(let i = 6; i >= 0; i--){
        labels.push(moment(time_series[i].key).format("ddd"));
        data.push(parseFloat(time_series[i].close));
      }

      this.ngZone.run(()=>{this.avCallBack(time_series, labels, data);});
  }

  public processWeeklyTimeSeries(results : any, callback?:(time_series:any[], chartLabels:any, chartData:any)=>any){
      let time_series : any[] = [];
      Object.getOwnPropertyNames(results.json()["Weekly Time Series"])
      .map((key: string) => {time_series.push({
        key: key, 
        open: parseFloat(results.json()["Weekly Time Series"][key]["1. open"]).toFixed(2),
        high: parseFloat(results.json()["Weekly Time Series"][key]["2. high"]).toFixed(2),
        low: parseFloat(results.json()["Weekly Time Series"][key]["3. low"]).toFixed(2),
        close: parseFloat(results.json()["Weekly Time Series"][key]["4. close"]).toFixed(2)});});
      
      let labels:any[] = [];
      let data:any[] = [];
  
      for(let i = 7; i >= 0; i--){
        labels.push(moment(time_series[i].key).format("MM/DD"));
        data.push(parseFloat(time_series[i].close));
      }

      this.ngZone.run(()=>{this.avCallBack(time_series, labels, data);});
  }

  public processMonthlyTimeSeries(results : any, callback?:(time_series:any[], chartLabels:any, chartData:any)=>any){
  
      let time_series : any[] = [];
      Object.getOwnPropertyNames(results.json()["Monthly Time Series"])
      .map((key: string) => {time_series.push({
        key: key, 
        open: parseFloat(results.json()["Monthly Time Series"][key]["1. open"]).toFixed(2),
        high: parseFloat(results.json()["Monthly Time Series"][key]["2. high"]).toFixed(2),
        low: parseFloat(results.json()["Monthly Time Series"][key]["3. low"]).toFixed(2),
        close: parseFloat(results.json()["Monthly Time Series"][key]["4. close"]).toFixed(2)});});
      
      let labels:any[] = [];
      let data:any[] = [];
  
      for(let i = 11; i >= 0; i--){
        labels.push(moment(time_series[i].key).format("MMM/YYYY"));
        data.push(parseFloat(time_series[i].close));
      }

      this.ngZone.run(()=>{this.avCallBack(time_series, labels, data);});
  }

  public avCallBack(time_series:any[], chartLabels:any, chartData:any){
    // this.ngZone.run(()=>{
      this.ohlc_outlook.open = time_series[0].open;
      this.ohlc_outlook.high = time_series[0].high;
      this.ohlc_outlook.low = time_series[0].low;
      this.ohlc_outlook.close = time_series[0].close;
      this.ohlc_outlook.volume = time_series[0].volume;

      this.ohlc_outlook_type = " for the day of " + moment(time_series[0].key).format("MMM Do, YYYY");
      this.closing_percent = "(" + (((parseFloat(time_series[1].close) - parseFloat(time_series[0].close)) / parseFloat(time_series[1].close)) * -100).toFixed(2) + "%)";

      if(this.ohlc_outlook.close > this.ohlc_outlook.open){
        this.closing_icon_class = "fa fa-arrow-up";
        this.closing_color_indicator = "rgb(2, 194, 2)";
      }else{
        this.closing_icon_class = "fa fa-arrow-down";
        this.closing_color_indicator = "rgb(212, 27, 27)";
      }

      this.lineChartLabels = chartLabels;
      this.lineChartData[0].data = chartData;
      // this.loading = false;
      // this.loading_chart = false;
      this.loadService.complete();
    // });
  }
}