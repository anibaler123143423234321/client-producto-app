import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {NotificationService} from '@app/services';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from './store';
import * as fromUser from './store/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  showSpinner = false;
  title = 'client-inmueble-app';

  user$! : Observable<fromUser.UserResponse>;
  isAuthorized$!: Observable<boolean>;

  constructor(private fs: AngularFirestore,
    private notification: NotificationService,
    private store: Store<fromRoot.State>,
    private router: Router
    ){}

  ngOnInit(){

    this.user$ = this.store.pipe(select(fromUser.getUser)) as Observable<fromUser.UserResponse>;
    this.isAuthorized$ = this.store.pipe(select(fromUser.getIsAuthorized)) as Observable<boolean>;

    this.store.dispatch(new fromUser.Init());

  }

  onToggleSpinner() : void {
    this.showSpinner = !this.showSpinner;
  }

  onFilesChanged(urls: string | string[]) : void {
    console.log(urls);
  }

  onSuccess() : void {
    this.notification.success("El procedimiento fue exitoso");
  }

  onError() : void {
    this.notification.error("Se encontraron errores en el proceso");
  }

  onSignOut() : void {
    localStorage.removeItem('token');
    this.store.dispatch(new fromUser.SignOut());
    this.router.navigate(['/auth/login']);
  }

}
