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
        
        # -> Hacer clic en el botón 'Agregar al carrito' de la tarjeta 'Kubernetes Cluster Overview' y luego abrir el 'Carrito'.
        # Agregar al carrito button
        elem = page.get_by_role("button", name="Agregar Kubernetes Cluster")
        await elem.click(timeout=10000)
        
        # -> Hacer clic en el botón 'Agregar al carrito' de la tarjeta 'Kubernetes Cluster Overview' y luego abrir el 'Carrito'.
        # Carrito ( 0 ) link
        elem = page.get_by_role("link", name="Carrito, 1 artículo")
        await elem.click(timeout=10000)
        
        # -> Click the 'Pagar con Stripe' button to start the Stripe checkout flow.
        # Pagar con Stripe button
        elem = page.get_by_test_id("btn-pagar")
        await elem.click(timeout=10000)
        
        # -> Fill the 'Email' and card fields (Card number, Expiration, CVC) and click the 'Pay' button to submit the Stripe Checkout form.
        # email@example.com text field
        elem = page.get_by_role("textbox", name="Email")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("buyer@example.com")
        
        # -> Fill the 'Email' and card fields (Card number, Expiration, CVC) and click the 'Pay' button to submit the Stripe Checkout form.
        # Card number text field
        elem = page.get_by_role("textbox", name="Card number")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("4242 4242 4242 4242")
        
        # -> Fill the 'Email' and card fields (Card number, Expiration, CVC) and click the 'Pay' button to submit the Stripe Checkout form.
        # Expiration text field
        elem = page.get_by_role("textbox", name="Expiration")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("12 / 34")
        
        # -> Fill the 'Email' and card fields (Card number, Expiration, CVC) and click the 'Pay' button to submit the Stripe Checkout form.
        # Credit or debit card CVC/CVV text field
        elem = page.get_by_role("textbox", name="Credit or debit card CVC/CVV")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("123")
        
        # -> Fill the 'Email' and card fields (Card number, Expiration, CVC) and click the 'Pay' button to submit the Stripe Checkout form.
        # Pay Processing button
        elem = page.get_by_test_id("hosted-payment-submit-button")
        await elem.click(timeout=10000)
        
        # -> Fill the 'Cardholder name' field (Full name on card) and click the 'Pay' button to submit the Stripe Checkout form.
        # Full name on card text field
        elem = page.get_by_role("textbox", name="Cardholder name")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Buyer Example")
        
        # -> Fill the 'Cardholder name' field (Full name on card) and click the 'Pay' button to submit the Stripe Checkout form.
        # Pay Processing button
        elem = page.get_by_test_id("hosted-payment-submit-button")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The browser reached the post-checkout success page (/exito).
        # Assert-outcome: passed
        # Assert: The page URL contains '/exito', indicating the success page was reached.
        await expect(page).to_have_url(re.compile("/exito"), timeout=15000), "The page URL contains '/exito', indicating the success page was reached."
        
        # --> A download link for the purchased template 'Kubernetes Cluster Overview' is visible.
        # Assert-outcome: passed
        # Assert: The download link shows the label 'Descargar Kubernetes Cluster Overview'.
        await expect(page.get_by_role("listitem").nth(0)).to_contain_text("Descargar Kubernetes Cluster Overview", timeout=15000), "The download link shows the label 'Descargar Kubernetes Cluster Overview'."
        
        # --> The site header indicates the cart is empty (0 items).
        # Assert-outcome: passed
        # Assert: The header cart link's aria-label shows 'Carrito, 0 artículos', indicating an empty cart.
        await expect(page.get_by_role("link", name="Carrito, 0 artículos").nth(0)).to_have_attribute("aria-label", "Carrito, 0 art\u00edculos", timeout=15000), "The header cart link's aria-label shows 'Carrito, 0 art\u00edculos', indicating an empty cart."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    