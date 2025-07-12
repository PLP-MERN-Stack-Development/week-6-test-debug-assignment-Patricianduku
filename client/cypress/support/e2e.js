// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for common operations
Cypress.Commands.add('submitBugForm', (title, description = '') => {
  cy.get('#bug-title').type(title)
  if (description) {
    cy.get('#bug-description').type(description)
  }
  cy.get('[data-testid="bug-form"]').submit()
})

Cypress.Commands.add('mockBugSubmission', (response = { id: 1 }) => {
  cy.intercept('POST', '/api/bugs', {
    statusCode: 201,
    body: response
  }).as('submitBug')
})

Cypress.Commands.add('mockBugList', (bugs = []) => {
  cy.intercept('GET', '/api/bugs', {
    statusCode: 200,
    body: bugs
  }).as('getBugs')
})

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})