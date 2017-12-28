import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'interfaces/xchange-interfaces/interfaces';


//const AWS_URL: string = "xchangedb.c2kh4xehvs7x.us-west-2.rds.amazonaws.com";
const API_URL: string = "http://localhost:8091/";


@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

/**************** need login url mapping at backend here******************* */

  login(username: String, password: String){
    this.http.post<User>(API_URL + "users/login", {
      username: username,
      password: password
    })
      .subscribe(users => {
        if(users == null) {
          alert("Incorrect username or password.")
        }
        console.log("log in success");
        localStorage.setItem("user", JSON.stringify({
          userId: users.userId,
          firstname: users.firstname,
          lastname: users.lastname,
          email: users.username,
          username: users.username,
          password: users.password
        }));
      },
      err => {
        console.log("error");
      }
    )
  }

  register(user: User){
    this.http.post(API_URL + "users/AddNewUser", {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      username: user.username,
      password: user.password
    })
      .subscribe(data => {
        console.log("register success");
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

}