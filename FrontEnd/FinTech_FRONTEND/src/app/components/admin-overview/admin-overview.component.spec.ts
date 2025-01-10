import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOverviewComponent } from './admin-overview.component';

describe('AdminOverveiwComponent', () => {
  let component: AdminOverviewComponent;
  let fixture: ComponentFixture<AdminOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
