import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebServiceService {

  readonly ROOT_URL: String;

  constructor(private http: HttpClient) { 
    this.ROOT_URL = 'https://resturant-chooser.herokuapp.com/';
  }

  get(uri: string){
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }

  getWithPayload(uri: string, payload: string){
    return this.http.get(`${this.ROOT_URL}/${uri}`,{params:  {email: payload}, responseType: 'json'});
  }

  post(uri: string, payload: Object){
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload, {responseType:'text'});
  }

  delete(uri: string){
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }
}
