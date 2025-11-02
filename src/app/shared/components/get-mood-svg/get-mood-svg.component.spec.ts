import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMoodSvgComponent } from './get-mood-svg.component';

describe('GetMoodSvgComponent', () => {
  let component: GetMoodSvgComponent;
  let fixture: ComponentFixture<GetMoodSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetMoodSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetMoodSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
