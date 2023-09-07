import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as fromActions from './save.actions';
import { NegocioCreateRequest, NegocioResponse } from './save.models';
import { environment } from 'environments/environment';

type Action = fromActions.All;

@Injectable()
export class SaveEffectsNegocio {

  constructor(
    private actions: Actions,
    private httpClient: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) { }

  read: Observable<Action> = createEffect( () =>
      this.actions.pipe(
        ofType(fromActions.Types.READ),
        switchMap( () =>
          this.httpClient.get<NegocioResponse[]>(`${environment.url}gateway/negocios/`)
          .pipe(
            delay(1000),
            map((negocios: NegocioResponse[]) => new fromActions.ReadSuccess(negocios) ),
            catchError(err => of(new fromActions.ReadError(err.message)))
          )
        )
      )
  );


  create: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.CREATE),
      map((action: fromActions.Create) => action.negocio),
      switchMap((request: NegocioCreateRequest) =>
        this.httpClient.post<NegocioResponse>(`${environment.url}gateway/negocios/`, request)
          .pipe(
            delay(1000),
            tap((response: NegocioResponse) => {
              this.router.navigate(['negocio/list']);
            }),
            map((negocio: NegocioResponse) => new fromActions.CreateSuccess(negocio)),
            catchError(err => {
              this.notification.error(`Errores guardando el negocio: ${err.message}`);
              return of(new fromActions.CreateError(err.message));
            })
          )
      )
    )
  );

  fetchProduct: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.FETCH_NEGOCIO),
      switchMap((action: fromActions.FetchNegocio) =>
        this.httpClient.get<NegocioResponse>(`${environment.url}gateway/negocios/${action.negocioId}`)
          .pipe(
            map((negocio: NegocioResponse) => new fromActions.FetchNegocioSuccess(negocio)),
            catchError(err => of(new fromActions.FetchNegocioError(err.message)))
          )
      )
    )
  );

}
