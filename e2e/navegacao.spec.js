// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Navegação', () => {
    test('deve navegar entre as páginas principais', async ({ page }) => {
        // Implicitamente valida:
        // 1. React Router
        // 2. Layout Principal (Header/Sidebar)

        await page.goto('/');
        await expect(page).toHaveURL('http://localhost:5173/');

        // Navegar para Demandas
        await page.getByRole('link', { name: 'Demandas' }).click();
        await expect(page).toHaveURL(/.*demandas/);
        await expect(page.getByText('Nova Demanda', { exact: false })).toBeVisible();

        // Navegar para Unidades (se houver link no menu)
        // Se não houver link direto, tenta navegar via URL ou outro menu
        // Assumindo que existe um link "Unidades" ou "Configurações" -> "Unidades"
        const linkUnidades = page.getByRole('link', { name: 'Unidades' });
        if (await linkUnidades.isVisible()) {
            await linkUnidades.click();
            await expect(page).toHaveURL(/.*unidades/);
        }

        // Navegar para Relatórios
        const linkRelatorios = page.getByRole('link', { name: 'Relatórios' });
        if (await linkRelatorios.isVisible()) {
            await linkRelatorios.click();
            await expect(page).toHaveURL(/.*relatorios/);
        }

        // Voltar para Dashboard
        await page.getByRole('link', { name: 'Dashboard' }).click();
        await expect(page).toHaveURL('http://localhost:5173/');
    });
});
