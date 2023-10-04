import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import * as fromActions from './save.actions';
import { CategoriaCreateRequest, CategoriaResponse } from './save.models';
import { environment } from 'environments/environment';

type Action = fromActions.All;

@Injectable()
export class SaveEffectsCategoria {

  constructor(
    private actions: Actions,
    private httpClient: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) { }

  create: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.CREATE),
      map((action: fromActions.Create) => action.categoria),
      switchMap((request: CategoriaCreateRequest) =>
        this.httpClient.post<CategoriaResponse>(`${environment.url}gateway/categoria`, request)
          .pipe(
            delay(1000),
            tap((response: CategoriaResponse) => {
              this.router.navigate(['categoria/list']); // Change the route as needed
            }),
            map((categoria: CategoriaResponse) => new fromActions.CreateSuccess(categoria)),
            catchError(err => {
              this.notification.error(`Error al guardar la categoría: ${err.message}`);
              return of(new fromActions.CreateError(err.message));
            })
          )
      )
    )
  );


}
