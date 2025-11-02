import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageShemmerComponent } from './main-page-shemmer.component';

describe('MainPageShemmerComponent', () => {
  let component: MainPageShemmerComponent;
  let fixture: ComponentFixture<MainPageShemmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageShemmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPageShemmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
