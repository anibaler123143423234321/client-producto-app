import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CompraResponse } from '../../store/save';
import * as fromList from '../../store/save';

@Component({
  selector: 'app-compra-list',
  templateUrl: './compra-list.component.html',
  styleUrls: ['./compra-list.component.scss']
})
export class CompraListComponent implements OnInit {

  compras$ !: Observable<CompraResponse[] | null>;

  constructor(private store: Store<fromList.ListState>) {}

  ngOnInit(): void {
    // Despacha la acción para leer las compras al iniciar el componente
    this.store.dispatch(new fromList.Read());

    // Conecta el observable de compras del estado a la variable del componente
    this.compras$ = this.store.pipe(select(fromList.getCompras));
  }

  // ... otras funciones como filtro y paginación

}
