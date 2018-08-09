import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectPeopleComponent } from './connect-people.component';

describe('ConnectPeopleComponent', () => {
  let component: ConnectPeopleComponent;
  let fixture: ComponentFixture<ConnectPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
