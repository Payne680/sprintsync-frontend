/// <reference types="cypress" />

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('redirects unauthenticated user from /dashboard to /login', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/login')
  })

  it('allows login with demo credentials and access to dashboard', () => {
    cy.visit('/login')
    cy.get('input[type=email]').type('test@example.com')
    cy.get('input[type=password]').type('password123')
    cy.get('button').contains(/login/i).click()
    cy.url().should('include', '/dashboard')
    cy.contains('Task').should('exist')
  })

  it('logs out and redirects to login', () => {
    // Login first
    cy.visit('/login')
    cy.get('input[type=email]').type('test@example.com')
    cy.get('input[type=password]').type('password123')
    cy.get('button').contains(/login/i).click()
    cy.url().should('include', '/dashboard')
    // Simulate logout (assumes a logout button exists)
    cy.get('button, a')
      .contains(/logout/i)
      .click({ force: true })
    cy.url().should('include', '/login')
  })
})
