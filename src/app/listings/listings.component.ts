import { Component, OnInit, NgZone } from '@angular/core';
import { XChangeController } from '../../providers/ers-controller/xchange-controller';
import { Company } from '../../interfaces/xchange-interfaces/interfaces';
import * as _ from 'lodash';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {

  loading = true;

  symbol_asc = true;
  symbol_desc = false;
  symbol_left = "15px";
  symbol_top = "20px";

  exchange_asc = false;
  exchange_desc = false;
  exchange_left = "20px";
  exchange_top = "25px";

  name_asc = false;
  name_desc = false;
  name_left = "10px";
  name_top = "25px";

  sector_asc = false;
  sector_desc = false;
  sector_left = "10px";
  sector_top = "25px";

  industry_asc = false;
  industry_desc = false;
  industry_left = "10px";
  industry_top = "25px";

  tableHeader: string = "Equity Listings";
  options : string[] = [];
  companyList: Company[];

  constructor(public xchangeApp : XChangeController, public ngZone : NgZone) { 
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

          if(!_.isNil(this.companyList)) {
            this.ngZone.run(()=>{
              this.loading = false;
            });
          }
      }, () => {console.log("ERROR: COULD NOT GET COMPANIES");}
    );
  }

  ngOnInit() {
  }

  openModal(c?:any){
    console.log("OPEN MODAL CLICKED"); 

  }

  //This is disgusting
  sort(op? : any){
    console.log(op);
    if(op == "symbol"){
      if(this.symbol_asc == true 
         || (this.symbol_asc == false 
          && this.symbol_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = false;
          this.symbol_desc = true;
          this.exchange_asc = false;
          this.exchange_desc = false;
          this.name_asc = false;
          this.name_desc = false;
          this.sector_asc = false;
          this.sector_desc = false;
          this.industry_asc = false;
          this.industry_desc = false;

          this.symbol_left = "15px";
          this.symbol_top = "20px";
          this.exchange_left = "20px";
          this.exchange_top = "25px";
          this.name_left = "10px";
          this.name_top = "25px";
          this.sector_left = "10px";
          this.sector_top = "25px";
          this.industry_left = "10px";
          this.industry_top = "25px";

          this.doSort(op, "desc");
        });
      }else if(this.symbol_desc == true || (this.symbol_asc == false && this.symbol_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = true;
          this.symbol_desc = false;
          this.exchange_asc = false;
          this.exchange_desc = false;
          this.name_asc = false;
          this.name_desc = false;
          this.sector_asc = false;
          this.sector_desc = false;
          this.industry_asc = false;
          this.industry_desc = false;

          this.symbol_left = "15px";
          this.symbol_top = "20px";
          this.exchange_left = "20px";
          this.exchange_top = "25px";
          this.name_left = "10px";
          this.name_top = "25px";
          this.sector_left = "10px";
          this.sector_top = "25px";
          this.industry_left = "10px";
          this.industry_top = "25px";

          this.doSort(op, "asc");           

        });
      }
    }else if(op == "exchange"){
      if(this.exchange_asc == true || (this.exchange_asc == false && this.exchange_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = false;
          this.symbol_desc = false;
          this.exchange_asc = false;
          this.exchange_desc = true;
          this.name_asc = false;
          this.name_desc = false;
          this.sector_asc = false;
          this.sector_desc = false;
          this.industry_asc = false;
          this.industry_desc = false;

          this.symbol_left = "15px";
          this.symbol_top = "25px";
          this.exchange_left = "20px";
          this.exchange_top = "20px";
          this.name_left = "10px";
          this.name_top = "25px";
          this.sector_left = "10px";
          this.sector_top = "25px";
          this.industry_left = "10px";
          this.industry_top = "25px";

          this.doSort(op, "desc");           

        });
      }else if(this.exchange_desc == true || (this.exchange_asc == false && this.exchange_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = false;
          this.symbol_desc = false;
          this.exchange_asc = true;
          this.exchange_desc = false;
          this.name_asc = false;
          this.name_desc = false;
          this.sector_asc = false;
          this.sector_desc = false;
          this.industry_asc = false;
          this.industry_desc = false;

          this.symbol_left = "15px";
          this.symbol_top = "25px";
          this.exchange_left = "20px";
          this.exchange_top = "20px";
          this.name_left = "10px";
          this.name_top = "25px";
          this.sector_left = "10px";
          this.sector_top = "25px";
          this.industry_left = "10px";
          this.industry_top = "25px";

          this.doSort(op, "asc");           

        });
      }
    }else if(op == "name"){
      if(this.name_asc == true || (this.name_asc == false && this.name_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = false;
          this.symbol_desc = false;
          this.exchange_asc = false;
          this.exchange_desc = false;
          this.name_asc = false;
          this.name_desc = true;
          this.sector_asc = false;
          this.sector_desc = false;
          this.industry_asc = false;
          this.industry_desc = false;

          this.symbol_left = "15px";
          this.symbol_top = "25px";
          this.exchange_left = "20px";
          this.exchange_top = "25px";
          this.name_left = "10px";
          this.name_top = "20px";
          this.sector_left = "10px";
          this.sector_top = "25px";
          this.industry_left = "10px";
          this.industry_top = "25px";

          this.doSort(op, "desc");           

        });
      }else if(this.name_desc == true || (this.name_asc == false && this.name_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = false;
          this.symbol_desc = false;
          this.exchange_asc = false;
          this.exchange_desc = false;
          this.name_asc = true;
          this.name_desc = false;
          this.sector_asc = false;
          this.sector_desc = false;
          this.industry_asc = false;
          this.industry_desc = false;

          this.symbol_left = "15px";
          this.symbol_top = "25px";
          this.exchange_left = "20px";
          this.exchange_top = "25px";
          this.name_left = "10px";
          this.name_top = "20px";
          this.sector_left = "10px";
          this.sector_top = "25px";
          this.industry_left = "10px";
          this.industry_top = "25px";

          this.doSort(op, "asc");           

        });
      }
    }else if(op == "sector"){
      if(this.sector_asc == true || (this.sector_asc == false && this.sector_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = false;
          this.symbol_desc = false;
          this.exchange_asc = false;
          this.exchange_desc = false;
          this.name_asc = false;
          this.name_desc = false;
          this.sector_asc = false;
          this.sector_desc = true;
          this.industry_asc = false;
          this.industry_desc = false;

          this.symbol_left = "15px";
          this.symbol_top = "25px";
          this.exchange_left = "20px";
          this.exchange_top = "25px";
          this.name_left = "10px";
          this.name_top = "25px";
          this.sector_left = "10px";
          this.sector_top = "20px";
          this.industry_left = "10px";
          this.industry_top = "25px";

          this.doSort(op, "desc");           

        });
      }else if(this.sector_desc == true || (this.sector_asc == false && this.sector_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = false;
          this.symbol_desc = false;
          this.exchange_asc = false;
          this.exchange_desc = false;
          this.name_asc = false;
          this.name_desc = false;
          this.sector_asc = true;
          this.sector_desc = false;
          this.industry_asc = false;
          this.industry_desc = false;

          this.symbol_left = "15px";
          this.symbol_top = "25px";
          this.exchange_left = "20px";
          this.exchange_top = "25px";
          this.name_left = "10px";
          this.name_top = "25px";
          this.sector_left = "10px";
          this.sector_top = "20px";
          this.industry_left = "10px";
          this.industry_top = "25px";

          this.doSort(op, "asc");           

        });
      }
    }else if(op == "industry"){
      if(this.industry_asc == true || (this.industry_asc == false && this.industry_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = false;
          this.symbol_desc = false;
          this.exchange_asc = false;
          this.exchange_desc = false;
          this.name_asc = false;
          this.name_desc = false;
          this.sector_asc = false;
          this.sector_desc = false;
          this.industry_asc = false;
          this.industry_desc = true;

          this.symbol_left = "15px";
          this.symbol_top = "25px";
          this.exchange_left = "20px";
          this.exchange_top = "25px";
          this.name_left = "10px";
          this.name_top = "25px";
          this.sector_left = "10px";
          this.sector_top = "25px";
          this.industry_left = "10px";
          this.industry_top = "20px";

          this.doSort(op, "desc");           

        });
      }else if(this.industry_desc == true || (this.industry_asc == false && this.industry_desc == false)){
        this.ngZone.run(()=>{
          this.symbol_asc = false;
          this.symbol_desc = false;
          this.exchange_asc = false;
          this.exchange_desc = false;
          this.name_asc = false;
          this.name_desc = false;
          this.sector_asc = false;
          this.sector_desc = false;
          this.industry_asc = true;
          this.industry_desc = false;

          this.symbol_left = "15px";
          this.symbol_top = "25px";
          this.exchange_left = "20px";
          this.exchange_top = "25px";
          this.name_left = "10px";
          this.name_top = "25px";
          this.sector_left = "10px";
          this.sector_top = "25px";
          this.industry_left = "10px";
          this.industry_top = "20px";

          this.doSort(op, "asc");           

        });
      }
    }
  }

  doSort(column : string, order : string){
    this.ngZone.run(()=>{
      this.companyList = _.orderBy(this.companyList, [column], [order]);
    });
  }
}
