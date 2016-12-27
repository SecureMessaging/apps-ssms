import { AppsSsmsPage } from './app.po';

describe('apps-ssms App', function() {
  let page: AppsSsmsPage;

  beforeEach(() => {
    page = new AppsSsmsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
