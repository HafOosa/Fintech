import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOverveiwComponent } from './admin-overveiw.component';

describe('AdminOverveiwComponent', () => {
  let component: AdminOverveiwComponent;
  let fixture: ComponentFixture<AdminOverveiwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOverveiwComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOverveiwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
