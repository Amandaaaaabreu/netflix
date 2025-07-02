import requests
import unittest
import os
import sys
from datetime import datetime

class NetflixBackendAPITester(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(NetflixBackendAPITester, self).__init__(*args, **kwargs)
        # Get the backend URL from the frontend .env file
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    self.base_url = line.strip().split('=')[1].strip('"\'')
                    break
        
        print(f"Using backend URL: {self.base_url}")
        
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        url = f"{self.base_url}/api/"
        print(f"Testing endpoint: {url}")
        
        try:
            response = requests.get(url)
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), {"message": "Hello World"})
            print("✅ Root endpoint test passed")
        except Exception as e:
            print(f"❌ Root endpoint test failed: {str(e)}")
            raise
    
    def test_status_endpoint_post(self):
        """Test creating a status check"""
        url = f"{self.base_url}/api/status"
        print(f"Testing POST endpoint: {url}")
        
        data = {
            "client_name": f"test_client_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        }
        
        try:
            response = requests.post(url, json=data)
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["client_name"], data["client_name"])
            self.assertIn("id", response.json())
            self.assertIn("timestamp", response.json())
            print("✅ Status POST endpoint test passed")
        except Exception as e:
            print(f"❌ Status POST endpoint test failed: {str(e)}")
            raise
    
    def test_status_endpoint_get(self):
        """Test getting status checks"""
        url = f"{self.base_url}/api/status"
        print(f"Testing GET endpoint: {url}")
        
        try:
            response = requests.get(url)
            print(f"Status code: {response.status_code}")
            print(f"Response contains {len(response.json())} items")
            
            self.assertEqual(response.status_code, 200)
            self.assertIsInstance(response.json(), list)
            print("✅ Status GET endpoint test passed")
        except Exception as e:
            print(f"❌ Status GET endpoint test failed: {str(e)}")
            raise

if __name__ == "__main__":
    unittest.main()