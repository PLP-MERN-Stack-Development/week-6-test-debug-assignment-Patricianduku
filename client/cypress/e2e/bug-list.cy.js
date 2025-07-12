describe('Bug List E2E Tests', () => {
  beforeEach(() => {
    // Mock the bugs API response
    cy.intercept('GET', '/api/bugs', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Critical UI Bug',
          description: 'The submit button is not working',
          status: 'open',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'Database Connection Issue',
          description: 'Users cannot save their data',
          status: 'in-progress',
          createdAt: '2024-01-14T15:45:00Z'
        },
        {
          id: 3,
          title: 'Mobile Responsiveness',
          description: 'Layout breaks on mobile devices',
          status: 'resolved',
          createdAt: '2024-01-13T09:20:00Z'
        }
      ]
    }).as('getBugs')

    // Visit the app
    cy.visit('/')
  })

  it('should display the bug list correctly', () => {
    // Wait for bugs to load
    cy.wait('@getBugs')
    
    // Check if bugs are displayed
    cy.get('[data-testid="bug-list"]').should('be.visible')
    
    // Check individual bug items
    cy.get('[data-testid="bug-item"]').should('have.length', 3)
    
    // Check first bug details
    cy.get('[data-testid="bug-item"]').first().within(() => {
      cy.get('[data-testid="bug-title"]').should('contain', 'Critical UI Bug')
      cy.get('[data-testid="bug-description"]').should('contain', 'The submit button is not working')
      cy.get('[data-testid="bug-status"]').should('contain', 'Open')
    })
  })

  it('should filter bugs by status', () => {
    cy.wait('@getBugs')
    
    // Check all status filters are present
    cy.get('[data-testid="status-filter"]').should('be.visible')
    cy.get('[data-testid="filter-open"]').should('be.visible')
    cy.get('[data-testid="filter-open"]').should('contain', 'Open')
    cy.get('[data-testid="filter-in-progress"]').should('be.visible').and('contain', 'In Progress')
    cy.get('[data-testid="filter-resolved"]').should('be.visible').and('contain', 'Resolved')
    
    // Filter by open bugs
    cy.get('[data-testid="filter-open"]').click()
    cy.get('[data-testid="bug-item"]').should('have.length', 1)
    cy.get('[data-testid="bug-status"]').should('contain', 'Open')
    
    // Filter by resolved bugs
    cy.get('[data-testid="filter-resolved"]').click()
    cy.get('[data-testid="bug-item"]').should('have.length', 1)
    cy.get('[data-testid="bug-status"]').should('contain', 'Resolved')
    
    // Show all bugs
    cy.get('[data-testid="filter-all"]').click()
    cy.get('[data-testid="bug-item"]').should('have.length', 3)
  })

  it('should display correct status badges with colors', () => {
    cy.wait('@getBugs')
    
    // Check status badge colors (using actual classes from component)
    cy.get('[data-testid="bug-item"]').first().within(() => {
      cy.get('[data-testid="bug-status"]')
        .should('have.class', 'bg-pink-100')
        .and('have.class', 'text-pink-700')
    })
    
    cy.get('[data-testid="bug-item"]').eq(1).within(() => {
      cy.get('[data-testid="bug-status"]')
        .should('have.class', 'bg-yellow-100')
        .and('have.class', 'text-yellow-800')
    })
    
    cy.get('[data-testid="bug-item"]').last().within(() => {
      cy.get('[data-testid="bug-status"]')
        .should('have.class', 'bg-green-100')
        .and('have.class', 'text-green-800')
    })
  })

  it('should handle empty bug list', () => {
    // Mock empty response
    cy.intercept('GET', '/api/bugs', {
      statusCode: 200,
      body: []
    }).as('getEmptyBugs')
    
    cy.visit('/')
    cy.wait('@getEmptyBugs')
    
    // Check empty state
    cy.get('[data-testid="empty-state"]').should('be.visible')
    cy.get('[data-testid="empty-state"]').should('contain', 'No bugs found')
  })

  it('should handle API errors gracefully', () => {
    // Mock API error
    cy.intercept('GET', '/api/bugs', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('getBugsError')
    
    cy.visit('/')
    cy.wait('@getBugsError')
    
    // Check error state
    cy.get('[data-testid="error-state"]').should('be.visible')
    cy.get('[data-testid="error-state"]').should('contain', 'Failed to load bugs')
  })

  it('should display bug creation dates correctly', () => {
    cy.wait('@getBugs')
    
    // Check date formatting
    cy.get('[data-testid="bug-date"]').first().should('contain', 'Jan 15, 2024')
    cy.get('[data-testid="bug-date"]').eq(1).should('contain', 'Jan 14, 2024')
    cy.get('[data-testid="bug-date"]').last().should('contain', 'Jan 13, 2024')
  })

  it('should be responsive on different screen sizes', () => {
    cy.wait('@getBugs')
    
    // Test mobile view
    cy.viewport(375, 667)
    cy.get('[data-testid="bug-list"]').should('be.visible')
    cy.get('[data-testid="bug-item"]').should('have.length', 3)
    
    // Test tablet view
    cy.viewport(768, 1024)
    cy.get('[data-testid="bug-list"]').should('be.visible')
    
    // Test desktop view
    cy.viewport(1280, 720)
    cy.get('[data-testid="bug-list"]').should('be.visible')
  })

  it('should reset filter to all after page reload', () => {
    cy.wait('@getBugs')
    
    // Apply filter
    cy.get('[data-testid="filter-open"]').click()
    cy.get('[data-testid="bug-item"]').should('have.length', 1)
    
    // Navigate away and back (simulate page refresh)
    cy.visit('/')
    cy.wait('@getBugs')
    
    // Filter should reset to all (default behavior)
    cy.get('[data-testid="bug-item"]').should('have.length', 3)
  })
}) 