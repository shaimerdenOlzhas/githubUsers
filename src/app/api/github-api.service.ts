import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {

  constructor(private http: HttpClient) {}

  apiURL = 'https://api.github.com/search/users?q=';

  getUsers(user: string, repos: number, followers: any, created: any): Observable<any> {
    return this.http.get(
      `${this.apiURL + user}`+
      (repos ? `+repos:${repos}` : '')+
      (followers ? `+followers:${followers}` : '')+
      (created ? `+created:${created}` : ''))
  }
}
