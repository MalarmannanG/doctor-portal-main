import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanceListComponent } from './ambulance-list.component';

describe('AmbulanceListComponent', () => {
  let component: AmbulanceListComponent;
  let fixture: ComponentFixture<AmbulanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbulanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
