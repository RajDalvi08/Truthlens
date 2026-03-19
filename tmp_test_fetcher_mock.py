import sys
import os
import unittest
from unittest.mock import MagicMock, patch

# Add backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.article_fetcher import fetch_article

class TestArticleFetcher(unittest.TestCase):
    @patch('services.article_fetcher._get_page')
    def test_fallback_to_input_text(self, mock_get_page):
        # Mock a very short page content
        mock_response = MagicMock()
        mock_response.text = "<html><body><p>Short text</p></body></html>"
        mock_get_page.return_value = mock_response
        
        url = "https://example.com"
        input_text = "This is a long manual input text that should be used as a fallback because the scraped content is too short."
        
        result = fetch_article(url, input_text=input_text)
        
        print(f"FETCHED TEXT LENGTH: {len(result['text'])}")
        self.assertEqual(result['text'], input_text)
        print("Fallback test passed!")

    @patch('services.article_fetcher._get_page')
    def test_bs4_broad_extraction(self, mock_get_page):
        # Mock multiple paragraphs
        mock_response = MagicMock()
        mock_response.text = "<html><body><h1>Headline</h1><p>Paragraph 1</p><p>Paragraph 2</p></body></html>"
        mock_get_page.return_value = mock_response
        
        url = "https://example.com"
        # Since newspaper3k might fail on this mock html, it will fallback to BS4.
        
        result = fetch_article(url)
        
        print(f"HEADLINE: {result['headline']}")
        print(f"TEXT: {result['text']}")
        # BS4 logic is " ".join([p.get_text() for p in paragraphs])
        # "Paragraph 1 Paragraph 2"
        self.assertIn("Paragraph 1 Paragraph 2", result['text'])
        print("BS4 broad extraction test passed!")

if __name__ == '__main__':
    unittest.main()
