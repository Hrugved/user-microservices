Signup Service

1. users post to a generic signup api endpoint with basic info, and roles it needs accessed to.
    
2. owns its own database with users basic info and roles

3. user post data to specific api endpoints for various roles -> forward the data to that specific role-service for further registration 

4. contain endpoints to handle all auth related service: 
    verifying otp on signup
    generating and verifying jwt tokens

