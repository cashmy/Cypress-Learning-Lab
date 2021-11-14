/// <reference types="cypress" />

describe('Training Test Suite 1', () => {

    it('First Test', () => {

        cy.visit('/')  //Informs cy runner to use the root url of specified in the config.
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //by Tag Name
        cy.get('input')

        //by ID
        cy.get('#inputEmail')

        //by Classname
        cy.get('.input-full-width')

        //by Attribute name
        cy.get('[placeholder]')

        //by Attribute name and value
        cy.get('[placeholder="Email"]')

        //by Class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        //by Tag name and Attribute with value
        cy.get('input[placeholder="Email"]')

        //by two (or more) different attributes: (2 examples shown)
        cy.get('[placeholder="Email"][fullWidth]')
        cy.get('[placeholder="Email"][type="email"]')

        //by Tag name, Attribute with value, Id and Class name (no spaces!!)
        cy.get('input[placeholder="Email"]#inputEmail.input-full-width')

        //The most recommend way by Cypress - create your own attribute
        cy.get('[data-cy="imputEmail1')
    })

    it('Second Test', () => {

        cy.visit('/')  
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.get('[data-cy="signInButton"]')

        cy.contains('Sign in')

        cy.contains('[status="warning"]', 'Sign in')

        //Find the #id, then travel up to the parent, then travel down to the child
        // next verfied the correct button, then travel back up to the parent, travel back to the checkbox, and then click.
        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()
        
        //Find text the nb-card which contains text "Horizontal form" and within the card find the web-element that has the attr-email
        cy.contains('nb-card','Horizontal form').find('[type="email"]')
    })

    it.only('"Then" and "Wrap" methods', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
        
    })
})
