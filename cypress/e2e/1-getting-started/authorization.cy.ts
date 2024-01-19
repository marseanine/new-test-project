/// <reference types="cypress" />

describe('Authorization', () => {
  //beforeEach(() => {
    //cy.viewport(1536, 960)
  //})
    it('Enter login and password, authorize and checks the interface', () => {

      // Entering login and password through the browser authentication window
      const username = 'fabrique';
      const password = 'fabrique';
  
      // Using URL parameters to insert login and password
      cy.visit(`https://${username}:${password}@finance.dev.fabrique.studio/accounts/login/`);
  
      // Interface checks after authorization
      cy.get('.widget__title').should('be.visible');

      // Entering login and password in interface
      cy.get('input[type="email"]').type('admin@admin.ad');
      cy.get('input[type="password"]').type('admin');
      
      // Clicking on the "Войти" button
      cy.get('.button__content').click();
    });      
  });
  