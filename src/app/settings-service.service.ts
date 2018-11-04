import { Injectable } from '@angular/core';
import { isNumber, isNullOrUndefined, isBoolean } from 'app/utils';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  /*
  The settings service manages settings and is available all over the app
  Settings are saved using the localStorage api
  */

  constructor() {
    console.log('constructor');
  }

  public setValue(key: string, value: any) {
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

  /** gets the parsed json value from localStorage or return null */
  private getRaw(key: string) {
    try {
      const json_value = localStorage.getItem(key);
      // console.log('searched for', key, 'found', JSON.parse(json_value));
      return JSON.parse(json_value)
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export enum Settings {
  DARK_THEME = 'fp_dark_theme',
}
