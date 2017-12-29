import { Component, Input, Output, EventEmitter, NgZone, OnInit } from '@angular/core';
import { ERSController } from '../../providers/ers-controller/ers-controller';
import { MaterializeDirective } from "angular2-materialize";
import { MatTabChangeEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { setTimeout } from 'timers';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'app/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";

  ngOnInit() {
    this.loginService.subscribeToLogin(() => {
      this.loginService.subscribers.getValue();
      //this.router.navigate(["news"]);
    });
  }
  constructor(private loginService: LoginService, private router: Router) { }

  login(){
    if(this.loginService.subscribers.getValue() != null){
      this.router.navigate(["/news"]);
    }
    else {
      alert("in correct password");
      //this.router.navigate(["/login"]);
    }
    
  }

  // @Output() loginEvent: EventEmitter<any> = new EventEmitter<any>();

  // username : string;
  // password : string;
  // loginDone : boolean = false;
  // loginType : number = 0;

  // tabChanged : Function = (tabChangeEvent: MatTabChangeEvent): void => {
  //   this.loginType = tabChangeEvent.index;
  //   console.log('Login Type => ', this.loginType);
  // }

  // promiseEmployeeLogin : Function = ()=> {
  //   new Promise((resolve, reject) => {
  //     if(this.ersApp.currentUser != null) resolve();
  //     else reject();
  //     }).then(()=>{this.ersApp.initializeEmployee(this.loginEvent);}, 
  //             ()=>{console.log("Employee Login Failed!");});
  // }

  // promiseManagerLogin : Function = ()=> {
  //   new Promise((resolve, reject) => {
  //     if(this.ersApp.currentUser != null) resolve();
  //     else reject();
  //     }).then(()=>{this.ersApp.initializeManager(this.loginEvent);}, 
  //             ()=>{console.log("Manager Login Failed!");});
  // }

  // constructor(public ersApp : ERSController, public router: Router, public snackBar: MatSnackBar) { }

  // ngOnInit() {
  //   this.ersApp.currentUser = {firstname: "Jon", lastName: "Doe"};
  // }

  // openSnackBar(message:string) {
  //   this.snackBar.open(message, "OK", {
  //     duration: 2000,
  //   });
  // }

  // login(){
  //   // if(this.loginType == 0) this.ersApp.loginEmployee(this.username, this.password, this.promiseEmployeeLogin, this.openSnackBar);
  //   // else if(this.loginType == 1) this.ersApp.loginManager(this.username, this.password, this.promiseManagerLogin);
  //   if(this.loginType == 0) this.router.navigate(["dashboard"]);
  //   else if(this.loginType == 1) console.log("Out of service..");
  // }

  // register(){
  //   this.router.navigate(["register"]);
  // }

  // updateUsername(u : any){
  //   this.username = u;
  // }

  // updatePassword(p : any){
  //   this.password = p;
  // }
}
