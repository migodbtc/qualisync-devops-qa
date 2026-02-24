import requests


def test_index_endpoint():
    response = requests.get("http://127.0.0.1:5821")
    print(response.text)
    assert response.status_code == 200, "Expected 200 OK"