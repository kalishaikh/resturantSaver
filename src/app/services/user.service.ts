import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators'
import { WebServiceService } from './web-service.service';
import { Router } from '@angular/router';
import { constants } from 'src/assets/constants/constants';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private webService : WebServiceService, private router: Router) { }

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded(){
    return this._refreshNeeded$;
  }

  registerUser(email: string, password: string, name: string){
    return this.webService.post('register', { email, password, name })
    .pipe(
      tap(res => {
        if(this.isLoggedOut() && res != constants.USER_ALREADY_EXISTS){
          this.setSession(res);
          this.router.navigate(['home']);
        }
      })
    )
  }

  getAllUsers(){
    return this.webService.get('find');
  }

  getUser(){
    return this.webService.get('findOne');
  }

  getResturants(email: string){
    const param = new HttpParams();
    param.set(email, localStorage.getItem('email')!);
    return this.webService.getWithPayload('getResturants',email);
  }

  updateResturants(resturantName: string, resturantAddress: string, email: string){
    console.log("Called from user.service");
    return this.webService.post('addResturants', {resturantName, resturantAddress, email})
    .pipe(
      tap(response =>{
        console.log(response);
        this._refreshNeeded$.next();
      })
    );
  }

  deleteResturant(email: string, address: string){
    return this.webService.post('delete', {email, address})
    .pipe(
      tap(response =>{
        this._refreshNeeded$.next();
      })
    );
  }

  authenticateUser(email: string, password: string){
    return this.webService.post('login', { email, password })
    .pipe(
      tap(res => {
        if(res == constants.USER_DOES_NOT_EXIST){
          console.log("User does not exist in database");
        }
        else if (res == constants.INVALID_PASSWORD){ 
          console.log("Wrong password please try again");
        }
        else{
          this.setSession(res);
          this.router.navigate(['home']);
        }
      })
    )
  }

  logout(){
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  private setSession(authResult: any){
    const response = JSON.parse(authResult);
    const expiresAt = moment().add(authResult.expiresIn,'second');
    localStorage.setItem('id_token', response.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("name", response.name);
    localStorage.setItem("email", response.email);
  }

  public isLoggedIn(){
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
}

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse((expiration) || '{}');
    return moment(expiresAt);
  }    
}
