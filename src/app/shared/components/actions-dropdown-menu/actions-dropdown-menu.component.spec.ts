import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsDropdownMenuComponent } from './actions-dropdown-menu.component';

describe('ActionsDropdownMenuComponent', () => {
  let component: ActionsDropdownMenuComponent;
  let fixture: ComponentFixture<ActionsDropdownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsDropdownMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
