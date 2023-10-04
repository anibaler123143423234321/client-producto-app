import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaNuevoComponent } from './categoria-nuevo.component';

describe('CategoriaNuevoComponent', () => {
  let component: CategoriaNuevoComponent;
  let fixture: ComponentFixture<CategoriaNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriaNuevoComponent]
    });
    fixture = TestBed.createComponent(CategoriaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
