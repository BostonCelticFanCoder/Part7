const logIn = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', {name: 'login'}).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', {name: 'new blog'}).click()
    await page.getByPlaceholder('Define Title Here').fill(title)
    await page.getByPlaceholder('Define Author Here').fill(author)
    await page.getByPlaceholder('Define URL Here').fill(url)
    await page.getByRole('button', {name: 'create'}).click()
}

export { logIn, createBlog }