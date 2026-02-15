vitest (component tests, frontend)
1. Root layout happy path test (renders children properly and applies the correct font classes).
2. Root layout sad path test (renders nothing if children are missing).
3. Root layout sad path test (handles an invalid font name gracefully).
4. Root page happy path test (successfully redirects to the intended route).
5. Root page sad path test (handles unsuccessful redirect attempts appropriately).
6. (auth)/layout happy path test (renders children and displays the split layout with title and subtitle).
7. (auth)/layout sad path test (handles errors when rendering children).
8. (auth)/login/page.tsx happy path test (renders the login form with all expected fields and labels, allows the user to enter a valid email and password, submits the form and triggers the API call with the correct payload, displays a loading state while waiting for the response, stores the access token in localStorage upon successful login, redirects the user to the /home page after successful login, does not display an error message for valid credentials, disables the "Login" button during loading, and ensures the "Register" link is visible and navigable).
9. (auth)/login/page.tsx sad path test (renders the form with missing or incorrect fields and labels).
10. (auth)/login/page.tsx sad path test (shows an error when the user enters an invalid email or password).
11. (auth)/login/page.tsx sad path test (handles form submission when the API call fails or the payload is incorrect).
12. (auth)/login/page.tsx sad path test (does not display or gets stuck in the loading state).
13. (auth)/login/page.tsx sad path test (does not store the access token in localStorage when login fails).
14. (auth)/login/page.tsx sad path test (does not redirect to /home after login failure).
15. (auth)/login/page.tsx sad path test (displays an error message even for valid credentials).
16. (auth)/login/page.tsx sad path test (does not disable the "Login" button during loading).
17. (auth)/login/page.tsx sad path test (the "Register" link is missing or not navigable).
18. (auth)/register/page.tsx happy path test (renders the registration form with all expected fields, labels, and checkboxes; allows the user to enter a valid email, username, password, and confirm password; allows the user to select a role; requires the user to check both compliance checkboxes (Terms & Conditions, Privacy Policy); submits the form and triggers the API call with the correct payload; displays a loading state while waiting for the response; clears the form fields and checkboxes upon successful registration; automatically logs in the user after registration; stores the access token in localStorage upon successful auto-login; redirects the user to the /home page after successful registration and login; does not display an error message for valid input and successful registration; disables the "Register" button during loading; and ensures the "Login" link is visible and navigable).
19. (auth)/register/page.tsx sad path test (renders the form with missing or incorrect fields, labels, or checkboxes).
20. (auth)/register/page.tsx sad path test (does not allow the user to enter a valid email, username, password, or confirm password).
21. (auth)/register/page.tsx sad path test (does not allow the user to select a role).
22. (auth)/register/page.tsx sad path test (does not require the user to check both compliance checkboxes, or allows submission without them).
23. (auth)/register/page.tsx sad path test (submits the form but triggers the API call with an incorrect payload, or the API call fails).
24. (auth)/register/page.tsx sad path test (does not display a loading state, or gets stuck in the loading state).
25. (auth)/register/page.tsx sad path test (does not clear the form fields and checkboxes upon successful registration).
26. (auth)/register/page.tsx sad path test (does not automatically log in the user after registration).
27. (auth)/register/page.tsx sad path test (does not store the access token in localStorage upon successful auto-login).
28. (auth)/register/page.tsx sad path test (does not redirect the user to the /home page after successful registration and login).
29. (auth)/register/page.tsx sad path test (displays an error message for valid input and successful registration).
30. (auth)/register/page.tsx sad path test (does not disable the "Register" button during loading).
31. (auth)/register/page.tsx sad path test (the "Login" link is missing or not navigable).

playwright (e2e tests, frontend)
1. Login happy path test (user enters valid credentials, logs in, and is redirected to /home).
2. Login sad path test (user enters invalid email format and sees a validation error, cannot submit).
3. Login sad path test (user enters invalid characters in email or password and sees a validation error).
4. Login sad path test (user enters a valid-looking but non-existent email and sees a "user not found" error).
5. Login sad path test (user enters correct email but wrong password and sees an "invalid password" error).
6. Login sad path test (user leaves fields empty and tries to submit, sees required field errors).
7. Login sad path test (login API returns server error and user sees a generic error message).
8. Login sad path test (login API is unreachable and user sees a network error).
9. Register happy path test (user fills all fields correctly, agrees to terms, registers, is auto-logged in, and is redirected to /home).
10. Register sad path test (user enters mismatched passwords and sees a "passwords do not match" error).
11. Register sad path test (user tries to register with an already-used username and sees a "username taken" error).
12. Register sad path test (user tries to register with an already-used email and sees an "email taken" error).
13. Register sad path test (user enters invalid characters in username or email and sees a validation error).
14. Register sad path test (user enters a password that is too short and sees a "password too short" error).
15. Register sad path test (user leaves required fields empty and sees required field errors).
16. Register sad path test (user does not check one or both compliance checkboxes and sees a "must agree" error).
17. Register sad path test (registration API returns server error and user sees a generic error message).
18. Register sad path test (registration API is unreachable and user sees a network error).