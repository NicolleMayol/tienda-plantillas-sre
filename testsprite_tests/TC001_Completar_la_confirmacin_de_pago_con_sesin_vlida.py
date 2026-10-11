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
        
        # -> Click the 'Agregar al carrito' button for the 'Kubernetes Cluster Overview' product to add one template to the cart.
        # Agregar al carrito button
        elem = page.get_by_role("button", name="Agregar Kubernetes Cluster")
        await elem.click(timeout=10000)
        
        # -> Open the 'Carrito' page by clicking the 'Carrito' button in the header to view the cart and start checkout.
        # Carrito ( 1 ) link
        elem = page.get_by_role("link", name="Carrito, 1 artículos")
        await elem.click(timeout=10000)
        
        # -> Click the 'Pagar con Stripe' button to start the Stripe checkout flow.
        # Pagar con Stripe button
        elem = page.get_by_test_id("btn-pagar")
        await elem.click(timeout=10000)
        
        # -> Fill the Email and card fields and click the 'Pay' button to submit the payment.
        # email@example.com text field
        elem = page.get_by_role("textbox", name="Email")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("test@example.com")
        
        # -> Fill the Email and card fields and click the 'Pay' button to submit the payment.
        # Card number text field
        elem = page.get_by_role("textbox", name="Card number")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("4242 4242 4242 4242")
        
        # -> Fill the Email and card fields and click the 'Pay' button to submit the payment.
        # Expiration text field
        elem = page.get_by_role("textbox", name="Expiration")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("12 / 34")
        
        # -> Fill the Email and card fields and click the 'Pay' button to submit the payment.
        # Credit or debit card CVC/CVV text field
        elem = page.get_by_role("textbox", name="Credit or debit card CVC/CVV")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("123")
        
        # -> Fill the Email and card fields and click the 'Pay' button to submit the payment.
        # Pay Processing button
        elem = page.get_by_test_id("hosted-payment-submit-button")
        await elem.click(timeout=10000)
        
        # -> Rellenar el campo 'Cardholder name' con 'Test User' y hacer clic en el botón 'Pay' para completar el pago.
        # Full name on card text field
        elem = page.get_by_role("textbox", name="Cardholder name")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test User")
        
        # -> Rellenar el campo 'Cardholder name' con 'Test User' y hacer clic en el botón 'Pay' para completar el pago.
        # Pay Processing button
        elem = page.get_by_test_id("hosted-payment-submit-button")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The success page was reached (URL contains a session_id query) indicating checkout completed.
        # Assert-outcome: passed
        # Assert: The page URL contains /exito?session_id= showing the success page was loaded.
        await expect(page).to_have_url(re.compile("/exito\\?session_id="), timeout=15000), "The page URL contains /exito?session_id= showing the success page was loaded."
        
        # --> A download link for the purchased template 'Kubernetes Cluster Overview' is visible on the success page.
        # Assert-outcome: passed
        # Assert: The download link for 'Kubernetes Cluster Overview' is visible on the page.
        await expect(page.get_by_role("listitem").nth(0)).to_contain_text("Kubernetes Cluster Overview", timeout=15000), "The download link for 'Kubernetes Cluster Overview' is visible on the page."
        
        # --> The header shows the cart is empty (0 items) after purchase.
        # Assert-outcome: passed
        # Assert: The header cart's aria-label indicates there are 0 items.
        await expect(page.get_by_role("link", name="Carrito, 0 artículos").nth(0)).to_have_attribute("aria-label", "Carrito, 0 art\u00edculos", timeout=15000), "The header cart's aria-label indicates there are 0 items."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    