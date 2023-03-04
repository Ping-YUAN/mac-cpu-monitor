import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorNavComponent } from './monitor-nav.component';

xdescribe('MonitorNavComponent', () => {
  let component: MonitorNavComponent;
  let fixture: ComponentFixture<MonitorNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitorNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitorNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
