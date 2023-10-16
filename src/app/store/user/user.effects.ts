import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { environment } from '@src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import * as fromActions from './user.actions';
import { UserResponse } from './user.models';
import { GeneralService } from '@app/services/general.service';

type Action = fromActions.All;

@Injectable()
export class UserEffects {
  constructor(
    private actions: Actions,
    private router: Router,
    private httpClient: HttpClient,
    private notification: NotificationService,
    public GeneralService: GeneralService,
  ) {}

  signUpEmail: Observable<Action> = createEffect(() =>

    this.actions.pipe(
      ofType(fromActions.Types.SIGN_UP_EMAIL),
      map((action: fromActions.SignUpEmail) => action.user),
      switchMap((userData) =>
        // console.log('User:',userData);

        this.httpClient
          .post<UserResponse>(
            `${environment.url}api/authentication/sign-up`,
            userData
          )
          .pipe(
            tap((response: UserResponse) => {
              localStorage.setItem('token', response.token);

              this.router.navigate(['/']);
            }),
            map(
              (response: UserResponse) =>
                new fromActions.SignUpEmailSuccess(
                  response.email,
                  response || null
                )
            ),
            //catchError(err => of(new fromActions.SignUpEmailError(err.message)))

            catchError((err) => {
              this.notification.error('Errores al registrar nuevo usuario');
              return of(new fromActions.SignUpEmailError(err.message));
            })
          )
      )
    )
  );

  signInEmail: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SIGIN_IN_EMAIL),
      map((action: fromActions.SignInEmail) => action.credentials),
      switchMap((credentials) =>
        this.httpClient
          .post<UserResponse>(
            `${environment.url}api/authentication/sign-in`,
            credentials
          )
          .pipe(
            tap((response: UserResponse) => {
              localStorage.setItem('token', response.token);
              this.router.navigate(['/']);
            }),
            map(
              (response: UserResponse) =>
                new fromActions.SignInEmailSuccess(
                  response.email,
                  response || null
                )
            ),
            //catchError(err => of(new fromActions.SignInEmailError(err.message)))
            catchError((err) => {
              this.notification.error('Credenciales incorrectas');
              return of(new fromActions.SignInEmailError(err.message));
            })
          )
      )
    )
  );
  init: Observable<Action> = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.Types.INIT),
    switchMap(async () => localStorage.getItem('token')),
    switchMap((token) => {
      if (token) {
        return this.httpClient
          .get<UserResponse>(`${environment.url}api/user`)
          .pipe(
            tap((user: UserResponse) => {
              // Guardar el usuario en localStorage
              localStorage.setItem('user', JSON.stringify(user));

              // Asignar el usuario a GeneralService.usuario$
              this.GeneralService.usuario$ = user;
              console.log(
                'data del usuario en sesion que viene del servidor=>',
                // user
                this.GeneralService.usuario$
              );
            }),
            map(
              (user: UserResponse) =>
                new fromActions.InitAuthorized(user.email, user || null)
            ),
            catchError((err) => of(new fromActions.InitError(err.message)))
          );
      } else {
        return of(new fromActions.InitUnauthorized());
      }
    })
  )
);

  // ... otros efectos

  fetchUser: Observable<Action> = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.Types.FETCH_USER),
    switchMap((action: fromActions.FetchUser) =>
      this.httpClient.get<UserResponse>(`${environment.url}gateway/user/${action.userId}`)
        .pipe(
          map((user: UserResponse) => new fromActions.FetchUserSuccess(user)),
          catchError(err => of(new fromActions.FetchUserError(err.message)))
        )
    )
  )
);


listUsers = createEffect(() =>
this.actions.pipe(
  ofType(fromActions.Types.LIST_USERS),
  switchMap(() =>
    this.httpClient.get<UserResponse[]>(`${environment.url}api/user/listar`).pipe(
      map((users: UserResponse[]) => new fromActions.ListUsersSuccess(users)),
      catchError((error) => of(new fromActions.ListUsersError(error.message)))
    )
  )
)
);


changeUserRole = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.changeUserRole),
    switchMap((action) => {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage

      // Asegurarse de que haya un token
      if (!token) {
        return of(fromActions.changeUserRoleFailure({ error: 'No se encontró el token de autenticación.' }));
      }

      // Configurar los encabezados de la solicitud con el token Bearer
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Realizar la solicitud HTTP
      return this.httpClient.put<UserResponse>(
        `${environment.url}api/user/change/${action.newRole}`,
        {},
        { headers }
      ).pipe(
        map(() => fromActions.changeUserRoleSuccess()),
        catchError((error) => of(fromActions.changeUserRoleFailure({ error: error.message })))
      );
    })
  )
);




}
