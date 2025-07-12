describe('Debug Test', () => {
  it('should check what is actually on the page', () => {
    cy.visit('/')
    
    // Wait a bit for the page to load
    cy.wait(2000)
    
    // Take a screenshot to see what's there
    cy.screenshot('debug-page')
    
    // Log the page title
    cy.title().then(title => {
      cy.log('Page title:', title)
    })
    
    // Check if body exists
    cy.get('body').should('exist')
    
    // Log all elements on the page with their tags
    cy.get('*').then(elements => {
      cy.log('Number of elements on page:', elements.length)
      for (let i = 0; i < Math.min(elements.length, 20); i++) {
        const element = elements[i]
        cy.log(`Element ${i}: <${element.tagName.toLowerCase()}> ${element.className || ''}`)
      }
    })
    
    // Check for specific elements
    cy.get('div').then(divs => {
      cy.log('Number of divs found:', divs.length)
    })
    
    cy.get('h1').then(h1s => {
      cy.log('Number of h1s found:', h1s.length)
      if (h1s.length > 0) {
        cy.log('H1 text:', h1s[0].textContent)
      }
    })
    
    cy.get('h2').then(h2s => {
      cy.log('Number of h2s found:', h2s.length)
      if (h2s.length > 0) {
        cy.log('H2 text:', h2s[0].textContent)
      }
    })
    
    // Check for any form elements
    cy.get('form').then(forms => {
      cy.log('Number of forms found:', forms.length)
      if (forms.length > 0) {
        cy.log('Form HTML:', forms[0].outerHTML)
      }
    })
    
    // Check for any input elements
    cy.get('input').then(inputs => {
      cy.log('Number of inputs found:', inputs.length)
    })
    
    // Check for any buttons
    cy.get('button').then(buttons => {
      cy.log('Number of buttons found:', buttons.length)
    })
    
    // Check for the root div
    cy.get('#root').then(root => {
      cy.log('Root div exists:', root.length > 0)
      if (root.length > 0) {
        cy.log('Root div HTML:', root[0].innerHTML.substring(0, 200) + '...')
      }
    })
  })
  
  it('should wait for form to appear', () => {
    cy.visit('/')
    
    // Wait for the form to appear
    cy.get('[data-testid="bug-form"]', { timeout: 10000 }).should('be.visible')
    
    // If we get here, the form is visible
    cy.log('Form is visible!')
  })
}) 