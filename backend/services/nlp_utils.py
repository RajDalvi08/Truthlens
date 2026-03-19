"""
NLP Utility Service
====================
Provides spaCy-based NER and text splitting utilities.
"""

import spacy
from typing import List

# Load spaCy model once at startup
try:
    nlp = spacy.load("en_core_web_sm", disable=["lemmatizer"])
except Exception:
    # Fallback if model not downloaded (though we should have it)
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm", disable=["lemmatizer"])


def extract_entities(text: str) -> dict:
    """
    Extract persons and organizations from text using spaCy.
    """
    doc = nlp(text)
    persons = set()
    orgs = set()

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            persons.add(ent.text)
        elif ent.label_ == "ORG":
            orgs.add(ent.text)

    return {
        "persons": list(persons),
        "organizations": list(orgs)
    }


def has_named_entities(text: str) -> bool:
    """
    Check if the text contain any named entities (Persons, Orgs, GPE, etc.)
    """
    if not text.strip():
        return False
    
    doc = nlp(text)
    # Filter for significant entities (avoiding general ones like cardinal/date if needed)
    # For bias, PERSON, ORG, GPE, NORP are most relevant.
    relevant_labels = {"PERSON", "ORG", "GPE", "NORP", "FAC", "PRODUCT", "EVENT", "LAW"}
    
    for ent in doc.ents:
        if ent.label_ in relevant_labels:
            return True
            
    return False


def split_text(text: str, max_chars: int = 1500) -> List[str]:
    """
    Simplistic text splitter that breaks text into chunks of max_chars.
    Ideally splits on whitespace.
    """
    if not text:
        return []
    
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        if current_length + len(word) + 1 > max_chars:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
        else:
            current_chunk.append(word)
            current_length += len(word) + 1
            
    if current_chunk:
        chunks.append(" ".join(current_chunk))
        
    return chunks
