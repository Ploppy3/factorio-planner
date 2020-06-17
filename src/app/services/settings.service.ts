import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { isNullOrUndefined, isNumber, isBoolean } from 'app/utils';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  /*
  The settings service manages settings and is available all over the app
  Settings are saved using the localStorage api
  */

  constructor() {
    if (!environment.production) {
      console.log('constructor');
    }
  }

  public reset() {
    localStorage.clear();
  }

  public setValue(key: string, value: any) {

    if (!environment.production) {
      console.log(`set ${key} -> ${value}`);
    }
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  }

  public get(key: string, defaultValue: any) {
    const value = this.getRaw(key);
    return isNullOrUndefined(value) ? defaultValue : value;
  }

  public getNumber(key: string, defaultValue: number) {
    const value = this.getRaw(key);
    return isNumber(value) ? value : defaultValue;
  }

  public getBoolean(key: string, defaultValue: boolean) {
    const value = this.getRaw(key);
    return isBoolean(value) ? value : defaultValue;
  }

  public removeValue(key: string) {
    localStorage.removeItem(key);
  }

  /** gets the parsed json value from localStorage or return null */
  private getRaw(key: string) {
    try {
      const jsonValue = localStorage.getItem(key);
      // console.log('searched for', key, 'found', JSON.parse(json_value));
      return JSON.parse(jsonValue);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export enum Settings {
  DARK_THEME = 'fp_dark_theme',
  TABS = 'fp_tabs',
  SHOW_TIPS_ON_STARTUP = 'fp_show_tips_on_startup',
}
