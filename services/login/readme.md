login service

1. user will POST data with username and password
    -> GET to signup service to verify creds and recieve generated token, last role 
    -> res: redirect to that last role service