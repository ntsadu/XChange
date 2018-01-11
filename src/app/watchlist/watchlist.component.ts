//Core Modules
import { Component, OnInit, NgZone, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';

//UI Modules
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';

//Utilities
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import * as _ from 'lodash';

//Services
import { XChangeController } from '../../providers/ers-controller/xchange-controller';
import { AlphaVantageService } from '../../providers/alpha-vantage-service.service';
import { FetchingService } from '../../providers/fetching.service';
import { ParsingService } from '../../providers/parsing.service';
import { WatchListSorter } from './watchlist-sorter.service';
import { LoginService } from '../login.service';
import { PostscribeService } from '../../providers/postscribe.service';
import { LoadService } from '../../providers/load.service';

//Interfaces
import { Company } from '../../interfaces/xchange-interfaces/interfaces';
import { ModalContext } from '../listings/listings.component';

//Constants
import { FUNCTIONS, INTERVALS } from '../../providers/alpha-vantage-service.service';



@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, AfterViewChecked {

  @ViewChild('modalTemplate')
  public modalTemplate:ModalTemplate<ModalContext, string, string>

  currentCompany : any = {};
  // click_subscription : Subscription;

  tableHeader: string = "Watch List";
  options : string[] = [];
  companyList: Company[] = [];

  function_options:Array<string>;
  interval_options:Array<string>;
  option = " ";

  p:any;

  trading_tv_set = false;
  
  constructor(
    public xchangeApp : XChangeController, 
    public ngZone : NgZone, 
    public modalService: SuiModalService,
    public alphaVantage: AlphaVantageService, 
    public alphaFetcher: FetchingService, 
    public alphaParser: ParsingService,
    public sorter: WatchListSorter,
    public loginService: LoginService,
    public postscribeService: PostscribeService,
    public loadService: LoadService) { 


    this.loadService.initialize();
    this.ngZone.run(()=>{   
    this.function_options = this.alphaVantage.function_options;
    this.interval_options = this.alphaVantage.interval_options;
    });


    forkJoin([
        this.xchangeApp.httpService.GetAllUserFavorites({userId: this.loginService.subscribers.getValue().userId}), 
        this.xchangeApp.httpService.GetAllCompanies()
    ]).subscribe(results => {

      if(results[0].length == 0){
        this.ngZone.run(()=>{     
          this.loadService.nothing();
        });
      }else if(!_.isNil(results[0]) && results[0].length > 0){
        
          _.map(results[1], (c:any)=>{
            _.map(results[0], (uf:any)=>{
              if(c.companyId == uf.companyId) this.companyList.push(c);
            });
          });

          this.companyList = _.orderBy(results[0], ["symbol"], ["asc"]);
          this.currentCompany = this.companyList[0];
  
          _.map(this.companyList, (c : Company)=>{
            this.options.push(c.symbol + " " + c.name);
          });
  
          this.selectedFunctionEvent("Daily");
      }
    });
  }

  ngOnInit() {

  }

  ngAfterViewChecked(){
    if(document.getElementById('tv-container') != null && this.trading_tv_set == false){
      this.postscribeService.postscribeChart(this.currentCompany.symbol, ()=>{this.trading_tv_set = true});
    }
  }

  initTradingViewComponents(exchange:string, symbol: string, name:string){
    document.getElementById("tv-container").innerHTML = null;
    this.postscribeService.postscribeChart(symbol);
  }

  public removeFromWatchList(){
    this.xchangeApp.httpService
    .RemoveUserFavorite({userId: this.loginService.subscribers.getValue().userId, companyId: this.currentCompany.companyId})
    .subscribe((results:any)=>{

      this.companyList = _.filter(this.companyList, (c)=>{ if(c.name != this.currentCompany.name) return c; });

      if(!_.isNil(this.companyList[0])){
        this.ngZone.run(()=>{
          this.currentCompany = this.companyList[0];
          this.loadService.complete();
        });
      }else{
        this.loadService.nothing();
      }
    });
  }

  public removeFromWatchListWithArgs(company:any){
    this.xchangeApp.httpService
    .RemoveUserFavorite({userId: this.loginService.subscribers.getValue().userId, companyId: company.companyId})
    .subscribe((results:any)=>{

          this.companyList = _.filter(this.companyList, (c)=>{ if(c.name != company.name) return c; });

          if(!_.isNil(this.companyList[0])){
            this.ngZone.run(()=>{
              this.currentCompany = this.companyList[0];
              this.loadService.complete();
            });
          }else{
            this.loadService.nothing();
          }
    });
  }

  public openModal(company : any) {
    this.ngZone.run(()=>{this.loadService.loadingChart();});
    this.currentCompany = company;
    this.initTradingViewComponents(company.exchange, company.symbol, company.name);

    this.alphaVantage.open(this.currentCompany);
  }

  refreshModal(){
    this.selectedFunctionEvent(this.alphaVantage.selectedFunction);
  }

  public resultSelected($event : any){
    this.ngZone.run(()=>{this.loadService.loadingChart()});
    console.log($event.substring(0, $event.indexOf(" ")));
    
    let company = _.filter(this.companyList, (c)=>{
      if(c.symbol == ($event.substring(0, $event.indexOf(" ")))) return c;
    })[0];

    this.openModal(company);
  }

  getCurrentDate(){
    return moment().format('MMM Do, YYYY');
  }

  getCurrentTime(){
    return moment().format('hh:mm');
  }

  public selectedFunctionEvent($event : any){
    this.alphaVantage.selectedFunctionEvent($event, this.currentCompany);
  }

  sort(op?:any){
    if(!this.loadService.theres_nothing_here){
      this.sorter.sort(op, (column:string, order:string)=>{
        this.ngZone.run(()=>{
              this.companyList = _.orderBy(this.companyList, [column], [order]);
            });
      });
    }
  }
}
