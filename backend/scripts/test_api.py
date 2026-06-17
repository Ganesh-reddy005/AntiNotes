import requests

BASE_URL = "http://localhost:8000/api/v1"

def test_widgets(slug):
    url = f"{BASE_URL}/roadmap/topics/{slug}/widgets"
    print(f"Testing URL: {url}")
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} widgets.")
            for w in data:
                print(f" - {w['widget_id']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_widgets("functions")
    print("-" * 20)
    test_widgets("architect-revision")
