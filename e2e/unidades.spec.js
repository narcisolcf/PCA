// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Gestão de Unidades', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/unidades'); // Assumindo rota /unidades
    });

    test('deve criar uma nova unidade', async ({ page }) => {
        // Implicitamente valida:
        // 1. Hook useUnidades (create)
        // 2. Interação com Modal

        // Clicar em Nova Unidade
        await page.getByText('Nova Unidade', { exact: false }).click();

        // Preencher formulário
        const timestamp = Date.now();
        const nomeUnidade = `Unidade de Teste E2E ${timestamp}`;

        await page.getByLabel('Nome da Unidade *').fill(nomeUnidade);
        await page.getByLabel('Sigla').fill(`UT${timestamp}`.substring(0, 10));
        await page.getByLabel('Responsável').fill('QA Automation');
        await page.getByLabel('E-mail').fill('qa@teste.com');

        // Salvar
        await page.getByRole('button', { name: 'Criar Unidade' }).click();

        // Verificar se aparece na lista
        await page.reload();
        await expect(page.getByText(nomeUnidade)).toBeVisible();
    });
});
