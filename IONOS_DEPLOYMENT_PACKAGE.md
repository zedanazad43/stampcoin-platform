# StampCoin Platform - IONOS Deployment Package
## Complete deployment solution for IONOS.de hosting

**Created:** January 10, 2026  
**Version:** 1.0.0  
**Status:** ✅ Ready for Deployment

---

## 📦 What's Included

This deployment package contains everything needed to deploy StampCoin platform on IONOS VPS hosting:

### 1. Configuration Files

#### [`ionos-config.yml`](ionos-config.yml)
Complete IONOS infrastructure configuration including:
- Domain settings (stampcoin.com, .io, .net, .de, .ae)
- VPS specifications (XL package: 8 vCores, 16GB RAM, 320GB NVMe)
- DNS records configuration (A, MX, TXT, CNAME, CAA)
- Email accounts setup (5 Business Pro accounts)
- Security configuration (SSL, SiteLock, Backups)
- CDN settings (IONOS CDN Pro)
- Three pre-configured packages (Startup, Professional, Enterprise)
- Detailed pricing breakdown

### 2. Deployment Scripts

#### [`deploy-ionos.sh`](deploy-ionos.sh) ⭐
**Main deployment automation script** (726 lines)

Automates complete server setup:
- ✅ System updates and prerequisites
- ✅ Node.js 20 installation with pnpm
- ✅ MySQL 8.0 setup with secure configuration
- ✅ Redis installation and optimization
- ✅ Docker for IPFS containers
- ✅ Firewall configuration (UFW)
- ✅ Fail2Ban intrusion prevention
- ✅ Project deployment from Git
- ✅ Database migrations
- ✅ IPFS container setup
- ✅ Nginx reverse proxy configuration
- ✅ SSL certificate installation (Let's Encrypt)
- ✅ Systemd service creation
- ✅ Monitoring tools setup
- ✅ Automated backups configuration

**Usage:**
```bash
# On VPS after uploading files:
cd /root
./deploy-ionos.sh

# Duration: ~10-15 minutes
# Result: Fully configured production environment
```

#### [`prepare-ionos-deployment.sh`](prepare-ionos-deployment.sh)
**Pre-deployment helper script**

Automates preparation and file upload:
- Validates .env.deploy configuration
- Checks for empty variables
- Tests SSH connection to VPS
- Uploads all deployment files
- Handles backup files upload
- Provides next-steps guidance

**Usage:**
```bash
# On local machine:
./prepare-ionos-deployment.sh

# Will prompt for VPS IP and guide through process
```

### 3. Documentation

#### [`IONOS_COMPLETE_SETUP_GUIDE.md`](IONOS_COMPLETE_SETUP_GUIDE.md)
**Comprehensive setup guide** (1,200+ lines)

Complete reference covering:
- **Overview**: Why IONOS for StampCoin
- **Package Selection**: Detailed package comparison
- **Step-by-Step Setup**: 
  - Account creation
  - Domain purchase
  - VPS ordering
  - Email configuration
  - SSL certificate setup
  - Security services activation
  - CDN configuration
- **Technical Configuration**:
  - VPS initial setup
  - DNS configuration (A, MX, TXT records)
  - Security hardening
  - SSH key authentication
- **Deployment Process**:
  - Environment file preparation
  - Script execution
  - Post-deployment verification
- **Security Configuration**:
  - SSL/TLS hardening
  - Firewall rules
  - Fail2Ban setup
  - Intrusion detection
- **Monitoring & Alerts**:
  - Prometheus + Grafana setup
  - UptimeRobot configuration
  - Email alerts
  - Performance monitoring
- **Performance Optimization**:
  - MySQL tuning
  - Redis optimization
  - Nginx configuration
  - CDN setup
- **Troubleshooting**:
  - Common issues and solutions
  - Debug commands
  - Recovery procedures
- **Pricing Breakdown**:
  - Initial costs
  - Monthly recurring
  - Annual projections
  - ROI analysis

#### [`IONOS_MIGRATION_GUIDE.md`](IONOS_MIGRATION_GUIDE.md)
**Complete migration guide** (1,100+ lines)

Step-by-step migration process:
- **Pre-Migration Checklist**: Audit current environment
- **Phase 1**: IONOS setup (Day 1)
  - Domain purchase
  - VPS provisioning
  - Email setup
  - Initial access
- **Phase 2**: Data backup (Day 1-2)
  - Database backup
  - Environment export
  - File storage backup
  - Docker volumes backup
- **Phase 3**: IONOS deployment (Day 2-3)
  - Environment preparation
  - File upload
  - Script execution
  - Data restoration
- **Phase 4**: DNS configuration (Day 3)
  - DNS records setup
  - Propagation verification
- **Phase 5**: SSL & Security (Day 3-4)
  - Certificate verification
  - Security headers
  - Fail2Ban monitoring
- **Phase 6**: Application configuration (Day 4)
  - OAuth redirect updates
  - Payment integration testing
  - CDN configuration
- **Phase 7**: Testing & validation (Day 4-5)
  - Functional testing checklist
  - Performance testing
  - Load testing
- **Phase 8**: Monitoring setup (Day 5)
  - Uptime monitoring
  - Log monitoring
  - Alerting configuration
- **Phase 9**: Go live (Day 5-6)
  - Pre-launch checklist
  - Maintenance mode (optional)
  - Launch announcement
- **Phase 10**: Post-launch monitoring (Week 1)
  - Daily checks
  - Performance optimization
  - Weekly maintenance
- **Rollback Plan**: Recovery procedures if migration fails
- **Success Metrics**: KPIs to monitor
- **Timeline Summary**: Complete schedule

### 4. Environment Configuration

#### [`.env.deploy.example`](.env.deploy.example)
**Environment variables template**

Complete environment configuration template with:
- Database credentials
- Application secrets (Session, JWT)
- IPFS/Pinata configuration
- Blockchain settings (Polygon)
- Payment gateways (Cex.io, Stripe, PayPal)
- OAuth (Google, Discord)
- AWS S3 storage
- Email SMTP (IONOS)
- Domain settings

**Security features:**
- Generation commands for secure passwords
- Detailed comments for each variable
- Validation checklist
- Best practices notes

**Usage:**
```bash
# Copy template
cp .env.deploy.example .env.deploy

# Fill in all values
nano .env.deploy

# Verify no empty values
grep -E '=""$' .env.deploy

# Upload to server (done by prepare script)
```

---

## 🎯 Recommended Package: Professional Bundle

### Package Details

```yaml
Monthly Cost: €76 (~$83 USD)
Annual Cost: €912 (~$995 USD)
Setup Fee: €40 (one-time)

Includes:
  Domains:
    - stampcoin.com (1€ first year)
    - stampcoin.io (39€/year)
  
  VPS Hosting:
    - 8 vCores CPU
    - 16 GB RAM
    - 320 GB NVMe SSD
    - Unlimited bandwidth
    - 1 Gbps network
    - Frankfurt datacenter
    - 99.9% uptime SLA
  
  Security:
    - SSL Wildcard (*.stampcoin.com)
    - SiteLock Security Pro
    - DDoS protection
    - Premium automated backups
  
  Email:
    - 5 Business Pro accounts
    - 50 GB per mailbox
    - Spam/virus protection
    - Mobile app support
  
  Performance:
    - CDN Pro (50+ global locations)
    - Image optimization
    - Smart caching
```

### Why This Package?

✅ **Production-Ready**: Handles 10,000+ concurrent users  
✅ **Complete Security**: Enterprise-grade protection  
✅ **Global Performance**: CDN across 50+ locations  
✅ **GDPR Compliant**: EU-based data center  
✅ **Scalable**: Easy upgrade path  
✅ **Cost-Effective**: ~€0.076 per user/month at 1,000 users  

---

## 🚀 Quick Start Guide

### Prerequisites

1. **IONOS Account**
   - Create at: https://www.ionos.de
   - Add payment method
   - Verify email

2. **Required Credentials**
   - MySQL passwords (generate secure)
   - Application secrets (JWT, Session)
   - Pinata API keys (from pinata.cloud)
   - Blockchain private key
   - Payment gateway credentials (Cex.io, Stripe, PayPal)
   - OAuth credentials (Google, Discord)
   - AWS S3 credentials
   - Email passwords

3. **Local Tools**
   - SSH client
   - Git
   - OpenSSL (for password generation)

### Deployment Steps

#### Step 1: Purchase IONOS Services

```
1. Login to IONOS Dashboard: https://my.ionos.de

2. Purchase Domain:
   - Domains → Register Domain
   - Search: "stampcoin"
   - Add stampcoin.com (1€)
   - Add stampcoin.io (39€)
   - Enable Whois Privacy (free)
   - Complete purchase

3. Order VPS:
   - Server & Cloud → Order VPS
   - Select: VPS Linux XL
   - OS: Ubuntu 24.04 LTS
   - Datacenter: Frankfurt
   - Price: 20€/month (promotional)
   - Note IP address after provisioning

4. Setup Email:
   - Email → Create Email Address
   - Create 5 accounts (see guide)
   - Note SMTP settings

5. Order SSL:
   - SSL → Wildcard Certificate
   - Domain: *.stampcoin.com
   - Auto-renewal: Enable

6. Activate Security:
   - Security → SiteLock Pro
   - Security → CodeGuard Backup
   - Enable both services

7. Activate CDN:
   - CDN → CDN Pro
   - Origin: stampcoin.com
   - Enable optimization
```

#### Step 2: Configure DNS

```
IONOS Dashboard → Domains → stampcoin.com → DNS Settings

Add Records:
  A      @       YOUR_VPS_IP      3600
  A      www     YOUR_VPS_IP      3600
  A      api     YOUR_VPS_IP      3600
  MX     @       mx00.ionos.de    10
  MX     @       mx01.ionos.de    10
  TXT    @       v=spf1 include:_spf.ionos.de ~all
  TXT    _dmarc  v=DMARC1; p=quarantine; rua=mailto:admin@stampcoin.com

Save and wait 5-10 minutes for propagation
```

#### Step 3: Prepare Environment

```bash
# Clone repository (if not already)
git clone https://github.com/Stampcoin-platform/Stampcoin-platform.git
cd Stampcoin-platform

# Create environment file
cp .env.deploy.example .env.deploy

# Edit and fill all values
nano .env.deploy

# Generate secure passwords
openssl rand -base64 32  # For MySQL passwords
openssl rand -hex 32     # For JWT/Session secrets

# Verify configuration
grep -E '=""$' .env.deploy  # Should return nothing
```

#### Step 4: Run Deployment Helper

```bash
# Make executable
chmod +x prepare-ionos-deployment.sh

# Run helper script
./prepare-ionos-deployment.sh

# It will:
# 1. Validate .env.deploy
# 2. Test SSH connection
# 3. Upload all files to VPS
# 4. Guide you through next steps

# Enter your VPS IP when prompted
```

#### Step 5: Deploy on VPS

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Run deployment
cd /root
./deploy-ionos.sh

# Monitor progress (in another terminal)
ssh root@YOUR_VPS_IP "tail -f /var/log/syslog"

# Deployment takes 10-15 minutes
# Script will show progress and final summary
```

#### Step 6: Verify Deployment

```bash
# Check services
systemctl status stampcoin
systemctl status nginx
systemctl status mysql
systemctl status redis

# Test website
curl -I https://stampcoin.com
# Should return: 200 OK

# Test API
curl https://api.stampcoin.com/health
# Should return: {"status":"ok"}

# View logs
journalctl -u stampcoin -f

# Check SSL rating
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=stampcoin.com
# Target: A+ rating
```

#### Step 7: Post-Deployment

```bash
# 1. Restore database (if migrating)
mysql -u stampcoin_user -p stampcoin < /root/stampcoin_backup_*.sql

# 2. Update OAuth redirects
# - Google: https://stampcoin.com/api/auth/google/callback
# - Discord: https://stampcoin.com/api/auth/discord/callback

# 3. Update payment webhooks
# - Stripe: https://api.stampcoin.com/api/webhooks/stripe
# - PayPal: https://stampcoin.com/payment/paypal/return

# 4. Test all features
# - User registration
# - Login (email + OAuth)
# - Payment flows
# - NFT features

# 5. Setup monitoring
# - UptimeRobot: https://uptimerobot.com
# - Add monitors for website, API, database

# 6. Verify backups
ls -lh /var/backups/stampcoin/
# Should see daily backups

# 7. Check security
fail2ban-client status
ufw status
```

---

## 📊 Cost Analysis

### First Month Costs

```
Initial Setup:
  Domains (stampcoin.com + .io)     €40.00
  VPS XL (promotional)              €20.00
  SSL Wildcard                      €8.33
  SiteLock Security                 €14.99
  Premium Backups                   €7.99
  Email (5 accounts)                €15.00
  CDN Pro                           €10.00
  ─────────────────────────────────
  TOTAL FIRST MONTH:                €116.31
```

### Monthly Recurring (After Promotion)

```
  VPS XL (regular price)            €40.00
  SSL Wildcard                      €8.33
  SiteLock Security                 €14.99
  Premium Backups                   €7.99
  Email (5 accounts)                €15.00
  CDN Pro                           €10.00
  ─────────────────────────────────
  MONTHLY TOTAL:                    €96.31
```

### Annual Projection

```
  Monthly Services (€96.31 × 12)    €1,155.72
  Domain Renewals (.com + .io)      €54.00
  ─────────────────────────────────
  ANNUAL TOTAL:                     €1,209.72
```

### Break-Even Analysis

```
Monthly Infrastructure Cost:        €96
Monthly Active Users Target:        1,000
Cost per User:                      €0.096 (~10 cents)

Revenue Scenarios:

Scenario 1: Transaction Fees (3%)
  - Average transaction: €50
  - Platform fee: €1.50
  - Transactions needed: 64/month
  - Conversion rate needed: 6.4%

Scenario 2: Subscription Model
  - Premium tier: €5/month
  - Subscribers needed: 20
  - Conversion rate needed: 2%

Scenario 3: NFT Sales
  - Average NFT: €100
  - Platform fee (5%): €5
  - Sales needed: 20/month
  - Conversion rate needed: 2%

Realistic Mixed Model:
  - 30 transactions/month: €45
  - 10 premium subscriptions: €50
  - 5 NFT sales: €25
  ─────────────────────────────────
  Total monthly revenue: €120
  Profit: €24
  ROI: 25%
```

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. Deployment Script Fails
```bash
# Check prerequisites
which node npm pnpm mysql redis-cli docker nginx

# Check logs
tail -100 /var/log/syslog

# Re-run specific section
# Edit deploy-ionos.sh and comment out completed sections
./deploy-ionos.sh
```

#### 2. Website Not Accessible
```bash
# Check Nginx
systemctl status nginx
nginx -t

# Check DNS
dig stampcoin.com +short
# Should return your VPS IP

# Check firewall
ufw status
# Ensure ports 80 and 443 are open

# Check SSL
certbot certificates
```

#### 3. Database Connection Error
```bash
# Check MySQL
systemctl status mysql

# Test connection
mysql -u stampcoin_user -p stampcoin

# Check grants
mysql -uroot -p -e "SHOW GRANTS FOR 'stampcoin_user'@'localhost';"

# Reset if needed
mysql -uroot -p
ALTER USER 'stampcoin_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

#### 4. Application Not Starting
```bash
# Check status
systemctl status stampcoin

# View logs
journalctl -u stampcoin -n 100

# Check environment
cat /var/www/stampcoin/.env

# Manual start (debug)
cd /var/www/stampcoin
NODE_ENV=production pnpm start

# Rebuild if needed
pnpm install
pnpm build
systemctl restart stampcoin
```

---

## 📞 Support & Resources

### IONOS Support
- **Phone**: +49 (0) 721 170 5000 (24/7)
- **Email**: support@ionos.de
- **Live Chat**: https://www.ionos.de/help
- **Documentation**: https://www.ionos.de/hilfe

### Emergency Contacts
- **Critical Outage**: +49 (0) 721 170 5000 → Option 1
- **Security**: abuse@ionos.de
- **Billing**: billing@ionos.de

### Useful Links
- **Control Panel**: https://my.ionos.de
- **Webmail**: https://mail.ionos.de
- **Server Panel**: https://cloud.ionos.de
- **SSL Labs Test**: https://www.ssllabs.com/ssltest/
- **DNS Checker**: https://dnschecker.org

---

## ✅ Deployment Checklist

Use this checklist to track your progress:

### Pre-Deployment
- [ ] IONOS account created
- [ ] Payment method added
- [ ] Domains purchased (stampcoin.com, stampcoin.io)
- [ ] VPS ordered (VPS Linux XL)
- [ ] Email accounts created (5 accounts)
- [ ] SSL certificate ordered (Wildcard)
- [ ] Security services activated (SiteLock, Backups)
- [ ] CDN activated (CDN Pro)
- [ ] DNS records configured
- [ ] .env.deploy created and filled
- [ ] All credentials collected

### Deployment
- [ ] Files uploaded to VPS
- [ ] deploy-ionos.sh executed successfully
- [ ] All services running
- [ ] Database migrated
- [ ] SSL certificate installed
- [ ] Nginx configured
- [ ] Firewall enabled
- [ ] Fail2Ban active

### Testing
- [ ] Website accessible (https://stampcoin.com)
- [ ] API responding (https://api.stampcoin.com)
- [ ] SSL rating A+ (ssllabs.com)
- [ ] User registration works
- [ ] Login works (email + OAuth)
- [ ] Payment gateways functional
- [ ] Email sending works
- [ ] NFT features operational

### Post-Deployment
- [ ] OAuth redirects updated
- [ ] Payment webhooks updated
- [ ] Monitoring configured (UptimeRobot)
- [ ] Alerts setup (email/SMS)
- [ ] Backups verified
- [ ] Performance optimized
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] Team trained

### Go Live
- [ ] Maintenance announcement sent
- [ ] Production mode enabled
- [ ] DNS fully propagated
- [ ] Load testing completed
- [ ] Launch announcement ready
- [ ] Support team ready
- [ ] Monitoring active (24/7)

---

## 📈 Next Steps After Deployment

### Week 1: Stabilization
1. Monitor logs daily
2. Check error rates
3. Verify all services running
4. Test all features manually
5. Collect user feedback
6. Fix any critical bugs
7. Optimize performance

### Month 1: Optimization
1. Analyze traffic patterns
2. Optimize database queries
3. Tune caching strategy
4. Enable additional CDN features
5. Set up automated testing
6. Create backup restoration procedure
7. Document operational procedures

### Month 2-3: Scaling
1. Monitor resource usage
2. Plan for traffic growth
3. Consider load balancing
4. Optimize images and assets
5. Implement advanced caching
6. Set up staging environment
7. Prepare scaling playbook

### Ongoing: Maintenance
1. Weekly security updates
2. Monthly performance reviews
3. Quarterly disaster recovery tests
4. Regular backup verification
5. SSL certificate renewal (automated)
6. Database optimization
7. Log analysis and monitoring

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ **Uptime**: >99.5% in first month  
✅ **Performance**: Page load <2 seconds  
✅ **Security**: SSL A+ rating, no vulnerabilities  
✅ **Functionality**: All features working  
✅ **Payments**: All gateways processing  
✅ **Email**: Delivery rate >95%  
✅ **Backups**: Daily backups running  
✅ **Monitoring**: Alerts configured and working  

---

## 📝 Change Log

**Version 1.0.0 - January 10, 2026**
- Initial release
- Complete IONOS deployment package
- Professional bundle configuration
- Automated deployment scripts
- Comprehensive documentation
- Migration guide
- Troubleshooting resources

---

## 📄 License & Support

**Package Created By:** StampCoin DevOps Team  
**License:** Proprietary (StampCoin Platform)  
**Support:** admin@stampcoin.com  
**Documentation:** https://docs.stampcoin.com  

---

## 🙏 Acknowledgments

- **IONOS** for reliable hosting infrastructure
- **Let's Encrypt** for free SSL certificates
- **Ubuntu** for stable Linux distribution
- **Node.js** community for excellent runtime
- **Nginx** for high-performance web server

---

**🚀 Ready to deploy? Start with:** `./prepare-ionos-deployment.sh`

**📚 Need help? Read:** [IONOS_COMPLETE_SETUP_GUIDE.md](IONOS_COMPLETE_SETUP_GUIDE.md)

**🔄 Migrating? Follow:** [IONOS_MIGRATION_GUIDE.md](IONOS_MIGRATION_GUIDE.md)

---

*This package provides everything needed for a successful deployment of StampCoin platform on IONOS infrastructure. Follow the guides carefully and don't hesitate to ask for support if needed.*

**Good luck with your deployment! 🎊**
