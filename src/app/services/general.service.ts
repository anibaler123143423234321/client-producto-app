import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromUser from '@app/store/user';
import { UserResponse } from '@app/store/user';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {


  usuario$! : UserResponse | null;

  constructor() { }



}
