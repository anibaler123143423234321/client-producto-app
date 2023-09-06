import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoListComponent } from './negocio-list.component';

describe('ProductoListComponent', () => {
  let component: ProductoListComponent;
  let fixture: ComponentFixture<ProductoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductoListComponent]
    });
    fixture = TestBed.createComponent(ProductoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
