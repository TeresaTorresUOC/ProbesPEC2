import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AppState } from './app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'blog-uoc-project-front';
  globalLoading = false;

  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const loading$ = this.store.select((state) => state.auth.loading);
    const loaded$ = this.store.select((state) => state.auth.loaded);

    combineLatest([loading$, loaded$])
      .pipe(
        map(([loading, loaded]) => loading && !loaded),
        takeUntil(this.destroy$)
      )
      .subscribe((isLoading) => {
        this.globalLoading = isLoading;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
