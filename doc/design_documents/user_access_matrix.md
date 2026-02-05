# User Access Matrix: Property Management System

**Version:** 1.1  
**Roles Defined:**
- **Admin:** Full system control and configuration.
- **Finance:** Accounting, invoicing, financial reporting, and payment verification.
- **Staff:** Operational management (maintenance, room status, lease coordination).
- **Tenant:** End-user (restricted strictly to personal data only).

---

### Legend
| Symbol | Meaning |
| :---: | :--- |
| ✅ | Full Access (Create, Read, Update, Delete) |
| 👁️ | Read-Only Access |
| 👤 | Restricted to Own Data (e.g., `WHERE user_id = current_user`) |
| ❌ | No Access |

---

### Access Table

| Module | Feature / Action | Admin | Finance | Staff | Tenant |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Authentication** | Create/Register New User | ✅ | ❌ | ✅ | ❌ |
| | Deactivate/Delete User Account | ✅ | ❌ | ❌ | ❌ |
| | Manage System Roles | ✅ | ❌ | ❌ | ❌ |
| **User Profiles** | View All Tenant Contact Info | ✅ | ✅ | ✅ | ❌ |
| | Update Personal Profile/Password | ✅ | ✅ | ✅ | 👤 |
| **Rooms** | Add, Edit, or Delete Rooms | ✅ | 👁️ | ❌ | ❌ |
| | Update Room Status (e.g., Maintenance) | ✅ | ❌ | ✅ | ❌ |
| | View Room Availability | ✅ | ✅ | ✅ | ❌ |
| **Leases** | Create New Lease Contract | ✅ | 👁️ | ✅ | ❌ |
| | Terminate or Expire Lease | ✅ | ❌ | ❌ | ❌ |
| | View Own Lease Contract | ✅ | ✅ | ✅ | 👤 |
| | View Building-wide Lease Reports | ✅ | ✅ | 👁️ | ❌ |
| **Payments** | Generate Monthly Rent Charges | ✅ | ✅ | ❌ | ❌ |
| | Record Received Payment (Manual) | ✅ | ✅ | ❌ | ❌ |
| | View Own Balance & Payment History | ✅ | ✅ | 👁️ | 👤 |
| | View Revenue Reports / Arrears | ✅ | ✅ | ❌ | ❌ |
| | Delete Financial Records | ✅ | ❌ | ❌ | ❌ |
| **Maintenance** | Submit New Request | ✅ | ✅ | ✅ | ✅ |
| | Update Request Status (Open/Closed) | ✅ | ❌ | ✅ | ❌ |
| | View All Requests (Building-wide) | ✅ | 👁️ | ✅ | ❌ |
| | View Own Request History | ✅ | ✅ | ✅ | 👤 |

---

### Technical Implementation Logic

#### 1. Tenant Scoping (SQL Enforcement)
To ensure a Tenant only sees their own data, use their `Session.user_id` in the `JOIN` logic.
```sql
-- Get Tenant's current balance safely
SELECT SUM(p.amount_due - p.amount_paid) AS balance
FROM payments p
JOIN leases l ON p.lease_id = l.id
WHERE l.tenant_id = ?; -- Bound to logged-in user ID