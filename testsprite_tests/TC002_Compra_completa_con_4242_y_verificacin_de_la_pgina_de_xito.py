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
        
        # -> Click the 'Agregar al carrito' button on the 'Kubernetes Cluster Overview' card, then click the 'Carrito' link to open the cart page.
        # Agregar al carrito button
        elem = page.get_by_role("button", name="Agregar Kubernetes Cluster")
        await elem.click(timeout=10000)
        
        # -> Click the 'Agregar al carrito' button on the 'Kubernetes Cluster Overview' card, then click the 'Carrito' link to open the cart page.
        # Carrito ( 0 ) link
        elem = page.get_by_role("link", name="Carrito, 1 artículo")
        await elem.click(timeout=10000)
        
        # -> Click the 'Pagar con Stripe' button on the cart page
        # Pagar con Stripe button
        elem = page.get_by_test_id("btn-pagar")
        await elem.click(timeout=10000)
        
        # -> Fill the 'Email' field and the card details (Card number, Expiration, CVC, Cardholder name) in the Stripe Checkout form.
        # email@example.com text field
        elem = page.get_by_role("textbox", name="Email")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("test@example.com")
        
        # -> Fill the 'Email' field and the card details (Card number, Expiration, CVC, Cardholder name) in the Stripe Checkout form.
        # Card number text field
        elem = page.get_by_role("textbox", name="Card number")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("4242 4242 4242 4242")
        
        # -> Fill the 'Email' field and the card details (Card number, Expiration, CVC, Cardholder name) in the Stripe Checkout form.
        # Expiration text field
        elem = page.get_by_role("textbox", name="Expiration")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("12 / 34")
        
        # -> Fill the 'Email' field and the card details (Card number, Expiration, CVC, Cardholder name) in the Stripe Checkout form.
        # Credit or debit card CVC/CVV text field
        elem = page.get_by_role("textbox", name="Credit or debit card CVC/CVV")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("123")
        
        # -> Fill the 'Email' field and the card details (Card number, Expiration, CVC, Cardholder name) in the Stripe Checkout form.
        # Full name on card text field
        elem = page.get_by_role("textbox", name="Cardholder name")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test User")
        
        # -> Click the 'Pay' button on the Stripe Checkout page to submit the payment and wait for the success page to load.
        # Pay Processing button
        elem = page.get_by_test_id("hosted-payment-submit-button")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The page URL contains '/exito?session_id=' indicating a successful checkout redirect.
        # Assert-outcome: passed
        # Assert: Verifies the URL contains '/exito?session_id='.
        await expect(page).to_have_url(re.compile("/exito\\?session_id="), timeout=15000), "Verifies the URL contains '/exito?session_id='."
        
        # --> A download link 'Descargar Kubernetes Cluster Overview' is visible on the success page.
        await page.get_by_role("link", name="Descargar Kubernetes Cluster").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: Verifies the 'Descargar Kubernetes Cluster Overview' link is visible.
        await expect(page.get_by_role("link", name="Descargar Kubernetes Cluster").nth(0)).to_be_visible(timeout=15000), "Verifies the 'Descargar Kubernetes Cluster Overview' link is visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    