try:
    import fastapi
    print("FastAPI: OK")
    import torch
    print("Torch: OK")
    import transformers
    print("Transformers: OK")
    import spacy
    print("SpaCy: OK")
    import feedparser
    print("Feedparser: OK")
    import newspaper
    print("Newspaper3k: OK")
    
    from models.bead_model import predict as p1
    from models.linguistic_model import predict as p2
    from models.framing_model import predict as p3
    print("Models: OK")
    
    from services.bias_engine import analyze_bias
    print("Services: OK")
    
    print("\nAll imports successful!")
except Exception as e:
    print(f"\nImport failed: {e}")
