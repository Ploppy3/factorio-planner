import { FactorioPlannerPage } from './app.po';

describe('factorio-planner App', () => {
  let page: FactorioPlannerPage;

  beforeEach(() => {
    page = new FactorioPlannerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
