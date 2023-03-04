import {
  getOverLoadedTimes,
  getPageTitle,
  getWarningConfirmButton,
  getWarningInput,
  getWarningSettingIcon,
} from '../support/app.po';

describe('cpu-monitor', () => {
  beforeEach(() => cy.visit('localhost:3000'));

  it('should display pages', () => {
    getPageTitle().contains('CPU Load Monitor');
  });

  it('should get overload notification', () => {
    cy.viewport(1400, 1000);

    getWarningSettingIcon().click();
    getWarningInput().clear().type('0.1');
    getWarningConfirmButton().click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(30000).then(() => {
      getOverLoadedTimes().then((span) => {
        expect(cy.wrap(Number(span.text())).should('be.gte', 1));
      });
    });
  });
});
