import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalSettingsDialogComponent } from './global-settings-dialog.component';

describe('GlobalSettingsDialogComponent', () => {
  let component: GlobalSettingsDialogComponent;
  let fixture: ComponentFixture<GlobalSettingsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSettingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
