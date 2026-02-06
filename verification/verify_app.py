from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to app
        page.goto("http://localhost:3000")

        # Wait for something to load (e.g. "ROYALE ROGUE")
        page.wait_for_selector("text=ROYALE ROGUE")

        # Click "ENTER ROOM" to start game (if on landing screen)
        # Landing screen has "ENTER ROOM" button.
        try:
            page.click("text=ENTER ROOM", timeout=5000)
            page.wait_for_timeout(2000) # Wait for transition
        except:
            print("Could not find ENTER ROOM button, maybe already in game?")

        # Take screenshot of the game table
        page.screenshot(path="verification/verification.png")
        print("Screenshot taken")

        browser.close()

if __name__ == "__main__":
    verify_app()
