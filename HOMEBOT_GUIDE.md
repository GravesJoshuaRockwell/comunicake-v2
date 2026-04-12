# 🏠 HomeBot Module Guide

**HomeBot** is a client-engagement and home-wealth management platform integrated into Comunicake v2. It enables automatic monthly reports, home value tracking, and lead alerts to keep clients engaged and drive repeat business.

## Features

### 📊 Dashboard
- **At-a-glance metrics**: Total clients, average home value, email open rates, active campaigns
- **Lead alerts**: Clients likely to move or refinance (9-12 month prediction)
- **Activity timeline**: Real-time engagement tracking
- **Quick actions**: Import clients, create campaigns, send reports

### 👥 Client Management
- **Import clients** from CSV or Excel files
- **Search & filter** by name, email, status
- **Track home values & equity** for each client
- **Status tracking**: Active, Prospect, Archived
- **Last contact dates** for relationship management

### 📧 Campaign Manager
- **Pre-built templates**:
  - Monthly Digest (home value & equity updates)
  - Refinance Alert (rate-based opportunities)
  - Move Prediction (identify likely movers)
- **Campaign scheduling**: Send automated reports
- **Template customization**: White-label with your branding
- **Campaign history**: Track all sent campaigns with engagement data

### 📈 Analytics
- **Engagement metrics**: Open rates, click rates, avg time to open
- **Monthly trends**: Track performance over time
- **Top performers**: See which campaigns perform best
- **Client segmentation**: 
  - High Equity (>$200K)
  - Medium Equity ($100K-$200K)
  - Building Equity (<$100K)
  - Refinance Ready

## How to Use

### 1. Import Your Clients
Go to **Clients** tab → Click **Choose File** → Upload CSV/Excel with:
- Name, Email, Phone
- Home address, ZIP
- Loan amount, LTV
- Any custom fields

**Supported formats:**
- CSV (.csv)
- Excel (.xlsx, .xls)

### 2. Create Campaigns
Go to **Campaigns** tab → Click **New Campaign** → Choose template → Customize → Schedule

**Template options:**
- Monthly Digest (auto-send monthly)
- Refinance Alert (triggered by rate drops)
- Move Prediction (proactive outreach)
- Custom (build from scratch)

### 3. Monitor Engagement
Go to **Analytics** → View:
- Open rates per campaign
- Click rates and links clicked
- Client segment performance
- Trending performance

### 4. Respond to Alerts
Go to **Dashboard** → **Lead Alerts** section shows:
- Clients likely to move (9-12 months)
- Refinance-ready clients
- New equity milestones

## Integration with Comunicake

**Sidebar:** HomeBot appears as an icon in the main navigation
**Contacts:** HomeBot pulls from existing Comunicake contacts
**Pipeline:** Track campaign responses as pipeline opportunities
**Activities:** Log follow-ups and outreach

## Data Model

### Clients Table
```
id: string
name: string
email: string
phone: string
address: string
homeValue: number (estimated)
equity: number (calculated)
loanAmount: number
ltv: number (loan-to-value ratio)
status: "active" | "prospect" | "archived"
lastContact: date
createdAt: date
```

### Campaigns Table
```
id: string
name: string
templateType: "digest" | "refinance" | "move_prediction" | "custom"
recipients: number
openRate: number (%)
clickRate: number (%)
sentDate: date
status: "scheduled" | "sending" | "sent"
createdBy: string
```

### Engagement Events
```
id: string
clientId: string
campaignId: string
event: "opened" | "clicked" | "replied"
timestamp: date
metadata: object (which link clicked, etc)
```

## Real API Integrations (Future)

HomeBot is ready to integrate with:

### Property Data APIs
- **Zillow API**: Get automated home values
- **Redfin API**: Market trends & equity estimates
- **Estated API**: Property history & assessments

### Email Service
- **SendGrid/Mailgun**: Send automated reports
- **HubSpot**: Track engagement in CRM

### Lead Scoring
- **Custom ML model**: Predict move/refinance likelihood
- **Behavioral analysis**: When clients view their equity

## Next Steps

1. **Connect your email service** (SendGrid/Mailgun) for sending
2. **Integrate property APIs** (Zillow/Redfin) for real home values
3. **Import your existing clients** from CSV
4. **Create your first campaign** using a template
5. **Schedule automated monthly sends**
6. **Monitor engagement** and iterate

## Troubleshooting

**"Import failed"** → Check CSV headers match expected format
**"Campaign not sending"** → Verify email service is configured
**"No clients showing"** → Check contacts imported successfully
**"Low open rates"** → Test different send times and subject lines

## Support

For issues or feature requests, contact your admin or submit a ticket in the app settings.

---

**HomeBot v2.0** | Built for Comunicake Mortgage CRM | 🍰 Made with ❤️
