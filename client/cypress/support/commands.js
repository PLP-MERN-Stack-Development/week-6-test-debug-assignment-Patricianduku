// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
})

// Custom command to clear form
Cypress.Commands.add('clearForm', () => {
  cy.get('#bug-title').clear()
  cy.get('#bug-description').clear()
})

// Custom command to check form validation
Cypress.Commands.add('checkFormValidation', (expectedError) => {
  cy.get('[data-testid="form-error"]')
    .should('be.visible')
    .and('contain', expectedError)
})

// Custom command to check success message
Cypress.Commands.add('checkSuccessMessage', (expectedMessage) => {
  cy.get('p').should('contain', expectedMessage)
})

// Custom command to toggle dark mode
Cypress.Commands.add('toggleDarkMode', () => {
  cy.get('[data-testid="dark-mode-toggle"]').click()
})

// Custom command to check responsive design
Cypress.Commands.add('checkResponsive', (width, height) => {
  cy.viewport(width, height)
  cy.get('[data-testid="bug-form"]').should('be.visible')
})

// Custom command to filter bugs by status
Cypress.Commands.add('filterByStatus', (status) => {
  cy.get(`[data-testid="filter-${status}"]`).click()
})

// Custom command to check bug count
Cypress.Commands.add('checkBugCount', (expectedCount) => {
  cy.get('[data-testid="bug-item"]').should('have.length', expectedCount)
})