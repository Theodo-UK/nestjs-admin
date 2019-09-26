/// <reference types="Cypress" />

context('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/admin');
    cy.server();
  });

  it('should open login page', () => {
      cy.get('[data-cy="Login"]').should('visible')
  });

});


