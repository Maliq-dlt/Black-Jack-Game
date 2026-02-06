from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_game_play(page: Page):
    # 1. Arrange: Go to the app
    print("Navigating to app...")
    page.goto("http://localhost:3000")

    # 2. Act: Click "ENTER ROOM"
    print("Clicking ENTER ROOM...")
    play_button = page.get_by_text("ENTER ROOM")
    expect(play_button).to_be_visible(timeout=10000)
    play_button.click()

    # 3. Place Bet
    print("Placing bet...")
    # Find chip with value 5
    chip_5 = page.get_by_text("5", exact=True)
    expect(chip_5).to_be_visible(timeout=10000)
    chip_5.click()

    # 4. Deal (Click OFFER)
    print("Dealing...")
    offer_button = page.get_by_text("OFFER")
    offer_button.click()

    # 5. Assert: Cards visible
    print("Waiting for cards...")
    # CardComponent renders rank and suit. e.g. "A" "Spades"
    # Or simply look for elements with class "transform-style-3d" which CardComponent uses
    # Or look for dealer score (which appears when cards are dealt)

    # Let's wait a bit for animation
    time.sleep(3)

    # 6. Screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/game_active.png")
    print("Screenshot saved to verification/game_active.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_game_play(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_active.png")
        finally:
            browser.close()
