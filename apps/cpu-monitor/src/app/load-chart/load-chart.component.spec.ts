import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadChartComponent } from './load-chart.component';

xdescribe('LoadChartComponent', () => {
  let component: LoadChartComponent;
  let fixture: ComponentFixture<LoadChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
