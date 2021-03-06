import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppInstallComponent } from './app-install.component';

describe('AppInstallComponent', () => {
  let component: AppInstallComponent;
  let fixture: ComponentFixture<AppInstallComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppInstallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppInstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
