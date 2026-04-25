import os
import requests
from services.ai_explainer import load_env

load_env()
api_key = os.environ.get("GROQ_API_KEY")
print("API KEY:", "Found" if api_key else "Not Found")

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
payload = {
    "model": "llama-3.3-70b-versatile",
    "messages": [
        {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.3,
    "max_tokens": 150
}

try:
    response = requests.post(url, headers=headers, json=payload, timeout=2.0)
    print("Status:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Error:", e)
