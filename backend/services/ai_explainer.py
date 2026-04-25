import os
import requests

def load_env():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    if "=" in line:
                        k, v = line.split("=", 1)
                        os.environ[k.strip()] = v.strip()

def generate_llm_explanation(text, score, level, indicators):
    load_env()
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return ""

    prompt = f"""
You are a bias analysis assistant.

Explain WHY the following article is classified as:

Bias Level: {level}
Bias Score: {score}

Indicators:
{indicators}

Article:
{text}

RULES:
- Use ONLY the given article content
- Refer ONLY to provided indicators
- DO NOT exaggerate the bias level
- Keep explanation aligned with the score
- Keep output concise (2-3 sentences)
"""
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 150
    }

    try:
        # Timeout set to max 2 seconds as required
        response = requests.post(url, headers=headers, json=payload, timeout=2.0)
        if response.status_code == 200:
            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
            # Strip extra formatting from LLM output
            content = content.replace("**", "").replace("*", "").replace("_", "")
            return content
        else:
            return ""
    except Exception:
        return ""
