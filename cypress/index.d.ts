declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to get props table item
     * @example cy.getPropsTableItem()
     */
    amountIncllVATField(): Chainable<any>;
    amountExclVATField(): Chainable<any>;
    login(): Chainable<any>;
    rateField(): Chainable<any>;
    amountToPayField(): Chainable<any>;
    exclVatField(): Chainable<any>;
    vatField(): Chainable<any>;
  }
}

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): void;
  }
}
