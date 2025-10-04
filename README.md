# AWS-Multi-Tier-Node-App

Absolutely! Let’s arrange your **Multi-Tier Web App Deployment on AWS** guide in a clean, step-by-step, production-ready format including Bastion Host setup, EC2, ALB, RDS, and optional auto-scaling. Here’s the final structured version:

---

# ✅ Multi-Tier Web App Deployment on AWS (Production-Ready)

## **Step 1: Create Networking (VPC Setup)**

1. **Create VPC**

   * Go to **VPC → Create VPC**
   * Name: `MultiTierVPC`
   * CIDR: `10.0.0.0/16`

2. **Create Subnets**

   * **Public Subnet:** `10.0.1.0/24` → For **ALB** & **Bastion Host**
   * **Private Subnet:** `10.0.2.0/24` → For **App/Web EC2** & **RDS**

3. **Internet Gateway**

   * Create **IGW** → Attach to VPC

4. **NAT Gateway**

   * Create in **Public Subnet**
   * Allocate Elastic IP

5. **Route Tables**

   * **Public Subnet:** Route `0.0.0.0/0` → **IGW**
   * **Private Subnet:** Route `0.0.0.0/0` → **NAT Gateway**

---

## **Step 2: Launch Bastion Host (Public Subnet)**

1. **Launch EC2 Instance**

   * AMI: **Amazon Linux 2**
   * Instance Type: `t2.micro`
   * VPC: `MultiTierVPC`
   * Subnet: Public
   * Auto-assign Public IP: Enabled
   * Key Pair: `aws-open.pem`

2. **Security Group**

   * Inbound: SSH (22) from **your IP only**
   * Outbound: All traffic (default)

3. **Connect from Local System**

   ```bash
   ssh -i "aws-open.pem" ec2-user@<Bastion-Public-IP>
   ```

---

## **Step 3: Launch App/Web EC2 (Private Subnet)**

1. **Launch EC2 Instances**

   * AMI: Amazon Linux 2
   * Instance Type: t2.micro
   * Subnet: Private
   * Key Pair: Same as Bastion

2. **Security Group**

   * Allow **HTTP (80)** only from ALB SG
   * Allow SSH (22) from **Bastion SG** (for manual connection)

3. **Connect via Bastion Host**

   ```bash
   ssh -i aws-open.pem ec2-user@<Private-EC2-Private-IP>
   ```

4. **Install App (User Data Script Recommended)**

   ```bash
   #!/bin/bash
   yum update -y
   curl -sL https://rpm.nodesource.com/setup_18.x | bash -
   yum install -y nodejs git mysql
   npm install -g pm2
   mkdir -p /var/www
   cd /var/www
   git clone https://github.com/Khushal41/AWS-Multi-Tier-Node-App.git app
   cd app
   npm install

   # Setup environment variables
   cat <<EOT > .env
   DB_HOST=<RDS-ENDPOINT>
   DB_USER=<DB-USERNAME>
   DB_PASS=<DB-PASSWORD>
   DB_NAME=<DB-NAME>
   PORT=80
   EOT

   # Start app with PM2
   pm2 start app.js --name multi-tier-app
   pm2 startup systemd -u ec2-user --hp /home/ec2-user
   pm2 save
   ```

---

## **Step 4: Configure Application Load Balancer (ALB)**

1. **Create ALB**

   * Go to **EC2 → Load Balancers → Create**
   * Scheme: **Internet-facing**
   * Subnets: **Public Subnet(s)**
   * Security Group: Allow **HTTP (80)** & **HTTPS (443)** from Internet

2. **Create Target Group**

   * Type: **Instances**
   * Register App/Web EC2 instances
   * Health Check Path: `/health`

---

## **Step 5: Deploy RDS (Database Layer)**

1. **Create Database**

   * Engine: **MySQL** (or PostgreSQL)
   * Deployment: Multi-AZ (recommended)
   * Subnet: Private Subnet

2. **Security Group**

   * Allow port **3306** only from App/Web EC2 SG

3. **Note DB Endpoint & Credentials**

   * Use these in `.env` file on App EC2

---

## **Step 6: Configure Security Groups Summary**

| Resource       | Inbound Rules                        |
| -------------- | ------------------------------------ |
| **ALB SG**     | HTTP (80), HTTPS (443) from Anywhere |
| **App/Web SG** | HTTP (80) from ALB SG only           |
| **DB SG**      | MySQL (3306) from App/Web SG only    |
| **Bastion SG** | SSH (22) from your IP                |

---

## **Step 7: Auto Scaling (Optional)**

1. Create **Launch Template** for App/Web EC2
2. Create **Auto Scaling Group**

   * Attach to **ALB Target Group**
   * Scaling Policy:

     * Scale Out: CPU > 70%
     * Scale In: CPU < 30%

---

## **Step 8: Testing**

1. Get **ALB DNS Name** from AWS Console
2. Open in browser → Your Node.js Multi-Tier App should load 🎉

---

## **Step 9: Optional – Access RDS via Bastion**

```bash
mysql -h <RDS-ENDPOINT> -u <DB-USER> -p
```

* Ensure RDS SG allows port 3306 from Bastion SG
* Enter password → connected to DB

---

## **Step 10: Optional – Use AWS Session Manager**

* No Bastion Host required
* Enable **SSM Agent** & **IAM Role** on EC2
* Connect via **AWS Console → Session Manager**

---

This is a **production-ready, step-by-step AWS Multi-Tier Web App deployment guide**, including Bastion setup, ALB, RDS, auto-scaling, and optional SSM connection.

---
