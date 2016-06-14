export class FrontPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('front-app h1')).getText();
  }
}
