describe('/blog-posts', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Create a new blog post').click()
  });

  it('Can create a blog post', () => {
    cy.location('pathname').should('eq', '/blog-posts/new')

    cy.get('#title').type("New Blog post")
    cy.get('#body').type("Here is some content")
    cy.contains('Submit').click()

    cy.location('pathname').should('eq', '/blog-posts')

    cy.get('body').should('contain', "New Blog post")

    cy.contains('New Blog post').click()

    cy.get('.govuk-heading-l').should('contain', "New Blog post")
    cy.get('.govuk-body').should('contain', "Here is some content")
  })

  it('Shows errrors when a field is missing', () => {
    cy.contains('Submit').click()

    cy.get('body').should('contain', "There is a problem")

    cy.get('.govuk-error-summary').should('contain', "There is a problem")
    cy.get('.govuk-error-summary').should('contain', "title should not be empty")
    cy.get('.govuk-error-summary').should('contain', "body should not be empty")

    cy.get("#title-error").should('contain', "title should not be empty")
    cy.get("#body-error").should('contain', "body should not be empty")
  })

  it('Can edit a blog post', () => {
    cy.get('#title').type("New Blog post")
    cy.get('#body').type("Here is some content")
    cy.contains('Submit').click()

    cy.contains('New Blog post').click()
    cy.contains('Edit').click()

    cy.get('#title').type("Edited Blog post")
    cy.get('#body').type("Here is some updated content")
    cy.contains('Submit').click()

    cy.get('body').should('contain', "Edited Blog post")

    cy.contains('Edited Blog post').click()

    cy.get('.govuk-heading-l').should('contain', "Edited Blog post")
    cy.get('.govuk-body').should('contain', "Here is some updated content")
  })

})
