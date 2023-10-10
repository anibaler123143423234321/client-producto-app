import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as fromActions from '@app/pages/compra/store/save/save.actions'; // Asegúrate de que esto esté importado correctamente
import { CompraCreateRequest, CompraResponse } from './save.models';
import { environment } from 'environments/environment';

type Action = fromActions.All;

@Injectable()
export class SaveEffectsCompra {

  constructor(
    private actions: Actions,
    private httpClient: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) { }


  read: Observable<any> = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.Types.READ),
    switchMap(() =>
      this.httpClient.get<CompraResponse[]>(`${environment.url}gateway/compra`)
        .pipe(
          delay(1000),
          map((compras: CompraResponse[]) => new fromActions.ReadSuccess(compras)),
          catchError(err => of(new fromActions.ReadError(err.message)))
        )
    )
  )
);

  create: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.CREATE),
      map((action: fromActions.Create) => action.compra),
      switchMap((request: CompraCreateRequest) =>
        this.httpClient.post<CompraResponse>(`${environment.url}gateway/compra`, request)
          .pipe(
            delay(1000),
            tap(() => {
              this.router.navigate(['compra/listCompra']);
            }),
            map((compra: CompraResponse) => new fromActions.CreateSuccess(compra)),
            catchError(err => {
              this.notification.error(`Errores guardando la compra: ${err.message}`);
              return of(new fromActions.CreateError(err.message));
            })
          )
      )
    )
  );

  fetchCompra: Observable<Action> = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.Types.FETCH_COMPRA),
    switchMap((action: fromActions.FetchCompra) =>
      this.httpClient.get<CompraResponse>(`${environment.url}gateway/compra/${action.compraId}`)
        .pipe(
          map((compra: CompraResponse) => new fromActions.FetchCompraSuccess(compra)),
          catchError(err => of(new fromActions.FetchCompraError(err.message)))
        )
    )
  )
);


readAll: Observable<Action> = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.Types.READ_ALL),
    switchMap(() =>
      this.httpClient.get<CompraResponse[]>(`${environment.url}gateway/compra/all`)
        .pipe(
          delay(1000),
          map((compras: CompraResponse[]) => new fromActions.ReadSuccess(compras)),
          catchError(err => of(new fromActions.ReadError(err.message)))
        )
    )
  )
);

}
