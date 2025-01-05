import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAnalyseComponent } from './user-analyse.component';

describe('UserAnalyseComponent', () => {
  let component: UserAnalyseComponent;
  let fixture: ComponentFixture<UserAnalyseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAnalyseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
