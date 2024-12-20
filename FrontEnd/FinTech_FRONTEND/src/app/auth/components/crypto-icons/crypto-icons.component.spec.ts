import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoIconsComponent } from './crypto-icons.component';

describe('CryptoIconsComponent', () => {
  let component: CryptoIconsComponent;
  let fixture: ComponentFixture<CryptoIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoIconsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
