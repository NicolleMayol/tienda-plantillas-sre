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
        
        # -> Click the 'Agregar al carrito' button for 'Kubernetes Cluster Overview', then open the 'Carrito' page.
        # Agregar al carrito button
        elem = page.get_by_role("button", name="Agregar Kubernetes Cluster")
        await elem.click(timeout=10000)
        
        # -> Click the 'Agregar al carrito' button for 'Kubernetes Cluster Overview', then open the 'Carrito' page.
        # Carrito ( 0 ) link
        elem = page.get_by_role("link", name="Carrito, 1 artículo")
        await elem.click(timeout=10000)
        
        # -> Click the 'Pagar con Stripe' button to open the hosted Stripe Checkout page.
        # Pagar con Stripe button
        elem = page.get_by_test_id("btn-pagar")
        await elem.click(timeout=10000)
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiration '12/34', CVC '123', and cardholder name 'Test User'.
        # email@example.com text field
        elem = page.get_by_role("textbox", name="Email")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("test@example.com")
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiration '12/34', CVC '123', and cardholder name 'Test User'.
        # Card number text field
        elem = page.get_by_role("textbox", name="Card number")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("4242 4242 4242 4242")
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiration '12/34', CVC '123', and cardholder name 'Test User'.
        # Expiration text field
        elem = page.get_by_role("textbox", name="Expiration")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("12/34")
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiration '12/34', CVC '123', and cardholder name 'Test User'.
        # Credit or debit card CVC/CVV text field
        elem = page.get_by_role("textbox", name="Credit or debit card CVC/CVV")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("123")
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiration '12/34', CVC '123', and cardholder name 'Test User'.
        # Full name on card text field
        elem = page.get_by_role("textbox", name="Cardholder name")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test User")
        
        # -> Click the 'Pay' button to submit the Stripe Checkout payment.
        # Pay Processing button
        elem = page.get_by_test_id("hosted-payment-submit-button")
        await elem.click(timeout=10000)
        
        # -> Open the Cart page ('Carrito') and verify the cart counter shows '(0)'.
        await page.goto("http://localhost:3002/carrito")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # --> Assertions to verify final state
        
        # --> The app redirected to a URL containing '/exito?session_id=' after completing checkout.
        # Assert-outcome: passed
        # Assert: Verifies the browser was redirected to the success URL with a session_id parameter.
        await expect(page).to_have_url(re.compile("/exito\\?session_id="), timeout=15000), "Verifies the browser was redirected to the success URL with a session_id parameter."
        
        # --> After returning to /carrito the header cart counter shows zero items ('Carrito (0)').
        # Assert-outcome: passed
        # Assert: Verifies the header cart aria-label indicates there are 0 items in the cart.
        await expect(page.get_by_role("link", name="Carrito, 0 artículos").nth(0)).to_have_attribute("aria-label", "Carrito, 0 art\u00edculos", timeout=15000), "Verifies the header cart aria-label indicates there are 0 items in the cart."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    