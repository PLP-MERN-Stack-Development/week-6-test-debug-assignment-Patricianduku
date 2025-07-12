describe('Complete User Flow E2E Tests', () => {
  beforeEach(() => {
    // Mock initial bugs data
    cy.intercept('GET', '/api/bugs', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Existing Bug',
          description: 'This is an existing bug',
          status: 'open',
          createdAt: '2024-01-15T10:30:00Z'
        }
      ]
    }).as('getInitialBugs')
  })

  it('should complete full user journey: view bugs, submit new bug, see it in list', () => {
    // Visit the app
    cy.visit('/')
    cy.wait('@getInitialBugs')

    // Step 1: View existing bugs
    cy.get('[data-testid="bug-list"]').should('be.visible')
    cy.get('[data-testid="bug-item"]').should('have.length', 1)
    cy.get('[data-testid="bug-title"]').should('contain', 'Existing Bug')

    // Step 2: Submit a new bug report
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: { id: 2, title: 'New Critical Bug', description: 'This is a new bug' }
    }).as('submitNewBug')

    // Fill and submit the form
    cy.get('#bug-title').type('New Critical Bug')
    cy.get('#bug-description').type('This is a new bug that needs immediate attention')
    cy.get('[data-testid="bug-form"]').submit()

    // Wait for submission
    cy.wait('@submitNewBug')

    // Verify form is cleared
    cy.get('#bug-title').should('have.value', '')
    cy.get('#bug-description').should('have.value', '')

    // Step 3: Verify new bug appears in list
    cy.intercept('GET', '/api/bugs', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Existing Bug',
          description: 'This is an existing bug',
          status: 'open',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'New Critical Bug',
          description: 'This is a new bug that needs immediate attention',
          status: 'open',
          createdAt: new Date().toISOString()
        }
      ]
    }).as('getUpdatedBugs')

    // Refresh the page to see the new bug
    cy.visit('/')
    cy.wait('@getUpdatedBugs')

    // Verify both bugs are now visible
    cy.get('[data-testid="bug-item"]').should('have.length', 2)
    cy.get('[data-testid="bug-title"]').should('contain', 'New Critical Bug')
  })

  it('should handle error scenarios in user flow', () => {
    // Mock API error for initial load
    cy.intercept('GET', '/api/bugs', {
      statusCode: 500,
      body: { error: 'Server error' }
    }).as('getBugsError')

    cy.visit('/')
    cy.wait('@getBugsError')

    // Should show error state
    cy.get('[data-testid="error-state"]').should('be.visible')

    // Try to submit a bug (should still work)
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: { id: 1, title: 'Test Bug', description: 'Test Description' }
    }).as('submitBug')

    cy.get('#bug-title').type('Test Bug')
    cy.get('#bug-description').type('Test Description')
    cy.get('[data-testid="bug-form"]').submit()

    cy.wait('@submitBug')
    cy.get('p').should('contain', 'Bug reported successfully!')
  })

  it('should test form validation in user flow', () => {
    cy.visit('/')

    // Try to submit empty form
    cy.get('[data-testid="bug-form"]').submit()
    cy.get('[data-testid="form-error"]').should('contain', 'Title is required')

    // Fill only title, leave description empty
    cy.get('#bug-title').type('Bug with no description')
    
    // Mock the POST request before submitting
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: { id: 1 }
    }).as('submitBugNoDesc')

    cy.get('[data-testid="bug-form"]').submit()
    cy.wait('@submitBugNoDesc')
    cy.get('p').should('contain', 'Bug reported successfully!')
  })

  it('should test filtering functionality in user flow', () => {
    // Mock bugs with different statuses
    cy.intercept('GET', '/api/bugs', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Open Bug', status: 'open', description: 'Open bug', createdAt: '2024-01-15T10:30:00Z' },
        { id: 2, title: 'In Progress Bug', status: 'in-progress', description: 'In progress bug', createdAt: '2024-01-14T15:45:00Z' },
        { id: 3, title: 'Resolved Bug', status: 'resolved', description: 'Resolved bug', createdAt: '2024-01-13T09:20:00Z' }
      ]
    }).as('getBugsWithStatuses')

    cy.visit('/')
    cy.wait('@getBugsWithStatuses')

    // Initially show all bugs
    cy.get('[data-testid="bug-item"]').should('have.length', 3)

    // Filter by open bugs
    cy.get('[data-testid="filter-open"]').click()
    cy.get('[data-testid="bug-item"]').should('have.length', 1)
    cy.get('[data-testid="bug-title"]').should('contain', 'Open Bug')

    // Filter by resolved bugs
    cy.get('[data-testid="filter-resolved"]').click()
    cy.get('[data-testid="bug-item"]').should('have.length', 1)
    cy.get('[data-testid="bug-title"]').should('contain', 'Resolved Bug')

    // Show all bugs again
    cy.get('[data-testid="filter-all"]').click()
    cy.get('[data-testid="bug-item"]').should('have.length', 3)
  })

  it('should test responsive design in user flow', () => {
    cy.intercept('GET', '/api/bugs', {
      statusCode: 200,
      body: [{ id: 1, title: 'Test Bug', status: 'open', description: 'Test', createdAt: '2024-01-15T10:30:00Z' }]
    }).as('getBugs')

    // Test mobile view
    cy.viewport(375, 667)
    cy.visit('/')
    cy.wait('@getBugs')

    // Form should be visible and usable
    cy.get('[data-testid="bug-form"]').should('be.visible')
    cy.get('#bug-title').type('Mobile Test Bug')
    cy.get('#bug-description').type('Testing on mobile')
    
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: { id: 2 }
    }).as('submitMobileBug')

    cy.get('[data-testid="bug-form"]').submit()
    cy.wait('@submitMobileBug')

    // Test tablet view
    cy.viewport(768, 1024)
    cy.visit('/')
    cy.wait('@getBugs')
    cy.get('[data-testid="bug-form"]').should('be.visible')

    // Test desktop view
    cy.viewport(1280, 720)
    cy.visit('/')
    cy.wait('@getBugs')
    cy.get('[data-testid="bug-form"]').should('be.visible')
  })

  it('should test accessibility features in user flow', () => {
    cy.visit('/')

    // Check form accessibility
    cy.get('#bug-title').should('have.attr', 'aria-label', 'Bug Title')
    cy.get('#bug-description').should('have.attr', 'aria-label', 'Bug Description')
    cy.get('label[for="bug-title"]').should('exist')
    cy.get('label[for="bug-description"]').should('exist')

    // Test form focus and accessibility
    cy.get('#bug-title').focus()
    cy.focused().should('have.attr', 'id', 'bug-title')
    
    cy.get('#bug-title').type('Accessibility Test')
    cy.get('#bug-description').focus()
    cy.focused().should('have.attr', 'id', 'bug-description')
    
    cy.get('#bug-description').type('Testing keyboard navigation')
    
    // Test that submit button is accessible
    cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled')
  })

  it('should test dark mode toggle in user flow', () => {
    cy.visit('/')

    // Check if dark mode toggle exists
    cy.get('[data-testid="dark-mode-toggle"]').should('be.visible')

    // Toggle dark mode
    cy.get('[data-testid="dark-mode-toggle"]').click()
    cy.get('html').should('have.class', 'dark')

    // Toggle back to light mode
    cy.get('[data-testid="dark-mode-toggle"]').click()
    cy.get('html').should('not.have.class', 'dark')

    // Test form submission in dark mode
    cy.get('[data-testid="dark-mode-toggle"]').click()
    cy.get('#bug-title').type('Dark Mode Bug')
    cy.get('#bug-description').type('Testing in dark mode')
    
    cy.intercept('POST', '/api/bugs', {
      statusCode: 201,
      body: { id: 1 }
    }).as('submitDarkModeBug')

    cy.get('[data-testid="bug-form"]').submit()
    cy.wait('@submitDarkModeBug')
    cy.get('p').should('contain', 'Bug reported successfully!')
  })
}) 