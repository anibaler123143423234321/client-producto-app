import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserResponse } from '@app/store/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  @Input() user ! : UserResponse | null;
  @Input() isAuthorized! : boolean | null;
  @Output() signOut = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }
  onMenuToggleDispatch(): void{
      this.menuToggle.emit();
  }

  onSignOut(): void {
    this.signOut.emit()
  }

}
