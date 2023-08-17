import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import * as fromList from '../../store/save';
import { CompraResponse } from '../../store/save';
import * as fromRoot from '@app/store';

@Component({
  selector: 'app-compra-list',
  templateUrl: './compra-list.component.html',
  styleUrls: ['./compra-list.component.scss'],
})
export class CompraListComponent implements OnInit {
  compras$ ! : Observable<CompraResponse[] | null>
  loading$ ! : Observable<boolean | null>
  comprasLength: number | undefined;

  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private store: Store<fromRoot.State>
  ) { }


  ngOnInit(): void {
    this.store.dispatch(new fromList.Read());
    this.loading$ = this.store.pipe(select(fromList.getLoading));
    this.compras$ = this.store.pipe(select(fromList.getCompras));
    this.compras$.subscribe(compras => {
      console.log("Compras:",compras)
      this.comprasLength = compras?.length;
    });
  }

  get paginatedCompras$(): Observable<CompraResponse[] | null> {
    return this.compras$.pipe(
      map(compras => {
        // console.log("Compras:",compras)
        if (!compras) {
          return null;
        }
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return compras.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }

  changePage(step: number): void {
    this.currentPage += step;
  }
}
