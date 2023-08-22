import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraFinalComponent } from './compra-final.component';

describe('CompraFinalComponent', () => {
  let component: CompraFinalComponent;
  let fixture: ComponentFixture<CompraFinalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraFinalComponent]
    });
    fixture = TestBed.createComponent(CompraFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
