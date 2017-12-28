import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { XChangeController } from '../../providers/ers-controller/xchange-controller';
import { Company } from '../../interfaces/xchange-interfaces/interfaces';
import * as _ from 'lodash';


export interface ModalContext {
  symbol:string;
  name:string;
  dataString:string;
}

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {

  @ViewChild('modalTemplate')
  public modalTemplate:ModalTemplate<ModalContext, string, string>

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

  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  constructor(public xchangeApp : XChangeController, public ngZone : NgZone, public modalService: SuiModalService) { 
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

  public openModal(company : any) {
    const config = new TemplateModalConfig<ModalContext, string, string>(this.modalTemplate);

    config.closeResult = "closed!";
    // config.transition = "fade up";
    config.context = { symbol: company.symbol, name: company.name, dataString: JSON.stringify(company)};

    this.modalService
        .open(config)
        .onApprove(result => { /* approve callback */ })
        .onDeny(result => { /* deny callback */});
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

  alert(a : any){
    console.log(a);
  }

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}
