import '@cypress/xpath';

export const getPageTitle = () => cy.get('.cpu-monitor-nav-title');

export const getWarningSettingIcon = () =>
  cy.get(
    'body > cpu-monitor-root > div.cpu-monitor-content > cpu-monitor-activities > div > div.cpu-monitor-activities-action > button > span.mat-mdc-button-touch-target'
  );

export const getWarningInput = () => cy.get('.cpu-monitor-warning-edit');

export const getWarningConfirmButton = () =>
  cy.get(
    'body > cpu-monitor-root > div.cpu-monitor-content > cpu-monitor-activities > div > div.cpu-monitor-activities-action > div > button > span.mat-mdc-button-touch-target'
  );

export const getOverLoadedTimes = () =>
  cy.get(
    'body > cpu-monitor-root > div.cpu-monitor-content > div > cpu-monitor-info > div.cpu-monitor-info-carts > cpu-monitor-banner:nth-child(2) > mat-card > mat-card-content > div > span.cpu-monitor-banner'
  );
