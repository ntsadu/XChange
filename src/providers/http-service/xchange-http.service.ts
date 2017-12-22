import { Http, Headers, RequestOptions } from "@angular/http";

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

import { Observable } from "rxjs/Observable";
import { xchange_endpoints } from '../../constants/endpoints';

const API_HOST  = " http://localhost:3000";

export class HttpService {

// headers: RequestOptions = new RequestOptions({ headers: new Headers({ "Content-Type": "application/x-www-form-urlencoded"})});
headers: RequestOptions = new RequestOptions({ headers: new Headers({ "Content-Type": "text/plain"})});

constructor(protected http: Http) {
}

public GetAllUsers() {
    return this.post(xchange_endpoints.user);
}

public GetAllUserSubscriptions() {
    return this.post(xchange_endpoints.usersubscriptions);
}
public GetAllUserFavorites() {
    return this.post(xchange_endpoints.userfavorites);
}

public GetAllCompanies() {
    return this.post(xchange_endpoints.company);
}

private post(where: string, what?: {}): Observable<any> {
    return this.http
               .get(API_HOST + where,
                     this.headers)
               .timeout(3000)
               .map(res => {return res.json()});

}

}