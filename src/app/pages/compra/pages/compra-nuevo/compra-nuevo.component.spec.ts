import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraNuevoComponent } from './compra-nuevo.component';

describe('CompraNuevoComponent', () => {
  let component: CompraNuevoComponent;
  let fixture: ComponentFixture<CompraNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraNuevoComponent]
    });
    fixture = TestBed.createComponent(CompraNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
