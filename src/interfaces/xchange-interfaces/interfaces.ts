
export interface User {
    userID : number;
    firstname : string;
    lastname : string;
    email : string;
    username : string;
    password : string;
}

export interface UserSubscription {
    userID : number;
    subscribingUserID : number;
}

export interface UserFavorite {
    userID : number;
    companyID : number;
}

export interface Company {
    companyID : number;
    exchange : string;
    symbol : string;
    name : string;
    sector : string;
    industry : string;
}