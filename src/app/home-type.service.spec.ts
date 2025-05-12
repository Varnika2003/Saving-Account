import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; 
import { HomeTypeService } from './home-type.service';

describe('HomeTypeService', () => {
  let service: HomeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], 
    });
    service = TestBed.inject(HomeTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
