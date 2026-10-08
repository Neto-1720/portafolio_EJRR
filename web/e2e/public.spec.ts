import { expect, test } from '@playwright/test'

test('recorre home, work, un case study y una demo', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { level: 1, name: /Ernesto/ }),
  ).toBeVisible()

  await page
    .getByRole('navigation', { name: 'Principal' })
    .getByRole('link', { name: 'Work' })
    .click()
  await expect(page).toHaveURL(/\/work$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Proyectos',
  )

  await page.getByRole('link', { name: 'Customer Support Desk' }).click()
  await expect(page).toHaveURL(/\/work\/customer-support-desk$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Customer Support Desk',
  )

  await page.getByRole('link', { name: 'Open Demo' }).first().click()
  await expect(page).toHaveURL(/\/demo\/support$/)
  await page.getByRole('link', { name: 'Back to case study' }).click()
  await expect(page).toHaveURL(/\/work\/customer-support-desk$/)
})

test('contacto muestra el aviso y no envía mensajes', async ({ page }) => {
  const contactPosts: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('/api/contact')) {
      contactPosts.push(request.url())
    }
  })

  await page.goto('/contact')
  await expect(
    page.getByText(
      'Contacto temporalmente no disponible. Puedes contactarme por LinkedIn.',
    ),
  ).toBeVisible()
  await expect(page.getByLabel('Mensaje')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Enviar mensaje' }),
  ).toHaveCount(0)
  expect(contactPosts).toEqual([])
})
