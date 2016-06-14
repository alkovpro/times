import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { TimesAppComponent } from '../app/app.component';

beforeEachProviders(() => [TimesAppComponent]);

describe('App: Times', () => {
  it('should create the app',
      inject([TimesAppComponent], (app: TimesAppComponent) => {
    expect(app).toBeTruthy();
  }));

  // it('should have as title \'front works!\'',
  //     inject([TimesAppComponent], (app: TimesAppComponent) => {
  //   expect(app.title).toEqual('front works!');
  // }));
});
