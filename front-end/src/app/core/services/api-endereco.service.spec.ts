import { TestBed } from '@angular/core/testing';

import { ApiEnderecoService } from './api-endereco.service';

describe('ApiEnderecoService', () => {
  let service: ApiEnderecoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiEnderecoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
