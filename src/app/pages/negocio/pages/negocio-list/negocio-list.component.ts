import { Component, OnInit } from '@angular/core';
import * as fromRoot from '@app/store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromList from '../../store/save';
import { NegocioResponse } from '../../store/save';
import { map } from 'rxjs/operators';
import { UserResponse } from '@app/store/user';
import { GeneralService } from '@app/services/general.service';
import { CompraCreateRequest } from '@app/pages/compra/store/save';
import { Router } from '@angular/router';
import { CarritoService } from '@app/services/CarritoService';

@Component({
  selector: 'app-negocio-list',
  templateUrl: './negocio-list.component.html',
  styleUrls: ['./negocio-list.component.scss'],
})
export class NegocioListComponent  {

}
