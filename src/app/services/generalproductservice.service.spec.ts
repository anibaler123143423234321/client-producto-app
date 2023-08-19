import { TestBed } from '@angular/core/testing';

import { GeneralproductserviceService } from './generalproductservice.service';

describe('GeneralproductserviceService', () => {
  let service: GeneralproductserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralproductserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
