import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "@app/services";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { environment } from "@src/environments/environment";
import { Observable, of } from "rxjs";
import { catchError, switchMap, tap, map } from "rxjs/operators";
import * as fromActions from './user.actions';
import { UserResponse } from "./user.models";



type Action = fromActions.All;

@Injectable()
export class UserEffects {

  constructor(
    private actions: Actions,
    private router: Router,
    private httpClient: HttpClient,
    private notification: NotificationService
  ) { }

  signUpEmail: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SIGN_UP_EMAIL),
      map((action: fromActions.SignUpEmail) => action.user),
      switchMap(userData =>
        this.httpClient.post<UserResponse>(`${environment.url}api/authentication/sign-up`, userData)
          .pipe(
            tap((response: UserResponse) => {
              localStorage.setItem('token', response.token);
              this.router.navigate(['/']);
            }),
            map((response: UserResponse) => new fromActions.SignUpEmailSuccess(response.email, response || null)),
            //catchError(err => of(new fromActions.SignUpEmailError(err.message)))

            catchError(err => {

              this.notification.error("Errores al registrar nuevo usuario");
              return of(new fromActions.SignUpEmailError(err.message))

            })


          )
      )
    )
  );


  signInEmail: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SIGIN_IN_EMAIL),
      map((action: fromActions.SignInEmail) => action.credentials),
      switchMap(credentials =>
        this.httpClient.post<UserResponse>(`${environment.url}api/authentication/sign-in`, credentials)
          .pipe(
            tap((response: UserResponse) => {
              localStorage.setItem('token', response.token);
              this.router.navigate(['/']);
            }),
            map((response: UserResponse) => new fromActions.SignInEmailSuccess(response.email, response || null)),
            //catchError(err => of(new fromActions.SignInEmailError(err.message)))
            catchError(err => {

              this.notification.error("Credenciales incorrectas");
              return of(new fromActions.SignInEmailError(err.message))

            })

          )
      )
    )
  );


  init: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.INIT),
      switchMap(async () => localStorage.getItem('token')),
      switchMap(token => {

        if (token) {
          return this.httpClient.get<UserResponse>(`${environment.url}api/user`)
            .pipe(
              tap((user: UserResponse) => {
                console.log('data del usuario en sesion que viene del servidor=>', user);
              }),
              map((user: UserResponse) => new fromActions.InitAuthorized(user.email, user || null)),
              catchError(err => of(new fromActions.InitError(err.message)))
            )
        } else {
          return of(new fromActions.InitUnauthorized());
        }
      }
      )
    )
  );



}
