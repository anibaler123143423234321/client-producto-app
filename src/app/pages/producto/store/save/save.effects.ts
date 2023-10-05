import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as fromActions from './save.actions';
import { ProductoCreateRequest, ProductoResponse } from './save.models';
import { environment } from 'environments/environment';

type Action = fromActions.All;

@Injectable()
export class SaveEffectsProducto {

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
          this.httpClient.get<ProductoResponse[]>(`${environment.url}gateway/producto`)
          .pipe(
            delay(1000),
            map((productos: ProductoResponse[]) => new fromActions.ReadSuccess(productos) ),
            catchError(err => of(new fromActions.ReadError(err.message)))
          )
        )
      )
  );


  create: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.CREATE),
      map((action: fromActions.Create) => action.producto),
      switchMap((request: ProductoCreateRequest) =>
        this.httpClient.post<ProductoResponse>(`${environment.url}gateway/producto`, request)
          .pipe(
            delay(1000),
            tap((response: ProductoResponse) => {
              this.router.navigate(['producto/list']);
            }),
            map((producto: ProductoResponse) => new fromActions.CreateSuccess(producto)),
            catchError(err => {
              this.notification.error(`Errores guardando el producto: ${err.message}`);
              return of(new fromActions.CreateError(err.message));
            })
          )
      )
    )
  );

  fetchProduct: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.FETCH_PRODUCT),
      switchMap((action: fromActions.FetchProduct) =>
        this.httpClient.get<ProductoResponse>(`${environment.url}gateway/producto/${action.productId}`)
          .pipe(
            map((product: ProductoResponse) => new fromActions.FetchProductSuccess(product)),
            catchError(err => of(new fromActions.FetchProductError(err.message)))
          )
      )
    )
  );


  update: Observable<Action> = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.Types.UPDATE_PRODUCT),
    switchMap((action: fromActions.Update) => {
      const { productoId, nuevoProducto } = action.payload;
      return this.httpClient.put<ProductoResponse>(
        `${environment.url}gateway/producto/${productoId}`,
        nuevoProducto
      ).pipe(
        map((producto: ProductoResponse) => new fromActions.UpdateSuccess(producto)),
        catchError((error) => of(new fromActions.UpdateError(error.message)))
      );
    })
  )
);

}
