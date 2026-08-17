import urllib.request
import json
import urllib.error

url = 'http://localhost:8000/auth/register'
data = {
    'name': 'Sai Teja',
    'email': 'teja36472@gmial.com',
    'password': 'password123',
    'role': 'candidate'
}

req = urllib.request.Request(
    url, 
    data=json.dumps(data).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)

try:
    response = urllib.request.urlopen(req)
    print("STATUS:", response.status)
    print("BODY:", response.read().decode())
except urllib.error.HTTPError as e:
    print("HTTP ERROR CODE:", e.code)
    print("RESPONSE BODY:", e.read().decode())
except Exception as e:
    print("GENERAL ERROR:", str(e))
