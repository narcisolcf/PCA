// @ts-check
import { test, expect } from '@playwright/test';


test.describe('Gestão de Demandas', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/demandas');
    });

    test('deve criar uma nova demanda com sucesso', async ({ page }) => {
        const timestamp = Date.now();
        const itemName = `Notebook Gamer ${timestamp}`;

        // Clicar em Nova Demanda
        await page.getByText('Nova Demanda', { exact: false }).click();

        // Preencher formulário
        await page.getByLabel('Item / Serviço *').fill(itemName);
        await page.getByLabel('Descrição Detalhada').fill('Notebook para testes automatizados de alta performance');
        await page.getByLabel('Justificativa').fill('Necessário para rodar testes E2E');

        // Selecionar Unidade
        const unidadeSelect = page.locator('select[name="unidade_id"]');
        if (await unidadeSelect.isVisible()) {
            await expect(async () => {
                const count = await unidadeSelect.locator('option').count();
                expect(count).toBeGreaterThan(1);
            }).toPass({ timeout: 10000 });

            await unidadeSelect.selectOption({ index: 1 });
        }

        await page.getByLabel('Quantidade *').fill('1');
        await page.getByLabel('Valor Unitário (R$) *').fill('15000');
        await page.getByLabel('Data Prevista').fill('2025-12-31');

        // Salvar
        await page.getByRole('button', { name: 'Criar Demanda' }).click();

        // Check for validation errors
        const errorMsgs = page.locator('form p.text-red-600');
        if (await errorMsgs.count() > 0) {
            const errors = await errorMsgs.allTextContents();
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }

        // Check if modal closes
        await expect(page.getByRole('dialog')).toBeHidden({ timeout: 5000 });

        // Search for the created item
        await page.getByPlaceholder('Buscar', { exact: false }).fill(itemName);
        await page.waitForTimeout(1000); // Wait for filter

        // Check visibility (use first() to handle potential duplicates or mobile/desktop views)
        await expect(page.getByText(itemName).first()).toBeVisible();
    });
});
