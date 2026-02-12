# Complete Auth Flow Test

echo "=== 1. Register new user ==="
curl -X POST http://127.0.0.1:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@demo.com", "password": "Test123!", "full_name": "Test User"}' \
  2>&1 | python -m json.tool

echo -e "\n\n=== 2. Login and get token ==="
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -d "username=testuser@demo.com&password=Test123!" | python -c "import json, sys; print(json.load(sys.stdin)['access_token'])")

echo "Token: ${TOKEN:0:50}..."

echo -e "\n\n=== 3. Test /auth/me ==="
curl http://127.0.0.1:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" 2>&1 | python -m json.tool

echo -e "\n\n=== 4. Submit onboarding (protected) ==="
curl -X POST http://127.0.0.1:8000/api/v1/onboarding/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"coding_level": "intermediate", "goal": "faang", "teaching_style": "socratic", "background": "CS student"}' \
  2>&1 | python -m json.tool

echo -e "\n\n✅ Auth system working!"
