import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPsychologicalSocietyComponent } from './my-psychological-society.component';

describe('MyPsychologicalSocietyComponent', () => {
  let component: MyPsychologicalSocietyComponent;
  let fixture: ComponentFixture<MyPsychologicalSocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPsychologicalSocietyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPsychologicalSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
