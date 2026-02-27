from server.main import app


def test_initialization():
    with app.test_client() as client:
        response = client.get("/")
        assert response.status_code == 200
