import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedItemsComponent } from './issued-items.component';

describe('IssuedItemsComponent', () => {
  let component: IssuedItemsComponent;
  let fixture: ComponentFixture<IssuedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuedItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
