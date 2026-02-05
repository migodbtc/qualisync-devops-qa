# Thicket: Apartment Tenant Management System
**Project Codename:** Fuchsia Leon Residences (FLR)  
**Version:** 1.0  
**Developer Concept:** Boutique Low-Rise Residential Ecosystem  

---

## 1. Executive Summary: The Concept
**ATMS** (Apartment Tenant Management System) is a bespoke digital infrastructure designed for **Fuchsia Leon Residences**. Inspired by the resort-like aesthetic of *Kai Garden Residences*, Fuchsia Leon deviates by adopting a **Boutique Low-Rise** architecture (5 floors per building). 

The goal of ATMS is to bridge the gap between high-end hospitality and residential management, providing a "contactless" experience for tenants while giving management a 360-degree view of property financials and maintenance health.

---

## 2. Property Profile: Fuchsia Leon Residences
To optimize the system, the property is modeled as follows:
- **Total Buildings:** 3 (Ruby, Sapphire, Emerald).
- **Floor Count:** 5 Floors (Low-Rise).
- **Units per Floor:** 10 Units.
- **Atmosphere:** Urban Resort Living (minimal density, maximum service).
- **Core Strategy:** Every tenant is a registered digital user from the day their lease is signed.

---

## 3. Key Feature Set

### 🛡️ A. Authentication Guard (Flask-JWT-Extended)
The system utilizes **JSON Web Tokens (JWT)** to manage stateless authentication.
- **Secure Login:** Encrypted password hashing (Bcrypt).
- **Token-Based Communication:** The frontend sends a `Bearer <token>` in the header for every request.
- **Access Control:** Refresh tokens are used to keep tenants logged in securely on their mobile devices without exposing long-lived credentials.

### 📊 B. RBAC (Role-Based Access Control) Dashboards
The application dynamically renders the UI based on the `role_id` returned from the JWT payload:
- **Admin Dashboard:** High-level metrics (Total occupancy, building-wide revenue, staff performance).
- **Finance Dashboard:** Focused on accounts receivable, ledger updates, and arrears tracking.
- **Staff Dashboard:** Maintenance ticket queue, move-in/move-out checklists, and room status updates.
- **Tenant Dashboard:** Personal ledger (balance), digital lease copy, and "One-Tap" maintenance requests.

### 💰 C. Automated Financial Ledger
- **Invoice Generation:** Automatic monthly billing based on the `rent_amount` in the `leases` table.
- **Balance Tracking:** Real-time calculation of arrears vs. payments.
- **Digital Receipts:** Instant PDF generation upon payment verification by the Finance role.

### 🛠️ D. Maintenance Workflow (Service Desk)
- **Priority Tiering:** Tenants flag requests as *Low, Medium, High, or Emergency*.
- **Photo Logs:** Support for image uploads to document repair needs (integrated into the `maintenance_requests` table).
- **Audit Trail:** Logs of when a request was "Opened," "In-Progress," and "Resolved."

### 👥 E. User Tracking & Management
- **User Profiles:** Every tenant, staff, and admin has a digital profile with role-based access and activity logs.
- **Account Lifecycle:** Track onboarding, activation, deactivation, and historical changes for all users.
- **Data & Information Tracking:** Centralized dashboard for user activity, maintenance requests, payment history, and communication logs.
- **Balance & Finance Emphasis:** Real-time visibility into tenant balances, payment status, and financial health for management and finance roles.
- **Easy-to-Use UI:** Intuitive, mobile-responsive dashboards tailored for each role, with clear navigation and actionable insights.

This module ensures transparency, accountability, and a seamless experience for all users, supporting the core vision of digital transparency and boutique privacy.

---

## 4. Operational Workflow (The ATMS Journey)

1.  **Onboarding:** A prospect signs a physical lease. The **Staff** creates an account in ATMS.
2.  **Activation:** The **Tenant** receives an email, sets their password, and logs into the mobile-responsive dashboard.
3.  **Billing:** On the 1st of the month, the **Finance** system generates a `pending` payment record. The tenant receives a notification.
4.  **Reporting:** The tenant pays via bank transfer and uploads a reference number. **Finance** verifies it, and the balance clears instantly.
5.  **Service:** If a pipe leaks, the tenant submits a request via ATMS. **Staff** is notified on their dashboard, fixes it, and closes the ticket.


## 6. Vision for Fuchsia Leon Residences
> *"Digital Transparency, Boutique Privacy."*  
Fuchsia Leon Residences aims to use ATMS not just as a tool, but as a premium amenity. By reducing the friction of paying rent and requesting repairs, we increase tenant retention and property value.