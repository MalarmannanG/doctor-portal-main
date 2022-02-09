import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanceCallListComponent } from './ambulance-call-list.component';

describe('AmbulanceCallListComponent', () => {
  let component: AmbulanceCallListComponent;
  let fixture: ComponentFixture<AmbulanceCallListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbulanceCallListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceCallListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
