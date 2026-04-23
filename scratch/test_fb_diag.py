import firebase_admin
from firebase_admin import credentials, firestore
import os

def test_firebase():
    print("Checking Firebase connection...")
    try:
        if not firebase_admin._apps:
            key_path = os.path.join(os.getcwd(), "backend", "serviceAccountKey.json")
            if os.path.exists(key_path):
                print(f"Found key at {key_path}")
                cred = credentials.Certificate(key_path)
                firebase_admin.initialize_app(cred)
            else:
                print("No key found, trying default credentials...")
                firebase_admin.initialize_app()
        
        db = firestore.client()
        print("Attempting to read from regional_bias...")
        # Use a very short timeout if possible (firestore doesn't have a simple timeout on get)
        docs = db.collection("regional_bias").limit(1).get()
        print(f"Success! Found {len(docs)} docs.")
    except Exception as e:
        print(f"Firebase test failed: {e}")

if __name__ == "__main__":
    test_firebase()
