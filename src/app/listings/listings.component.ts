import { Component, OnInit } from '@angular/core';
import { XChangeController } from '../../providers/ers-controller/xchange-controller';
import { Company } from '../../interfaces/xchange-interfaces/interfaces';
import * as _ from 'lodash';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {

  tableHeader: string = "Equity Listings";
  options : string[] = [];
  companyList: Company[];

  constructor(public xchangeApp : XChangeController) { 
    this.xchangeApp.httpService
    .GetAllCompanies()
    .subscribe(
      (data) => {
          console.log("GET ALL COMPANIES >>");
          console.log(data);
          this.companyList = _.orderBy(data, ['symbol'], ['asc']);

          _.map(this.companyList, (c : Company)=>{
            this.options.push(c.symbol + " " + c.name);
          });

          console.log(this.companyList);
      }, () => {console.log("ERROR: COULD NOT GET COMPANIES");}
    );
  }

  ngOnInit() {
  }

  openModal(c?:any){
    console.log("OPEN MODAL CLICKED");
  }
}
