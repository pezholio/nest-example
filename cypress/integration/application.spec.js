describe('/', () => {
  it('Redirects to /blog-posts', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/blog-posts')
  })
})
