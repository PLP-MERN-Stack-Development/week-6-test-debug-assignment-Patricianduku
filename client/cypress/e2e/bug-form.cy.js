describe('Bug Form E2E Tests', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('/')
  })

  it('should display the bug form correctly', () => {
    // Check if the form is visible
    cy.get('[data-testid="bug-form"]').should('be.visible')
    
    // Check form elements
    cy.get('h2').should('contain', 'Report a Bug')
    cy.get('label[for="bug-title"]').should('contain', 'Title')
    cy.get('label[for="bug-description"]').should('contain', 'Description')
    cy.get('button[type="submit"]').should('contain', 'Report Bug')
    
    // Check required field indicator
    cy.get('label[for="bug-title"] span').should('contain', '*')
  })

  it('should show validation error when submitting empty form', () => {
    // Try to submit without filling title
    cy.get('[data-testid="bug-form"]').submit()
    
    // Should show error message
    cy.get('[data-testid="form-error"]')
      .should('be.visible')
      .and('contain', 'Title is required')
  })

  it('should successfully submit a bug report', () => {
    // Mock the API response
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: { id: 1, title: 'Test Bug', description: 'Test Description' }
    }).as('submitBug')

    // Fill in the form
    cy.get('#bug-title').type('Critical UI Bug')
    cy.get('#bug-description').type('The submit button is not working properly')
    
    // Submit the form
    cy.get('[data-testid="bug-form"]').submit()
    
    // Wait for API call
    cy.wait('@submitBug')
    
    // Check that form is cleared
    cy.get('#bug-title').should('have.value', '')
    cy.get('#bug-description').should('have.value', '')
    
    // Check success message
    cy.get('p').should('contain', 'Bug reported successfully!')
  })

  it('should handle API errors gracefully', () => {
    // Mock API error
    cy.intercept('POST', '/api/bugs', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('submitBugError')

    // Fill and submit form
    cy.get('#bug-title').type('Test Bug')
    cy.get('#bug-description').type('Test Description')
    cy.get('[data-testid="bug-form"]').submit()
    
    // Wait for API call
    cy.wait('@submitBugError')
    
    // Check error message
    cy.get('[data-testid="form-error"]')
      .should('be.visible')
      .and('contain', 'Failed to report bug.')
  })

  it('should show loading state during submission', () => {
    // Mock slow API response
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: { id: 1 },
      delay: 1000
    }).as('slowSubmit')

    // Fill and submit form
    cy.get('#bug-title').type('Slow Bug')
    cy.get('#bug-description').type('This will take time')
    cy.get('[data-testid="bug-form"]').submit()
    
    // Check loading state
    cy.get('button[type="submit"]').should('contain', 'Reporting...')
    cy.get('button[type="submit"]').should('be.disabled')
    
    // Wait for completion
    cy.wait('@slowSubmit')
    cy.get('button[type="submit"]').should('contain', 'Report Bug')
    cy.get('button[type="submit"]').should('not.be.disabled')
  })

  it('should handle form input changes correctly', () => {
    // Test title input
    cy.get('#bug-title')
      .type('Dynamic Bug Title')
      .should('have.value', 'Dynamic Bug Title')
    
    // Test description input
    cy.get('#bug-description')
      .type('This is a detailed description of the bug')
      .should('have.value', 'This is a detailed description of the bug')
    
    // Test clearing inputs
    cy.get('#bug-title').clear().should('have.value', '')
    cy.get('#bug-description').clear().should('have.value', '')
  })

  it('should maintain form state during validation', () => {
    // Fill form partially
    cy.get('#bug-title').type('Partial Bug')
    
    // Try to submit (should fail validation)
    cy.get('[data-testid="bug-form"]').submit()
    
    // Check error appears
    cy.get('[data-testid="form-error"]').should('be.visible')
    
    // Check that title value is preserved
    cy.get('#bug-title').should('have.value', 'Partial Bug')
    
    // Fill description and submit again
    cy.get('#bug-description').type('Now complete')
    
    // Mock successful response
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: { id: 1 }
    }).as('submitComplete')
    
    cy.get('[data-testid="bug-form"]').submit()
    cy.wait('@submitComplete')
  })
}) 