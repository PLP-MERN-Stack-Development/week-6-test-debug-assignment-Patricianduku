describe('Smoke Test - Basic Functionality', () => {
  it('should load the application and display main components', () => {
    // Visit the app
    cy.visit('/')
    
    // Check if main components are visible
    cy.get('h1').should('contain', 'Bug Tracker')
    cy.get('[data-testid="bug-form"]').should('be.visible')
    cy.get('h2').should('contain', 'Report a Bug')
    
    // Check if form elements are present
    cy.get('#bug-title').should('be.visible')
    cy.get('#bug-description').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Report Bug')
  })

  it('should submit a bug report successfully', () => {
    // Mock API response
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: { id: 1, title: 'Test Bug', description: 'Test Description' }
    }).as('submitBug')

    cy.visit('/')
    
    // Fill and submit form
    cy.get('#bug-title').type('Test Bug')
    cy.get('#bug-description').type('This is a test bug')
    cy.get('[data-testid="bug-form"]').submit()
    
    // Wait for API call
    cy.wait('@submitBug')
    
    // Check success message
    cy.get('p').should('contain', 'Bug reported successfully!')
  })

  it('should show validation error for empty title', () => {
    cy.visit('/')
    
    // Try to submit without title
    cy.get('[data-testid="bug-form"]').submit()
    
    // Should show error
    cy.get('[data-testid="form-error"]')
      .should('be.visible')
      .and('contain', 'Title is required')
  })
}) 