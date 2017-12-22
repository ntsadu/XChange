import { Injectable, ComponentFactory, ComponentFactoryResolver, EventEmitter, ErrorHandler } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { HttpService } from "../http-service/xchange-http.service";
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material';

@Injectable()
export class XChangeController {

    public httpService: HttpService;
    public currentUser : any;

    constructor(public http: Http, public router: Router, public snackBar: MatSnackBar){
        this.initProviders();
    }

    initProviders() {
        this.httpService = new HttpService(this.http);
    }

    public getAllUsers(){
        this.httpService.GetAllUsers().subscribe(
            (data) => {
                console.log("GET ALL USERS >>");
                console.log(data);
            }, () => {console.log("ERROR: COULD NOT GET USERS");}
        )
    }

    public getAllUserSubscriptions(){
        this.httpService.GetAllUserSubscriptions().subscribe(
            (data) => {
                console.log("GET ALL SUBSCRIPTIONS >>");
                console.log(data);
            }, () => {console.log("ERROR: COULD NOT GET SUBSCRIPTIONS");}
        )
    }

    public getAllUserFavorites(){
        this.httpService.GetAllUserFavorites().subscribe(
            (data) => {
                console.log("GET ALL FAVORITES >>");
                console.log(data);
            }, () => {console.log("ERROR: COULD NOT GET FAVORITES");}
        )
    }

    public getAllCompanies(){
        this.httpService.GetAllCompanies().subscribe(
            (data) => {
                console.log("GET ALL COMPANIES >>");
                console.log(data);
            }, () => {console.log("ERROR: COULD NOT GET COMPANIES");}
        )
    }
}
