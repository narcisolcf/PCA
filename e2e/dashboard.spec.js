// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('deve exibir o card de Valor Total com valor positivo', async ({ page }) => {
        // Implicitamente valida:
        // 1. Conexão com Supabase (busca de dados)
        // 2. Hook useData/useDemandas (cálculo de totais)

        // Procura pelo card de Valor Total
        const cardTitle = page.getByText('Valor Total', { exact: false });
        await expect(cardTitle).toBeVisible();

        // Verifica se o valor não é zero ou vazio
        // Assumindo que o valor está próximo ao título ou em um container
        // Vamos buscar por um texto que contenha "R$" na página, que deve ser o valor total
        const valorTotal = page.locator('h3, h2, div').filter({ hasText: 'R$' }).first();
        await expect(valorTotal).toBeVisible();

        const texto = await valorTotal.textContent();
        expect(texto).not.toBe('R$ 0,00');
        console.log(`Valor Total encontrado: ${texto}`);
    });

    test('deve renderizar os gráficos', async ({ page }) => {
        // Implicitamente valida:
        // 1. Biblioteca de gráficos (Chart.js/Recharts)
        // 2. Processamento de dados para os gráficos

        // Verifica gráfico de Pizza (Distribuição por Status)
        await expect(page.getByText('Distribuição por Status')).toBeVisible();
        // Verifica presença de canvas ou svg
        const canvas = page.locator('canvas').first();
        await expect(canvas).toBeVisible();

        // Verifica se há pelo menos um gráfico renderizado
        const charts = await page.locator('canvas').count();
        expect(charts).toBeGreaterThan(0);
    });
});
