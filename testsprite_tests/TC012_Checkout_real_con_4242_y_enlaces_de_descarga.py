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
        
        # -> Click the 'Agregar al carrito' button on the 'Kubernetes Cluster Overview' card, then open the 'Carrito' page by clicking the 'Carrito' link.
        # Agregar al carrito button
        elem = page.get_by_role("button", name="Agregar Kubernetes Cluster")
        await elem.click(timeout=10000)
        
        # -> Click the 'Agregar al carrito' button on the 'Kubernetes Cluster Overview' card, then open the 'Carrito' page by clicking the 'Carrito' link.
        # Carrito ( 0 ) link
        elem = page.get_by_role("link", name="Carrito, 1 artículo")
        await elem.click(timeout=10000)
        
        # -> Click the 'Pagar con Stripe' button to start Stripe Checkout.
        # Pagar con Stripe button
        elem = page.get_by_test_id("btn-pagar")
        await elem.click(timeout=10000)
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiry '12 / 34', CVC '123' and click the 'Pay' button.
        # email@example.com text field
        elem = page.get_by_role("textbox", name="Email")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("test@example.com")
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiry '12 / 34', CVC '123' and click the 'Pay' button.
        # Card number text field
        elem = page.get_by_role("textbox", name="Card number")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("4242 4242 4242 4242")
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiry '12 / 34', CVC '123' and click the 'Pay' button.
        # Expiration text field
        elem = page.get_by_role("textbox", name="Expiration")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("12 / 34")
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiry '12 / 34', CVC '123' and click the 'Pay' button.
        # Credit or debit card CVC/CVV text field
        elem = page.get_by_role("textbox", name="Credit or debit card CVC/CVV")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("123")
        
        # -> Fill the Stripe Checkout form: enter email 'test@example.com', card number '4242 4242 4242 4242', expiry '12 / 34', CVC '123' and click the 'Pay' button.
        # Pay Processing button
        elem = page.get_by_test_id("hosted-payment-submit-button")
        await elem.click(timeout=10000)
        
        # -> Fill 'Test User' into the Cardholder name field and click the 'Pay' button to submit the Stripe Checkout.
        # Full name on card text field
        elem = page.get_by_role("textbox", name="Cardholder name")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test User")
        
        # -> Fill 'Test User' into the Cardholder name field and click the 'Pay' button to submit the Stripe Checkout.
        # Pay Processing button
        elem = page.get_by_test_id("hosted-payment-submit-button")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The browser is on the confirmation page and the URL contains a session_id query parameter.
        # Assert-outcome: passed
        # Assert: The URL contains '/exito?session_id='.
        await expect(page).to_have_url(re.compile("/exito\\?session_id="), timeout=15000), "The URL contains '/exito?session_id='."
        
        # --> A 'Descargar' link for the purchased template is visible and points to a .json file.
        # Assert-outcome: passed
        # Assert: The download link's visible text contains 'Descargar'.
        await expect(page.get_by_role("listitem").nth(0)).to_contain_text("Descargar", timeout=15000), "The download link's visible text contains 'Descargar'."
        # Assert-outcome: passed
        # Assert: The download link's href is '/plantillas/kubernetes-cluster-overview.json'.
        await expect(page.get_by_role("link", name="Descargar Kubernetes Cluster").nth(0)).to_have_attribute("href", "/plantillas/kubernetes-cluster-overview.json", timeout=15000), "The download link's href is '/plantillas/kubernetes-cluster-overview.json'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    