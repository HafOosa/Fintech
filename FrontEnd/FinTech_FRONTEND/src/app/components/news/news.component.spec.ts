import { NewsComponent} from '@components/news/news.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('NewsComponent', () => {
  let component: NewsComponent
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
