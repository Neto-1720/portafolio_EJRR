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

  await page.getByRole('link', { name: 'SaaS Logistics Platform' }).click()
  await expect(page).toHaveURL(/\/work\/saas-logistics-platform$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'SaaS Logistics Platform',
  )

  await page.getByRole('link', { name: 'Open Demo' }).click()
  await expect(page).toHaveURL(/\/demo\/logistics$/)
  await page.getByRole('link', { name: 'Back to case study' }).click()
  await expect(page).toHaveURL(/\/work\/saas-logistics-platform$/)
})

test('envía el formulario de contacto', async ({ page }) => {
  await page.goto('/contact')
  await page.getByLabel('Nombre').fill('Ana Pérez')
  await page.getByLabel('Correo').fill('ana@example.test')
  await page
    .getByLabel('Mensaje')
    .fill('Mensaje de prueba del flujo de contacto del portafolio.')
  await page.getByRole('button', { name: 'Enviar mensaje' }).click()
  await expect(
    page.getByText('Mensaje enviado correctamente. Gracias por contactarme.'),
  ).toBeVisible()
})
