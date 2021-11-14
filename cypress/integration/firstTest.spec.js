/// <reference types="cypress" />

const { intersection } = require("lodash")

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
        cy.contains('nb-card', 'Horizontal form').find('[type="email"]')
    })

    it('"Then" and "Wrap" methods', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // & This is highly redundant and violates the DRY principle
        // cy.contains('nb-card', 'Using the Grid')
        //     .find('[for="inputEmail1"]')
        //     .should('contain', 'Email')
        // cy.contains('nb-card', 'Using the Grid')
        //     .find('[for="inputPassword2"]')
        //     .should('contain', 'Password')
        // cy.contains('nb-card', 'Basic form')
        //     .find('[for="exampleInputEmail1"]')
        //     .should('contain', 'Email')
        // cy.contains('nb-card', 'Basic form')
        //     .find('[for="exampleInputPassword1"]')
        //     .should('contain', 'Password')

        // ! Selenium will do it this way (but selenium is synchronus - this wont work with Cypress)
        // const firstForm = cy.contains('nb-card', 'Using the Grid')
        // const secondForm = cy.contains('nb-card', 'Basic form')
        // firstForm.find('[for="inputEmail1"]').should('contain', 'Email')
        // firstForm.find('[for= "inputPassword2"]').should('contain', 'Password')
        // secondForm.find('[for="exampleInputEmail1"]').should('contain', 'Email')

        // * The Cypress way (which is asynchronus - Using a Promise)
        // The parameter "firstForm" becomes a JQuery method instead of a Cypress method.
        // JQuery will require the "expect" whereas Cypress allows the "should" assertion
        cy.contains('nb-card', 'Using the Grid').then(firstForm => {
            const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text()
            const passwordLabelFirst = firstForm.find('[for= "inputPassword2"]').text()
            expect(emailLabelFirst).to.equal('Email')           // Chai assertion
            expect(passwordLabelFirst).to.equal('Password')     // Chai assertion

            // Now compare text on one form with the text on another form
            // This obviously uses a nested function.
            cy.contains('nb-card', 'Basic form').then(secondForm => {
                const passwordLabelSecond = secondForm.find('[for="exampleInputPassword1"]').text()
                expect(passwordLabelFirst).to.equal(passwordLabelSecond)    //Chai Assertion

                // To stay within the Cypress functions we can use the "wrap"
                // This will accomplish the same effect as the "expect" of JQuery
                cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password')
            })
        })

    })

    it('Invoke command', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // * Three ways to retrieve text
        //1 - using the should assertion
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        //2 - using a promise with a Chai "expect" assertion
        cy.get('[for="exampleInputEmail1"]').then(label => {
            expect(label.text()).to.equal('Email address')
        })

        //3 - using a promise with 'invoke' (Cypress function)
        //    this way does NOT need the additional "text()" method as found in #2 above
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal('Email address')
        })

        cy.contains('nb-card', 'Basic form')
            .find('nb-checkbox')
            .click()
            .find('.custom-checkbox')
            .invoke('attr', 'class')
            // .should('contain', 'checked')
            .then(classValue => {
                expect(classValue).to.contain('checked')    // same result as the should in the previous line
            }
        )
    })

    it('Assert property value', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker')
            .find('input')
            .then(input => {
                cy.wrap(input).click()     // Since we cannot click on a JQuery element we must "wrap" it
                cy.get('nb-calendar-day-picker').contains('17').click()
                cy.wrap(input).invoke('prop', 'value').should('contain', '17')

            })
    })

    it('Radio Button', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layout').click()

        cy.contains('nb-card', 'Using the Grid')
            .find('[type="radio"]')
            .then(radioButtons => {
                cy.wrap(radioButtons)
                    .first()                        // sane as index = 0
                    .check({ force: true })         // ignores the "hidden" value and execute the check action
                    .should('be.checked')
                
                cy.wrap(radioButtons)
                    .eq(1)                          // uses the index value
                    .check({ force: true })
                
                cy.wrap(radioButtons)
                    .eq(0)
                    .should('not.be.checked')
                
                cy.wrap(radioButtons)
                    .eq(2)
                    .should('be.disabled')
            })
    })

    it('Check Box', () => {

        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        // cy.get('[type="checkbox"]').check({ force: true })       // Sets ALL checkbox to status of "checked"
        cy.get('[type="checkbox"]').eq(0).click({ force: true })    // Must use "click" to "uncheck" a box
        cy.get('[type="checkbox"]').eq(0).check({ force: true })    // "Recheck" the box
    })

    it.only('Lists and Dropdowns', () => {
        cy.visit('/')

        //1 - Initial process to verify that an item has been checked in a dropdown list
        // cy.get('nav nb-select').click()
        // cy.get('.options-list').contains('Dark').click()
        // cy.get('nav nb-select').should('contain', 'Dark')
        // cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')

        //2 - Now lets do it using iteration
        cy.get('nav nb-select').then(dropdown => {
            cy.wrap(dropdown).click()
            cy.get('.options-list nb-option')  // returns all available options
                .each((listItem, index) => {
                    const itemText = listItem.text().trim()

                    const colors = {
                        "Light": "rgb(255, 255, 255)",
                        "Dark": "rgb(34, 43, 69)",
                        "Cosmic": "rgb(50, 50, 89)",
                        "Corporate": "rgb(255, 255, 255)"
                    }

                    cy.wrap(listItem).click()  // Click on the current indexed listItem
                    cy.wrap(dropdown).should('contain', itemText)   // Verify that the dropdown field now has the chosen text
                    cy.get('nb-layout-header nav')
                        .should('have.css', 'background-color', colors[itemText]) // Verify the backround using a variable
                    if (index < 3) {
                        cy.wrap(dropdown).click() // Reclick on the dropdown so that the list becomes available in the Dom
                    }
                })
        })
    })
})
