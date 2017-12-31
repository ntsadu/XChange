import { Component, AnimationTransitionEvent, ViewEncapsulation, Output, EventEmitter, NgZone, OnInit, ViewChild } from '@angular/core';
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

export class DashboardComponent implements OnInit {

  @ViewChild('modalTemplate')
  public modalTemplate:ModalTemplate<ModalContext, string, string>

  @Output() logoutEvent: EventEmitter<any> = new EventEmitter<any>();
  public transitionController = new TransitionController();

  amount : number = 0.00;
  description : string;
  currentUserRoleId : number;
  modalActions = new EventEmitter<string|MaterializeAction>();

  newsPage : any = true;
  listingsPage : any = false;
  watchlistPage : any = false;
  subscriptionsPage : any = false;
  searchPage : any = false;

  public data;
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "email";
  public sortOrder = "asc";
  
  public logo = '../../assets/logos/ers-logo.svg';

  private _opened: boolean = false;
  private _modeNum: number = 2;
  private _positionNum: number = 0;
  private _dock: boolean = false;
  private _closeOnClickOutside: boolean = true;
  private _closeOnClickBackdrop: boolean = false;
  private _showBackdrop: boolean = false;
  private _animate: boolean = true;
  private _trapFocus: boolean = true;
  private _autoFocus: boolean = true;
  private _keyClose: boolean = false;
  private _autoCollapseHeight: number = null;
  private _autoCollapseWidth: number = null;
  private _MODES: Array<string> = ['over', 'push', 'slide'];
  private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];
  

  constructor(public ersApp:ERSController, public ngZone:NgZone,  private loginService: LoginService,
    private router: Router, public modalService:SuiModalService) {}

  // Get User Information from local storage
  oldEmail: string;
  oldUsername: string;
  
  // Email and Username Validation
  isValidUsername: boolean = true;
  isValidEmail: boolean = true;

  user: User = this.loginService.subscribers.getValue();
  ngOnInit() {
      this.user = this.loginService.subscribers.getValue();
  }

  // Toggle views between editing and displaying user information
  isValid: boolean = false;
  changeValue() {
    this.isValidUsername = true;
    this.isValidEmail = true;
    this.isValid = !this.isValid;
    this.oldEmail = this.user.email;
    this.oldUsername = this.user.username;
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
        .onApprove(result => {})
        .onDeny(result => {});
  }

  update() {
    this.isValidUsername = true;
    this.isValidEmail = true;
    this.loginService.updateInfo(this.user)
    .subscribe(data => {
      if(data.email == null) {
        this.user.email = this.oldEmail;
        this.isValidEmail = !this.isValidEmail;
      }
      else if(data.username == null) {
        this.user.username = this.oldUsername;
        this.isValidUsername = !this.isValidUsername;
      }
      else {
        this.isValid = !this.isValid;
      }
      this.loginService.subscribers.next(data);
      localStorage.setItem("user", JSON.stringify(data));
    });
  }

  public switchPage(e : any){
    let target = e.target || e.srcElement || e.currentTarget;
    let id = target.attributes.id.nodeValue;
    // this.ngZone.run(() => {
    //   if(id == "pending_requests"){
    //     this.pendingPage = true;
    //     this.processedPage = false;
    //     this.newRequestPage = false;
    //   }else if(id == "processed_requests"){
    //     this.pendingPage = false;
    //     this.processedPage = true;
    //     this.newRequestPage = false;   
    //   }else if(id == "new_request"){
    //     this.pendingPage = false;
    //     this.processedPage = false;
    //     this.newRequestPage = true;        
    //   }
    // });



    this.ngZone.run(() => {
      if(id == "news"){
        this.newsPage = true;
        this.listingsPage = false;
        this.watchlistPage = false;
        this.subscriptionsPage = false;
        this.searchPage = false;

        // this.animate("shake");

      }else if(id == "listings"){
        this.newsPage = false;
        this.listingsPage = true;
        this.watchlistPage = false;
        this.subscriptionsPage = false;
        this.searchPage = false;

        // this.animate("shake");
        
      }else if(id == "watchlist"){
        this.newsPage = false;
        this.listingsPage = false;
        this.watchlistPage = true;
        this.subscriptionsPage = false;
        this.searchPage = false;   
      }else if(id == "subscriptions"){
        this.newsPage = false;
        this.listingsPage = false;
        this.watchlistPage = false;
        this.subscriptionsPage = true;
        this.searchPage = false;   
      }else if(id == "search"){
        this.newsPage = false;
        this.listingsPage = false;
        this.watchlistPage = false;
        this.subscriptionsPage = false;
        this.searchPage = true;   
      }
    });
  }

  public animate(transitionName:string) {
    this.transitionController.animate(
        new Transition(transitionName, 500, TransitionDirection.In, () => console.log("Completed transition.")));
  }

  logout(){
    this.loginService.logout();
    this.router.navigate(["/login"]);
  }

  updateAmount(a : any){
    this.amount = a;
  }

  updateDescription(d : any){
    this.description = d;
  }

  openModal(p?:any) {
    this.modalActions.emit({action:"modal",params:['open']});
  }

  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }
  
  private _toggleOpened(): void {
    this._opened = !this._opened;
  }

  private _toggleMode(): void {
    this._modeNum++;

    if (this._modeNum === this._MODES.length) {
      this._modeNum = 0;
    }
  }

  private _toggleAutoCollapseHeight(): void {
    this._autoCollapseHeight = this._autoCollapseHeight ? null : 500;
  }

  private _toggleAutoCollapseWidth(): void {
    this._autoCollapseWidth = this._autoCollapseWidth ? null : 500;
  }

  private _togglePosition(): void {
    this._positionNum++;

    if (this._positionNum === this._POSITIONS.length) {
      this._positionNum = 0;
    }
  }

  private _toggleDock(): void {
    this._dock = !this._dock;
  }

  private _toggleCloseOnClickOutside(): void {
    this._closeOnClickOutside = !this._closeOnClickOutside;
  }

  private _toggleCloseOnClickBackdrop(): void {
    this._closeOnClickBackdrop = !this._closeOnClickBackdrop;
  }

  private _toggleShowBackdrop(): void {
    this._showBackdrop = !this._showBackdrop;
  }

  private _toggleAnimate(): void {
    this._animate = !this._animate;
  }

  private _toggleTrapFocus(): void {
    this._trapFocus = !this._trapFocus;
  }

  private _toggleAutoFocus(): void {
    this._autoFocus = !this._autoFocus;
  }

  private _toggleKeyClose(): void {
    this._keyClose = !this._keyClose;
  }

  private _onOpenStart(): void {
    console.info('Sidebar opening');
  }

  private _onOpened(): void {
    console.info('Sidebar opened');
  }

  private _onCloseStart(): void {
    console.info('Sidebar closing');
  }

  private _onClosed(): void {
    console.info('Sidebar closed');
  }

  
  public toInt(num: string) {
      return +num;
  }

  public sortByWordLength = (a: any) => {
      return a.city.length;
  }
}
