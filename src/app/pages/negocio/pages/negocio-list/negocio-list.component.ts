import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromList from '../../store/save'; // Ajusta la ruta a tus archivos NgRx
import { NegocioResponse } from '../../store/save'; // Asegúrate de que el tipo sea correcto
import { NegocioService } from '@app/services/NegocioService';
import * as fromUser from '@app/store/user';

@Component({
  selector: 'app-negocio-list',
  templateUrl: './negocio-list.component.html',
  styleUrls: ['./negocio-list.component.scss'],
})

export class NegocioListComponent implements OnInit {

  negocios$!: Observable<NegocioResponse[] | null>; // Asegúrate de que el tipo sea correcto
  user$!: Observable<fromUser.UserResponse>;
  isAuthorized$!: Observable<boolean>;

  constructor(private store: Store<fromList.ListState>,
    private negocioService: NegocioService) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(fromUser.getUser)) as Observable<fromUser.UserResponse>;
    this.isAuthorized$ = this.store.pipe(select(fromUser.getIsAuthorized)) as Observable<boolean>;
    this.store.dispatch(new fromList.Read());
    this.negocios$ = this.store.pipe(select(fromList.getNegocios));

    this.negocios$.subscribe(negocios => {
      if (negocios !== null) {
        this.negocioService.setNegocios(negocios);
        console.log('Negocios:', negocios);
      } else {
        console.log('Negocios is null');
      }
    });

  }
}
