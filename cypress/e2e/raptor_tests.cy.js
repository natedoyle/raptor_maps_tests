// ideally these would be in a configuration file for parameterization
const assert_text = 'Warning: Use https://docs.raptormaps.com/v3.0/reference#search_solar_farms_by_name\nEndpoint to retrieve all solar farms that you have access to view in a particular organization'
const auth_token = 'WyIyMDA3IiwiJDUkcm91bmRzPTUzNTAwMCQ4czdkZ0lyZkxRalN1TXlkJHZJbXJPMzFVdERYZDFlTDRZTmdDaHJwUjBhRmIydW0vampvQWYzTE1iUzYiXQ.Yk-w_w.dGRb3xdsG6TgzOTHYdhh0eSmHWk'
const org_id = '228'
let farm_uuid = ''

// visit the careers page and assert the top nav is highlighted orange to insure we're on the correct page.
describe('Visit Careers Page', () => {
  it('Checks the career page for location indicator', () => {
    cy.visit('/careers')
    cy.get('#menu-item-6784 > a').should('have.css', 'color', 'rgb(241, 143, 1)')
  });
})

// the navbar dropdown has a direct link to the technology page which is a confusing UX.
// 
describe('Navigate to Technology Page on Navbar Link', () => {
  it('Clicks on top level nav bar link that heads drop down', () => {
    // adding intercept to ensure page load before element seek
    cy.intercept({
      method: 'GET',
      path: '/rmtechnology'
    }).as('techURL')
    cy.visit('/careers')
    cy.get('#menu-item-6777 > a')
      .first()
      .click()
    cy.wait('@techURL')
    cy.get('#tech-api h1')
      .should('have.text', 'API Integration')
      .scrollIntoView()
    cy.get('#tech-api div[class="et_pb_text_inner"] span')
      .parent('p')
      .invoke('text')
      .should('contain', 'Raptor Maps')
      cy.get('#tech-api div.et_pb_button_module_wrapper')
      .should('contain', 'KNOWLEDGE HUB')   
    cy.get('#tech-api div.et_pb_button_module_wrapper a')
      .should('have.attr', 'href', 'https://docs.raptormaps.com/reference#reference-getting-started')
    cy.get('#tech-api img.wp-image-5285')
      .should('be.visible')
  });
})

// this is the same test as above but using the actual dropdown option instead of clicking on 
// the url associated with the top level navbar option
describe('Navigate to technology page using dropdown option', () => {
  it('passes', () => {
    cy.intercept({
      method: 'GET',
      path: '/rmtechnology'
    }).as('techURL')
    cy.visit('/careers')
    cy.get('#menu-item-6778 a')
      .first()
      .click({force:true})
    cy.wait('@techURL')
    cy.get('#tech-api h1')
      .should('have.text', 'API Integration')
      .scrollIntoView()
    cy.get('#tech-api div[class="et_pb_text_inner"] span')
      .parent('p')
      .invoke('text')
      .should('contain', 'Raptor Maps')
    cy.get('#tech-api div.et_pb_button_module_wrapper')
      .should('contain', 'KNOWLEDGE HUB')   
    cy.get('#tech-api div.et_pb_button_module_wrapper a')
      .should('have.attr', 'href', 'https://docs.raptormaps.com/reference#reference-getting-started')
    cy.get('#tech-api img.wp-image-5285')
      .should('be.visible')
  });
  

});

describe('Open external knowledge hub from technology page', () => {
  it('opens a new window with knowledge hub as target', () => {
    cy.visit('/rmtechnology')
    cy.get('#tech-api h1')
      .scrollIntoView()
    cy.get('#tech-api div.et_pb_button_module_wrapper a')
      .invoke('removeAttr', 'target')
      .click()
    cy.get('header h1').should('contain', 'Getting Started')
  })
})

describe('validate solar farms api reference page', () => {
  it('checks text on page', () => {
    cy.visit('https://docs.raptormaps.com/reference/reference-getting-started#reference-getting-started')
    // this is a brittle construction. Would probably consider adding some test ids.
    cy.get('div.reference-flyout button.icon-menu')
      .click()
    // this accounts for the smaller size of the window in cypress. Alternatively, use viewport
    // and walk through clicking the higher level element to expose this element
    cy.get('a.Sidebar-link2Dsha-r-GKh2')
      .eq(3)
      .click({force:true})
    cy.get('div.Reference-section header')
      .should('contain', 'Your Request History')
    cy.get('#form-apiv2solarFarms header')
      .should('contain', 'Query Params')
    cy.get('header.APISectionHeader3LN_-QIR0m7x')
      .eq(2)
      .should('contain', 'Responses')
    cy.get('div.headline-container-grid-itemGdPV-VbhShYs h1')
      .should('contain', '/api/v2/solar_farms')
    cy.get('div.markdown-body')
      .first()
      .invoke('text')
      .should('equal', assert_text)
  })
})

describe('validate try it function', () => {
  it('enters data and clicks try it', () => {
    cy.intercept('https://try.readme.io/https://app.raptormaps.com/**')
      .as('tryIt')
    cy.visit('https://docs.raptormaps.com/reference/apiv2solar_farms')
    cy.get('#APIAuth-Authentication-Token')
      .type(auth_token)
    cy.get('#query-apiv2solarFarms_org_id')
      .type(org_id)
    cy.get('button.rm-TryIt')
      .click()
    // I'm sure there's a better way to present this data other than cy.log
    cy.wait('@tryIt')
      .then(({response}) => {
        let farm = JSON.parse(response.body)
        let qa_farm = farm['solar_farms'].find(item => { return item.name === 'Test Postman Routes - QA Team'})
        cy.log(qa_farm['uuid'])
        farm_uuid = qa_farm['uuid']
      })
  })
})

// this is not a very good test since it relies on data gathered from the previous test.
// I wanted to show I was retrieving the UUID in a manner other than cy.log
describe('extra credit with uuid', () => {
  it('calls farm by uuid', () => {
    cy.visit('https://docs.raptormaps.com/reference/apiv2solar_farmssolar_farm_uuid')
    cy.get('#APIAuth-Authentication-Token')
      .type(auth_token)
    cy.get('#query-apiv2solarFarmssolarFarmUuid_org_id')
      .type(org_id)
    cy.get('#path-apiv2solarFarmssolarFarmUuid_solar_farm_uuid')
      .type(farm_uuid)
    cy.get('button.rm-TryIt')
      .click()
  })
})