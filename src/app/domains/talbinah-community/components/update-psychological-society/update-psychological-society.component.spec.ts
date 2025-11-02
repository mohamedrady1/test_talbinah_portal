import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePsychologicalSocietyComponent } from './update-psychological-society.component';

describe('UpdatePsychologicalSocietyComponent', () => {
  let component: UpdatePsychologicalSocietyComponent;
  let fixture: ComponentFixture<UpdatePsychologicalSocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePsychologicalSocietyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePsychologicalSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
