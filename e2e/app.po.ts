import { browser, element, by } from 'protractor';

export class FactorioPlannerPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
