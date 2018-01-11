import { Component, AnimationTransitionEvent, ViewEncapsulation, Output, EventEmitter, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TransitionController, Transition, TransitionDirection } from "ng2-semantic-ui";
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { SidebarModule } from 'ng-sidebar';
import { MaterializeAction } from 'angular2-materialize';
import { ERSController } from '../../providers/ers-controller/ers-controller';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { LoginService } from 'app/login.service';
import { User } from 'interfaces/xchange-interfaces/interfaces';
import postscribe from 'postscribe';
import { XChangeController } from 'providers/ers-controller/xchange-controller';
import { TickerService } from 'providers/ticker.service';


export interface ModalContext {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<ModalContext, string, string>

  @Output() logoutEvent: EventEmitter<any> = new EventEmitter<any>();
  public transitionController = new TransitionController();

  amount: number = 0.00;
  description: string;
  currentUserRoleId: number;
  modalActions = new EventEmitter<string | MaterializeAction>();

  companies:any[];

  newsPage: any = true;
  listingsPage: any = true;
  watchlistPage: any = true;
  subscriptionsPage: any = true;
  searchPage: any = true;

  public data;
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "email";
  public sortOrder = "asc";

  public logo = '../../assets/logos/ers-logo.svg';

  public _opened: boolean = false;
  public _modeNum: number = 2;
  public _positionNum: number = 0;
  public _dock: boolean = false;
  public _closeOnClickOutside: boolean = true;
  public _closeOnClickBackdrop: boolean = false;
  public _showBackdrop: boolean = false;
  public _animate: boolean = true;
  public _trapFocus: boolean = true;
  public _autoFocus: boolean = true;
  public _keyClose: boolean = false;
  public _autoCollapseHeight: number = null;
  public _autoCollapseWidth: number = null;
  public _MODES: Array<string> = ['over', 'push', 'slide'];
  public _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

  // ticker_source:string = "https://s.tradingview.com/tickerswidgetembed/#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22INDEX%3ASPX%22%2C%22title%22%3A%22S%26P%20500%22%7D%2C%7B%22proName%22%3A%22INDEX%3AIUXX%22%2C%22title%22%3A%22Nasdaq%20100%22%7D%2C%7B%22proName%22%3A%22FX_IDC%3AEURUSD%22%2C%22title%22%3A%22EUR%2FUSD%22%7D%2C%7B%22proName%22%3A%22COINBASE%3ABTCUSD%22%2C%22title%22%3A%22BTC%2FUSD%22%7D%2C%7B%22proName%22%3A%22NYMEX%3ACL1!%22%2C%22title%22%3A%22Crude%20Oil%22%7D%2C%7B%22proName%22%3A%22FX_IDC%3AXAUUSD%22%2C%22title%22%3A%22Gold%22%7D%5D%2C%22locale%22%3A%22en%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A104%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22tickers%22%7D";
  ticker_source:string;

  constructor(public ngZone: NgZone, private loginService: LoginService,
              private router: Router, public modalService: SuiModalService, 
              public xchangeApp: XChangeController, public ticker: TickerService,
              public sanitizer: DomSanitizer) { 

      this.newsPage = true;
      this.listingsPage = false;
      this.watchlistPage = false;
      this.subscriptionsPage = false;
      this.searchPage = false;

      this.ngZone.run(()=>{
        console.log(this.ticker_source);          
        this.ticker_source = this.ticker.setTicker([{symbol: "GOOG", name: "GOOGLE"}, {symbol: "FB", name: "FACEBOOK"}, {symbol: "MSFT", name: "MICROSOFT"}, {symbol: "AMZN", name: "AMAZON"}]);
        console.log(this.ticker_source);
      });

      // this.xchangeApp.httpService
      // .GetAllCompanies()
      // .subscribe((results)=>{
      //   this.companies = results;

      //   this.ngZone.run(()=>{
      //     console.log(this.ticker_source);          
      //     this.ticker_source = this.ticker.setTicker([{symbol: "GOOG", name: "GOOGLE"}, {symbol: "FB", name: "FACEBOOK"}, {symbol: "MSFT", name: "MICROSOFT"}, {symbol: "AMZN", name: "AMAZON"}]);
      //     console.log(this.ticker_source);
      //   });
      // });
    }

  // Get User Information from local storage
  oldEmail: string;
  oldUsername: string;
  oldFirstName: string;
  oldLastName: string;
  oldPassword: string;

  // Blur Validations
  usernameFlag: boolean = false;
  emailFlag: boolean = false;

  // Trigger for changing button values
  on: boolean = true;

  // Email and Username validation messages
  isValidUsername: boolean = true;
  isValidEmail: boolean = true;


  user: User = this.loginService.subscribers.getValue();


  ngOnInit() {
    this.user = this.loginService.subscribers.getValue();

    if(_.isNil(this.user)){
      this.router.navigate(["dashboard"]);
    }else{
      this.oldEmail = this.user.email;
      this.oldUsername = this.user.username;
      this.oldFirstName = this.user.firstName;
      this.oldLastName = this.user.lastName;
      this.oldEmail = this.user.email;
      this.oldPassword = this.user.password;
    }
  }

  ngAfterViewInit(){

    console.log("ehem");
    console.log(document.getElementById('litty'));
    
    // postscribe('#tv-container', '<script> new TradingView.widget({ "autosize": true, "symbol": "COINBASE:BTCUSD", "interval": "D", "timezone": "Etc/UTC", "theme": "Black", "style": "1", "locale": "en", "toolbar_bg": "rgba(0, 0, 0, 1)", "hide_top_toolbar": true, "save_image": false, "hideideas": true});</script>');    
    // this.ngZone.run(()=>{

    //   postscribe('#ticker', 
    //   `<script src="https://s3.tradingview.com/external-embedding/embed-widget-tickers.js">{
    //     "symbols": [
    //       {
    //         "proName": "INDEX:SPX",
    //         "title": "S&P 500"
    //       },
    //       {
    //         "proName": "INDEX:IUXX",
    //         "title": "Nasdaq 100"
    //       },
    //       {
    //         "proName": "FX_IDC:EURUSD",
    //         "title": "EUR/USD"
    //       },
    //       {
    //         "proName": "NYMEX:CL1!",
    //         "title": "Crude Oil"
    //       },
    //       {
    //         "proName": "FX_IDC:XAUUSD",
    //         "title": "Gold"
    //       }
    //     ],
    //     "locale": "en"
    //   }</script>`
    //   );     
    // });

    console.log(document.getElementById("ticker"));

    // postscribe('#tv-container', 
    // `<script type="text/javascript">
    //   new TradingView.MediumWidget({
    //     "container_id": "tv-medium-widget-13429",
    //     "symbols": [
    //       [
    //         "Apple",
    //         "AAPL "
    //       ],
    //       [
    //         "Google",
    //         "GOOGL"
    //       ],
    //       [
    //         "Microsoft",
    //         "MSFT"
    //       ]
    //     ],
    //     "greyText": "Quotes by",
    //     "gridLineColor": "#e9e9ea",
    //     "fontColor": "#83888D",
    //     "underLineColor": "#dbeffb",
    //     "trendLineColor": "#4bafe9",
    //     "width": 500,
    //     "height": 400,
    //     "locale": "en"
    //   });
    // </script>`
    // );   

  }

  validateEmail() {
    this.loginService.validateEmail(this.user.email)
      .subscribe(data => {
        if (data == null) {
          this.emailFlag = false;
        }
        else {
          this.emailFlag = true;
        }
      })
  }

  validateUsername() {
    this.loginService.validateUsername(this.user.username)
      .subscribe(data => {
        if (data == null) {
          this.usernameFlag = false;
        }
        else {
          this.usernameFlag = true;
        }
      })
  }

  // Toggle views between editing and displaying user information
  isValid: boolean = false;
  changeView() {
    // Toggling between button values "Back" and "Edit"
    if(this.on) {
      document.getElementById("toggle").innerText = 'Back';
      this.on = !this.on;
      console.log("Off");
    }
    else {
      document.getElementById("toggle").innerText = 'Edit';
      this.on = !this.on;
      console.log("On");
    }
    // Triggers
    this.usernameFlag = false;
    this.emailFlag = false;
    this.isValidUsername = true;
    this.isValidEmail = true;
    this.isValid = !this.isValid;
    // Assinging old user info user object
    this.user.username = this.oldUsername;
    this.user.firstName = this.oldFirstName;
    this.user.lastName = this.oldLastName;
    this.user.email = this.oldEmail;
    this.user.password = this.oldPassword;
  }

  // User Profile Modal
  public openProfileModal() {
    const config = new TemplateModalConfig<ModalContext, string, string>(this.modalTemplate);
    config.closeResult = "closed!";
    config.mustScroll = true;
    config.context = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      userName: this.user.username,
      email: this.user.email
    };
    this.modalService
      .open(config)
      .onApprove(result => { })
      .onDeny(result => {
        this.user.username = this.oldUsername;
        this.user.firstName = this.oldFirstName;
        this.user.lastName = this.oldLastName;
        this.user.email = this.oldEmail;
        this.user.password = this.oldPassword;
        this.isValid = false;
        this.on = true;
      });
  }

  // Update user profile information
  update() {
    this.isValidUsername = true;
    this.isValidEmail = true;
    this.loginService.updateInfo(this.user)
      .subscribe(data => {
        // Assigning updated data to the user
        this.user.username = data.username;
        this.user.firstName = data.firstName;
        this.user.lastName = data.lastName;
        this.user.email = data.email;
        this.user.password = data.password;

        // Updating the old user info
        this.oldUsername = this.user.username;
        this.oldFirstName = this.user.firstName;
        this.oldLastName = this.user.lastName;
        this.oldEmail = this.user.email;
        this.oldPassword = this.user.password;
        
        // Trigger for toggling button
        this.on = false;
        
        // Store new user session
        this.loginService.subscribers.next(data);
        localStorage.setItem("user", JSON.stringify(data));
        this.changeView();
      });
  }

  public switchPage(e: any) {
    let target = e.target || e.srcElement || e.currentTarget;
    let id = target.attributes.id.nodeValue;
    this.ngZone.run(() => {
      if (id == "news") {
        this.newsPage = true;
        this.listingsPage = false;
        this.watchlistPage = false;
        this.subscriptionsPage = false;
        this.searchPage = false;

        // this.animate("shake");

      } else if (id == "listings") {
        this.newsPage = false;
        this.listingsPage = true;
        this.watchlistPage = false;
        this.subscriptionsPage = false;
        this.searchPage = false;

        // this.animate("shake");

      } else if (id == "watchlist") {
        this.newsPage = false;
        this.listingsPage = false;
        this.watchlistPage = true;
        this.subscriptionsPage = false;
        this.searchPage = false;
      } else if (id == "subscriptions") {
        this.newsPage = false;
        this.listingsPage = false;
        this.watchlistPage = false;
        this.subscriptionsPage = true;
        this.searchPage = false;
      } else if (id == "search") {
        this.newsPage = false;
        this.listingsPage = false;
        this.watchlistPage = false;
        this.subscriptionsPage = false;
        this.searchPage = true;
      }
    });
  }

  public animate(transitionName: string) {
    this.transitionController.animate(
      new Transition(transitionName, 500, TransitionDirection.In, () => console.log("Completed transition.")));
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(["/login"]);
  }

  updateAmount(a: any) {
    this.amount = a;
  }

  updateDescription(d: any) {
    this.description = d;
  }

  openModal(p?: any) {
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }

  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }

  public _toggleOpened(): void {
    this._opened = !this._opened;
  }

  public _toggleMode(): void {
    this._modeNum++;

    if (this._modeNum === this._MODES.length) {
      this._modeNum = 0;
    }
  }

  public _toggleAutoCollapseHeight(): void {
    this._autoCollapseHeight = this._autoCollapseHeight ? null : 500;
  }

  public _toggleAutoCollapseWidth(): void {
    this._autoCollapseWidth = this._autoCollapseWidth ? null : 500;
  }

  public _togglePosition(): void {
    this._positionNum++;

    if (this._positionNum === this._POSITIONS.length) {
      this._positionNum = 0;
    }
  }

  public _toggleDock(): void {
    this._dock = !this._dock;
  }

  public _toggleCloseOnClickOutside(): void {
    this._closeOnClickOutside = !this._closeOnClickOutside;
  }

  public _toggleCloseOnClickBackdrop(): void {
    this._closeOnClickBackdrop = !this._closeOnClickBackdrop;
  }

  public _toggleShowBackdrop(): void {
    this._showBackdrop = !this._showBackdrop;
  }

  public _toggleAnimate(): void {
    this._animate = !this._animate;
  }

  public _toggleTrapFocus(): void {
    this._trapFocus = !this._trapFocus;
  }

  public _toggleAutoFocus(): void {
    this._autoFocus = !this._autoFocus;
  }

  public _toggleKeyClose(): void {
    this._keyClose = !this._keyClose;
  }

  public _onOpenStart(): void {
    console.info('Sidebar opening');
  }

  public _onOpened(): void {
    console.info('Sidebar opened');
  }

  public _onCloseStart(): void {
    console.info('Sidebar closing');
  }

  public _onClosed(): void {
    console.info('Sidebar closed');
  }


  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.city.length;
  }
}
