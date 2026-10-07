import { expect, test } from '@playwright/test'

const email = process.env.E2E_ADMIN_EMAIL
const password = process.env.E2E_ADMIN_PASSWORD

test('entra al admin, abre proyectos y sale', async ({ page }) => {
  test.skip(
    !email || !password,
    'Definir E2E_ADMIN_EMAIL y E2E_ADMIN_PASSWORD fuera del repositorio.',
  )

  await page.goto('/admin/login')
  await page.getByLabel('Correo').fill(email ?? '')
  await page.getByLabel('Contraseña').fill(password ?? '')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)

  await page.getByRole('link', { name: 'Proyectos' }).click()
  await expect(page).toHaveURL(/\/admin\/projects$/)
  await page.getByRole('button', { name: 'Salir' }).click()
  await expect(page).toHaveURL(/\/admin\/login$/)
})
