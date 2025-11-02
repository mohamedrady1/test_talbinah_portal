import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPsychologicalSocietyPostComponent } from './view-psychological-society-post.component';

describe('ViewPsychologicalSocietyPostComponent', () => {
  let component: ViewPsychologicalSocietyPostComponent;
  let fixture: ComponentFixture<ViewPsychologicalSocietyPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPsychologicalSocietyPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPsychologicalSocietyPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
