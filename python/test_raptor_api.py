import requests
import pytest

# should abstract this to a .env or a .ini for parameterization

url = 'https://app.raptormaps.com/api/v2/solar_farms'
auth_token = 'WyIyMDA3IiwiJDUkcm91bmRzPTUzNTAwMCQ4czdkZ0lyZkxRalN1TXlkJHZJbXJPMzFVdERYZDFlTDRZTmdDaHJwUjBhRmIydW0vampvQWYzTE1iUzYiXQ.Yk-w_w.dGRb3xdsG6TgzOTHYdhh0eSmHWk'
org_id = '228'
headers = {
    'content-type': 'application/json',
    'Authentication-Token': auth_token
}

def test_farms_request_200():
     r = requests.get(url, headers=headers, params={'org_id': org_id})
     assert r.status_code == 200

def test_farms_only_url():
     r = requests.get(url)
     assert r.status_code == 401

def test_farms_no_org():
    r = requests.get(url, headers=headers)
    assert r.status_code == 400

def test_farms_no_auth():
    auth_test_headers = {'content-type': 'application/json'}
    r = requests.get(url, headers=auth_test_headers, params={'org_id': org_id})
    assert r.status_code == 401

def test_farms_bad_auth():
    wrong_auth_test_headers = {'content-type': 'application/json', 'Authentication-Token': '3.1415926535.89793238462643383279.5028841971P'}
    r = requests.get(url, headers=wrong_auth_test_headers, params={'org_id': org_id})
    assert r.status_code == 401
    
def test_farms_bad_url():
    bad_url = 'https://api.raptormaps.com/solar_farm'
    r = requests.get(bad_url, headers=headers, params={'org_id': org_id})
    assert r.status_code == 404

def test_farms_http():
    bad_org = '229'
    r = requests.get(url, headers=headers, params={'org_id': bad_org})
    assert r.status_code == 403

# these two tests did not behave as expected, returning a 200 and the correct data.
def test_farms_no_content():
    content_test_headers = {'Authentication-Token': auth_token}
    r = requests.get(url, headers=content_test_headers, params={'org_id': org_id})
    assert r.status_code == 200

def test_farms_bad_content():
    bad_test_headers = {'content-type': 'text/plain', 'Authentication-Token': auth_token}
    r = requests.get(url, headers=bad_test_headers, params={'org_id': org_id})
    assert r.status_code == 200