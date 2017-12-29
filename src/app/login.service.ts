import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'interfaces/xchange-interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';


//const AWS_URL: string = "xchangedb.c2kh4xehvs7x.us-west-2.rds.amazonaws.com";
const API_URL: string = "http://localhost:8091/";


@Injectable()
export class LoginService {

  subscribers: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  // if user exists, take the object from the local storage and put that
  // in the behaviorSubject object
  constructor(private http: HttpClient) {
    var u = localStorage.getItem("user");
    console.log(u);
    if(u) this.subscribers.next(JSON.parse(u));
  }

/**************** need login url mapping at backend here******************* */

  login(username: String, password: String){
    this.http.post<User>(API_URL + "users/login", {
      username: username,
      password: password
    })
      .subscribe(users => {
        console.log("log in success");
        this.subscribers.next(users);
        localStorage.setItem("user", JSON.stringify(users));
      },
      err => {
        console.log("error");
      }
    )
  }

  subscribeToLogin(f: (value: User)=>void){
    this.subscribers.subscribe(f);
  }

  register(user: User){
    this.http.post(API_URL + "users/AddNewUser", user)
      .subscribe(data => {
        console.log("register success");
        if(data == null) {
          alert("user/email already exists");
        }
      });
  }

  validateUsername(username: String) {
    this.http.post(API_URL + "users/GetUserByUsername", {
      username: username
    })
      .subscribe(data => {
        console.log("inside validate username");
      })
  }

  validateEmail(email: String) {
    this.http.post(API_URL + "users/GetUserByEmail", {
      email: email
    })
      .subscribe(data => {
        console.log("inside validate email");
      })
  }

  logout() {
    localStorage.removeItem("user");
    this.subscribers.next(null);
    console.log("user logged out");
  }

}