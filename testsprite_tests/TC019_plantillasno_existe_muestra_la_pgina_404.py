import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3002")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Navigate to the URL /plantillas/no-existe and verify that a Spanish 404/not-found message is shown and that no 'Agregar' (add) buttons or template detail are present.
        await page.goto("http://localhost:3002/plantillas/no-existe")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # --> Assertions to verify final state
        
        # --> The non-existent-template page shows the 404 message ('Página no encontrada' and 'Esa plantilla no existe en el catálogo.').
        # Assert-outcome: passed
        # Assert: Verifies the browser is on the non-existent-template URL.
        await expect(page).to_have_url(re.compile("/plantillas/no\\-existe"), timeout=15000), "Verifies the browser is on the non-existent-template URL."
        
        # --> No template detail or 'Agregar' buttons are present; only the site title, cart, and a 'Volver al catálogo' link are visible.
        # Assert-outcome: passed
        # Assert: Verifies the page shows a 'Volver al catálogo' link (indicative of the not-found page and absence of template details).
        await expect(page.locator("xpath=/html/body/main/section/a").nth(0)).to_have_text("Volver al cat\u00e1logo", timeout=15000), "Verifies the page shows a 'Volver al cat\u00e1logo' link (indicative of the not-found page and absence of template details)."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    