import { Component, OnInit } from '@angular/core';
import { LoginService } from 'app/login.service';
import { User } from 'interfaces/xchange-interfaces/interfaces';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  user: User = this.loginService.subscribers.getValue();

  constructor(private loginService: LoginService) { 
    
  }

  

  ngOnInit() {
    this.user = this.loginService.subscribers.getValue();
  }

}
