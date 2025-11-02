import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPostMenuComponent } from './open-post-menu.component';

describe('OpenPostMenuComponent', () => {
  let component: OpenPostMenuComponent;
  let fixture: ComponentFixture<OpenPostMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenPostMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenPostMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
