import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class LoadService {

    loading = true;
    loading_chart = true;
    theres_nothing_here = false;

    public initialize(){
        this.loading = true;
        this.loading_chart = true;
        this.theres_nothing_here = false;
    }

    public nothing(){
        this.loading = false;
        this.loading_chart = false;
        this.theres_nothing_here = true;   
    }

    public loadingChart(){
        this.loading = false;
        this.loading_chart = true;
        this.theres_nothing_here = false;  
    }

    public complete(){
        this.loading = false;
        this.loading_chart = false;
        this.theres_nothing_here = false;   
    }
}