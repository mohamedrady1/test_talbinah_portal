import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPsychologicalSocietyInformationCardComponent } from './my-psychological-society-information-card.component';

describe('MyPsychologicalSocietyInformationCardComponent', () => {
  let component: MyPsychologicalSocietyInformationCardComponent;
  let fixture: ComponentFixture<MyPsychologicalSocietyInformationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPsychologicalSocietyInformationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPsychologicalSocietyInformationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
