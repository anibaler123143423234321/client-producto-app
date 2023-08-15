import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoNuevoComponent } from './producto-nuevo.component';

describe('ProductoNuevoComponent', () => {
  let component: ProductoNuevoComponent;
  let fixture: ComponentFixture<ProductoNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductoNuevoComponent]
    });
    fixture = TestBed.createComponent(ProductoNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
