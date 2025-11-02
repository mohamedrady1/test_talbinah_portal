import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLayoutHeaderComponent } from './page-layout-header.component';

describe('PageLayoutHeaderComponent', () => {
  let component: PageLayoutHeaderComponent;
  let fixture: ComponentFixture<PageLayoutHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLayoutHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageLayoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
