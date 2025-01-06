import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoConverterComponent } from './crypto-converter.component';

describe('CryptoConverterComponent', () => {
  let component: CryptoConverterComponent;
  let fixture: ComponentFixture<CryptoConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoConverterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
