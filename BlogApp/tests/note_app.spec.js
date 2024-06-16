const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper.js')
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
        data: {
          name: 'Maksim Yin',
          username: 'maksim',
          password: 'yin'
        }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Login').first()).toBeVisible()

  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      helper.logIn(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Blogs')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      helper.logIn(page, 'Maksim', 'salainen')

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({page, request}) => {
      helper.logIn(page, 'mluukkai', 'salainen')
    })
    test('a new blog can be created', async ({page}) => {
     helper.createBlog(page, "The journey begins", 'Maksim Yin', 'https://www.MaksimQuotes.com', true)
     await expect(page.getByText('The journey begins')).toBeVisible()
    })
    test('blogs can be liked', async ({page}) => {
      helper.createBlog(page, "The journey begins", 'Maksim Yin', 'https://www.MaksimQuotes.com', true)
      await page.getByRole('button', {name: 'view'}).click()
      await page.getByRole('button', {name: 'like'}).click()
      await page.getByRole('button', {name: 'view'}).click()
      await expect(page.getByText('likes: 1')).toBeVisible()
    })
    test('blogs can be deleted by user who created them', async ({page}) => {
      helper.createBlog(page, "The journey begins", 'Maksim Yin', 'https://www.MaksimQuotes.com', true)
      await page.getByRole('button', {name: 'view'}).click()
      await page.getByRole('button', {name: 'Delete'}).click()
      await expect(page.getByText('The journey begins')).not.toBeVisible()
    })
    test('only the user who created the blogs can see the delete button', async ({page}) => {
      helper.createBlog(page, "The journey begins", 'Maksim Yin', 'https://www.MaksimQuotes.com' ,true)
      await page.getByRole('button', {name: 'view'}).click()
      await page.getByRole('button', {name: 'Logout'}).click()
      helper.logIn(page, 'maksim', 'yini')
      await page.getByRole('button', {name: 'view'}).click()
      await expect(page.getByRole('button', {name: 'Delete'})).not.toBeVisible()
    })
    test('blogs are arranged in the order according to the likes, highest to lowest', async ({page}) => {
      helper.createBlog(page, "The journey begins", 'Maksim Yin', 'https://www.Maksim.com', true)
      await page.getByText('The journey begins Maksim Yin').waitFor()
      helper.createBlog(page, "The journey is in progress", 'Bob Govern', 'https://www.Bob.com', true)
      await page.getByText('The journey is in progress Bob Govern').waitFor()
      helper.createBlog(page, "The journey ends", 'J.P. Mingle', 'https://www.J.com', true)
      await page.getByText('The journey ends J.P. Mingle').waitFor()
      await page.getByRole('button', {name: 'view'}).nth(2).click()        
      await page.getByRole('button', {name: 'like'}).click()
      await page.getByRole('button', {name: 'view'}).nth(1).click()        
      await page.getByRole('button', {name: 'like'}).first().click()
      await page.getByRole('button', {name: 'view'}).nth(1).click()        
      await page.getByRole('button', {name: 'like'}).first().click()
      await page.getByRole('button', {name: 'view'}).first().click()        
      await page.getByRole('button', {name: 'like'}).first().click()

      await page.getByRole('button', {name: 'view'}).first().click()
      await expect(page.getByRole('link', { name: 'https://www.Bob.com' })).toBeVisible()
      
      await page.getByRole('button', { name: 'view' }).first().click()
      await expect(page.getByRole('link', { name: 'https://www.J.com' })).toBeVisible() 

      await page.getByRole('button', {name: 'view'}).first().click()
      await expect(page.getByRole('link', { name: 'https://www.Maksim.com' })).toBeVisible() 

    })
  })
})
