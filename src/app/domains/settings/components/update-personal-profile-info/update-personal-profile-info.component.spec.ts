import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePersonalProfileInfoComponent } from './update-personal-profile-info.component';

describe('UpdatePersonalProfileInfoComponent', () => {
  let component: UpdatePersonalProfileInfoComponent;
  let fixture: ComponentFixture<UpdatePersonalProfileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePersonalProfileInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePersonalProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
