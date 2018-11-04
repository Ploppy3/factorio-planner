import { TestBed } from '@angular/core/testing';

import { SettingsServiceService } from './settings-service.service';

describe('SettingsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsServiceService = TestBed.get(SettingsServiceService);
    expect(service).toBeTruthy();
  });
});
