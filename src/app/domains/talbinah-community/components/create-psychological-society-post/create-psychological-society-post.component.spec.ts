import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePsychologicalSocietyPostComponent } from './create-psychological-society-post.component';

describe('CreatePsychologicalSocietyPostComponent', () => {
  let component: CreatePsychologicalSocietyPostComponent;
  let fixture: ComponentFixture<CreatePsychologicalSocietyPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePsychologicalSocietyPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePsychologicalSocietyPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
