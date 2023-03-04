import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesItemComponent } from './activities-item.component';

xdescribe('ActivitiesItemComponent', () => {
  let component: ActivitiesItemComponent;
  let fixture: ComponentFixture<ActivitiesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivitiesItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
