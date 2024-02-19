// cypress/support/index.ts
import "@4tw/cypress-drag-drop";

// Обработчик события для игнорирования неотловленных исключений
Cypress.on("uncaught:exception", (_err) => {
  // Возвращение false здесь предотвращает сбой теста Cypress
  return false;
});
