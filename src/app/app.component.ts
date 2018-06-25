import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { interval } from 'rxjs/observable/interval';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { filter, scan, reduce, mergeMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public githubApiUrl = 'https://api.github.com';
  public values: any[] = [1, 2, 3];

  @ViewChild('event')
  public eventButton: ElementRef;

  @ViewChild('renderer')
  public rendererButton: ElementRef;

  constructor(private _renderer: Renderer2, private _http: HttpClient) {
  }

  public ngOnInit() {
    fromEvent(this.eventButton.nativeElement, 'click')
    .subscribe(val => this.values.push('event'));

    this._renderer.listen(this.rendererButton.nativeElement, 'click', () => { this.values.push('renderer'); });
  }

  public of() {
    of('of', 'of', 'of').subscribe(val => this.values.push(val));
  }

  public from() {
    // from(['from', 'from', 'from']).subscribe(val => this.values.push(val));
    from(['from', 'from', 'from'])
    .pipe(
      reduce((acc, val) => acc + ' - ' + val, ''),
    )
    .subscribe(val => this.values.push(val));
  }

  public fromPromise() {
    fromPromise(Promise.resolve('promise')).subscribe(val => this.values.push(val));
  }

  public fromPromiseAll() {
    fromPromise(Promise.all(['promise', 'all'])).subscribe(val => this.values.push(val));
  }

  public interval() {
    // interval().subscribe(val => this.values.push(val));
    // interval(1000).subscribe(val => this.values.push(val));
    // interval(1000)
    // .pipe(
    //   filter(val => val % 2 === 0)
    // ).subscribe(val => this.values.push(val));
    interval(1000)
    .pipe(
      filter(val => val % 2 === 0),
      scan(v => v + 1, 0),
    ).subscribe(val => this.values.push(val));
  }

  public github() {
    // this._http.get(this.githubApiUrl + '/users/Gayout').subscribe((val: any) => this.values.push(val.login + "'s id :" + val.id ));
    this._http.get(this.githubApiUrl + '/users/Gayout')
    .pipe(
      // mergeMap((val: any) => this._http.get(val.repos_url)),
      // switchMap((val: any) => this._http.get(val.repos_url)),
      // mergeMap((values: any) => forkJoin(values.map(v => this._http.get(v.commits_url.slice(0, -6))))),
    )
    .subscribe((values: any) => {
      this.values.push(values.login + ' id :' + values.id);
      // this.values.push.apply(this.values, values.map(v => v.name));
      // this.values.push.apply(this.values, values.map(v => v.map(a => a.sha).join(' - ')));
    });
  }
}
