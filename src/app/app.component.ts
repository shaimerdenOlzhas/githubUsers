import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GithubApiService } from './api/github-api.service';
import { debounceTime, distinctUntilChanged, map, Observable, Subject, switchAll, switchMap } from 'rxjs';
import { User } from './api/models/user.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private githubApi: GithubApiService, private cd: ChangeDetectorRef) {}

  searchForm: FormGroup = new FormGroup({
    search: new FormControl('', Validators.required),
    repos: new FormControl(0),
    followers: new FormControl(0),
    created: new FormControl(''),
  })

  private searchUser = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  users$: Observable<User[]>;

  ngOnInit() {
    this.searchForm.valueChanges.subscribe(value => this.searchUsers())
    this.users$ = this.searchUser.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(() => this.githubApi.getUsers(
        this.searchForm.get('search')?.value,
        this.searchForm.get('repos')?.value,
        this.searchForm.get('followers')?.value,
        this.searchForm.get('created')?.value,
      ).pipe(map(data => data.items)))
    )
  }

  searchUsers() {
    if (this.searchForm.valid) {
      this.searchUser.next(this.searchForm.value);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
