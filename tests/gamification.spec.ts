import { test, expect } from '@playwright/test';

test.describe('Gamification Features', () => {

    test('Guess the Penalty Game loads and functions', async ({ page }) => {
        await page.goto('/games/guess-the-penalty');
        await page.waitForLoadState('networkidle');

        // Check title
        await expect(page.locator('text=Guess the Penalty')).toBeVisible();

        // Check that option buttons are present (there are 4 options in the grid)
        const optionButtons = page.locator('button').filter({ hasText: /Offside|False Start|Holding|Illegal Motion|Encroachment|Neutral Zone|Intentional Grounding|Pass Interference|Roughing|Face Mask|Horse Collar|Unnecessary Roughness|Blocking in the Back|Illegal Hands/ });
        await expect(optionButtons.first()).toBeVisible();

        // Click the first option
        await optionButtons.first().click();

        // Expect feedback (either "TOUCHDOWN! Correct" or "FLAG ON THE PLAY! Incorrect")
        await expect(page.locator('text=TOUCHDOWN').or(page.locator('text=FLAG ON THE PLAY'))).toBeVisible({ timeout: 10000 });
    });

    test('Interactive Playbook loads', async ({ page }) => {
        await page.goto('/features-demo');
        await page.waitForLoadState('networkidle');

        // Scroll to playbook section
        const heading = page.getByRole('heading', { name: '3. Interactive Playbook' });
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();

        // Check for tokens
        await expect(page.locator('text=QB').first()).toBeVisible();
        await expect(page.locator('text=C').first()).toBeVisible();
    });

    test('Coachs Corner Tooltip triggers', async ({ page }) => {
        await page.goto('/features-demo');
        await page.waitForLoadState('networkidle');

        // Find the tooltip trigger - look for the span that contains "pocket"
        const trigger = page.locator('span', { hasText: 'pocket' }).first();
        await trigger.scrollIntoViewIfNeeded();

        // Hover to trigger tooltip
        await trigger.hover();

        // Check for tooltip content using .first() to handle multiple matches
        await expect(page.getByText('The protected area formed by offensive linemen').first()).toBeVisible();
    });

});
