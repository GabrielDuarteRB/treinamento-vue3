const APP_URL = process.env.APP_URL || 'http://localhost:8080'

describe('Credencials', () => {
    it('Should generate an api_key', () => {
        cy.visit(APP_URL)

        cy.get('#header-login-account-button').click()
        cy.get('#modal-login')

        cy.get('#email-field').type('igor@igor.me')
        cy.get('#password-field').type('1234')
        cy.get('#submit-button').click()

        cy.wait(4000)
        cy.visit(`${APP_URL}/credencials`)
        cy.wait(2000)

        const oldApiKey = cy.get('#apiKey').invoke('text')
        cy.get('#generate-apiKey').click()
        cy.wait(2000)
        const newApiKey = cy.get('#apiKey').invoke('text')

        expect(oldApiKey).to.not.equal(newApiKey)
    })
})