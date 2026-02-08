# Use Case Flows

---

## 1. Role-Based Login & Dashboard Rendering

**Actors:** All users (Admin, Finance, Staff, Tenant)

**Flow:**
1. User navigates to the login page and enters credentials.
2. Backend authenticates user via JWT (see [atms_concept.md](design_documents/atms_concept.md)).
3. Upon successful login, JWT payload returns `role_id`.
4. Frontend reads `role_id` and renders the appropriate dashboard:
    - **Admin:** Full control, system metrics, user management.
    - **Finance:** Financial analytics, payment verification.
    - **Staff:** Maintenance queue, room status, lease coordination.
    - **Tenant:** Personal ledger, lease copy, maintenance requests.

---

## 2. Tenant Registration & Verification

**Actors:** Staff, Admin, Tenant

**Flow:**
1. Staff or Admin registers a new tenant via the card-based directory (see [dashboard_features.md](design_documents/dashboard_features.md)).
2. Tenant receives an email invitation to set up their account.
3. Tenant completes registration and submits personal information.
4. Tenant status is set to "Pending Verification."
5. Admin reviews tenant details and supporting documents.
6. Admin approves the tenant, changing status to "Active."
7. Tenant gains access to their personalized dashboard.

---

## 3. Room Assignment to Verified Tenant

**Actors:** Admin

**Flow:**
1. Admin views list of verified tenants without room assignments.
2. Admin selects a tenant and opens the "Assign Room" modal.
3. Admin chooses an available room from the apartment rooms index.
4. System updates the tenant's record with assigned room.
5. Lease contract is generated and linked to tenant and room.
6. Tenant sees their assigned room and lease details on their dashboard.

---

## 4. Tenant Payment Workflow

**Actors:** Tenant, Finance

**Flow:**
1. Tenant logs in and navigates to the payment history section.
2. Tenant views outstanding balance and payment options:
    - **Manual Payment:** Tenant uploads proof (bank transfer, cash receipt).
    - **Digital Payment:** Tenant pays via integrated wallet or linked bank account.
3. Payment record is created with status "Pending Verification."
4. Finance reviews payment submission:
    - If manual, verifies proof and marks as "Paid."
    - If digital, system auto-verifies and updates status.
5. Tenant receives confirmation and updated balance.
6. Payment details are logged in the timeline and analytics.

---

## 5. Tenant Removal for Severe Violations

**Actors:** Admin

**Flow:**
1. Incident (e.g., property destruction) is reported and logged.
2. Admin reviews incident details and tenant history.
3. Admin initiates "Deactivate/Kick Out" action from tenant profile.
4. System updates tenant status to "Deactivated."
5. Lease contract is terminated; room is marked as available.
6. Tenant loses access to dashboard and receives notification.
7. Audit log records the removal action for compliance.

---