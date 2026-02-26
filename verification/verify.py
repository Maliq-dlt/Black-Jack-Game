import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000", timeout=60000)

            print("Waiting for game to load...")
            page.wait_for_selector("text=ROYALE", timeout=60000)

            page.screenshot(path="verification/landing_screen.png")
            print("Screenshot saved to verification/landing_screen.png")

            print("Starting game...")
            page.click("text=ENTER ROOM")

            time.sleep(5)

            page.screenshot(path="verification/game_screen.png")
            print("Screenshot saved to verification/game_screen.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
