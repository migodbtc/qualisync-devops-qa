# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - heading "Login to Thicket" [level=2] [ref=e4]
      - generic [ref=e5]: Sign in to access the full extent of the ATMS
      - generic [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e8]: Email
          - generic [ref=e9]:
            - img [ref=e10]
            - textbox "Enter your email" [ref=e13]: user@example.com
        - generic [ref=e14]:
          - generic [ref=e15]: Password
          - generic [ref=e16]:
            - img [ref=e17]
            - textbox "Enter your password" [ref=e20]: wrongpassword
        - button "Login" [ref=e21] [cursor=pointer]
        - generic [ref=e22]: Network error
        - link "Don't have an account? Register" [ref=e24] [cursor=pointer]:
          - /url: /register
    - generic [ref=e25]:
      - generic [ref=e26]: Thicket by Migo
      - generic [ref=e27]: Apartment-Tenant Management System
  - alert [ref=e28]
```