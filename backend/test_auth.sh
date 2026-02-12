# Test auth system
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -d "username=demo@antinotes.com&password=Demo123!" | python -c "import json, sys; print(json.load(sys.stdin)['access_token'])")

echo "Token: $TOKEN"
echo ""

echo "Testing /auth/me endpoint:"
curl http://127.0.0.1:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool
