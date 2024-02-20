Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("https://okioki.app");

  // Enter Username
  cy.xpath('//*[@id="Username"]').type(email).should("have.value", email);

  // Enter Password
  cy.xpath('//*[@id="Password"]').type(password).should("have.value", password);

  // Click Login button
  cy.xpath('//*[@id="account"]/button').click();

  cy.wait(10000);

  // Wait for the drawer element to appear on the dashboard page
  cy.xpath('//*[@id="app"]/div[1]/div/div[1]/div/div[1]', {
    timeout: 10000,
  }).should("be.visible");

  // Verify successful login
  cy.url().should("eq", "https://www.okioki.app/dashboard");
});

Cypress.Commands.add("amountIncllVATField", () => {
  return cy.get(
    "li.props-table-item:nth-child(3) > div:nth-child(1) > span:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
  );
});

Cypress.Commands.add("amountExclVATField", () => {
  return cy.get(
    "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li:nth-child(4) > div.single-line > span.value > div > div.wrapper.editable.justify-content-end > div"
  );
});

Cypress.Commands.add("rateField", () => {
  return cy.get(
    "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li.props-table-item.vat-section-body > div.single-line > span > table > tbody > tr > td.first-col > div > div > div"
  );
});

Cypress.Commands.add("amountToPayField", () => {
  return cy.get(
    "li.props-table-item:nth-child(7) > div:nth-child(2) > span:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
  );
});

Cypress.Commands.add("exclVatField", () => {
  return cy.get(
    "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li.props-table-item.vat-section-body > div.single-line > span > table > tbody > tr > td:nth-child(2) > div > div > div"
  );
});

Cypress.Commands.add("vatField", () => {
  return cy.get(
    "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li.props-table-item.vat-section-body > div.single-line > span > table > tbody > tr > td.text-right.last-col > div > div > div"
  );
});