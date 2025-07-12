describe('Connection Test', () => {
  it('should connect to the app', () => {
    // Visit the app
    cy.visit('/')
    
    // Check if we can see the page title
    cy.title().should('eq', 'Bug Tracker')
    
    // Check if we can see the body
    cy.get('body').should('exist')
    
    // Log the current URL
    cy.url().then(url => {
      cy.log('Current URL:', url)
    })
    
    // Check if the root div exists
    cy.get('#root').should('exist')
    
    // Take a screenshot
    cy.screenshot('connection-test')
  })
  
  it('should check if React is loading', () => {
    cy.visit('/')
    
    // Wait for React to load
    cy.wait(3000)
    
    // Check for React root
    cy.get('#root').should('exist')
    
    // Check if there's any content in the root
    cy.get('#root').should('not.be.empty')
    
    // Log the root content
    cy.get('#root').then(root => {
      cy.log('Root content length:', root[0].innerHTML.length)
      cy.log('Root content preview:', root[0].innerHTML.substring(0, 100))
    })
  })
}) 