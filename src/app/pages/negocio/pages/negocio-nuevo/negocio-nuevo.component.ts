import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromRoot from '@app/store';
import * as fromList from '../../store/save';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-negocio-nuevo',
  templateUrl: './negocio-nuevo.component.html',
  styleUrls: ['./negocio-nuevo.component.scss']
})
export class NegocioNuevoComponent   {

}
