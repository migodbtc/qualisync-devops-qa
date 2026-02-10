# EC2-First Next.js (UI-only) Deployment Guide
> Goal: deploy a **frontend-only Next.js app** from a **public GitHub repo** using **EC2**, maximizing EC2 concepts (not tools).

---

## 0. Assumptions
- Public GitHub repo
- Next.js frontend exists (even if backend/db folders exist)
- No backend, no DB, no API calls
- AWS Free Tier–safe

---

## 1. Prepare the Repo (important)
**Inside your repo:**
- Ensure frontend can build **standalone**
- If monorepo:
  - frontend lives in `/frontend`
  - build command targets that folder

**Set Next.js mode**
- Either:
  - `next build && next start` (Node server)
  - OR `next build && next export` (static)

Opinion: **static export = cleaner + cheaper**.

---

## 2. Create IAM Role (EC2 Role)
Purpose: avoid credentials, follow AWS best practice.

Steps:
- IAM → Roles → Create role
- Trusted entity: **EC2**
- Permissions:
  - `AmazonSSMManagedInstanceCore` (optional but good)
  - CloudWatch Logs (optional)

Attach this role later to EC2.

---

## 3. Launch EC2 Instance
**EC2 settings**
- AMI: Amazon Linux 2023
- Instance type: `t3.micro`
- Key pair: create or reuse
- IAM role: attach the role you made

**Network**
- Public subnet
- Auto-assign public IP: enabled

---

## 4. Security Group (minimal)
Inbound rules:
- HTTP (80) → 0.0.0.0/0
- SSH (22) → **your IP only**

Outbound: allow all

Blunt rule: never open SSH to the world.

---

## 5. User Data (this is the core)
EC2 User Data makes this **real infrastructure**, not a pet VM.

Conceptual flow:
1. Update OS
2. Install Node.js
3. Install git + nginx
4. Clone GitHub repo
5. Install dependencies
6. Build Next.js
7. Serve via nginx

Mental model:
> Instance boots → app is live → no SSH needed

---

## 6. Nginx as Web Server (recommended)
Why:
- Faster
- More “production-like”
- Zero Node process management

Flow:
- Next.js exports static files
- Files copied to `/usr/share/nginx/html`
- Nginx serves on port 80

AWS exam bias: managed, simple, deterministic.

---

## 7. Launch Instance
- Paste User Data
- Launch EC2
- Wait ~2–5 minutes

Check:
- Public IP in browser
- UI loads

If it works **without SSH**, you did it right.

---

## 8. Updating the UI (important discipline)
**Do NOT SSH and edit files.**

Correct flow:
1. Push changes to GitHub
2. Terminate EC2
3. Relaunch with same User Data

This mimics:
- immutable infrastructure
- AMI / Auto Scaling mindset

Opinion: this alone separates juniors from pros.

---

## 9. Optional Enhancements (still cheap)
- CloudWatch logs for nginx
- Health check page (`/health`)
- Environment variables via User Data

Avoid:
- RDS
- NAT Gateway
- EKS
- ALB (for now)

---

## 10. How This Maps to DVA-C02
You are exercising:
- EC2 lifecycle
- IAM roles
- User Data automation
- Security Groups
- App deployment logic

Key exam question this setup answers:
> “How do you deploy an app on EC2 **without manual configuration**?”

---

## Final Take
You are not “deploying Next.js”.
You are **testing whether you understand EC2 as an automated compute service**.

That’s the point.

---

If you want next:
- convert this into **Auto Scaling Group–ready**
- or refactor same app into **Lambda + S3** for contrast
