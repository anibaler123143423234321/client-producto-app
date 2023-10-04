import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaListComponent } from './categoria-list.component';

describe('CategoriaListComponent', () => {
  let component: CategoriaListComponent;
  let fixture: ComponentFixture<CategoriaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriaListComponent]
    });
    fixture = TestBed.createComponent(CategoriaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
