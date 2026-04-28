# Zillow Zestimate Scraper Agent

## Overview
Scheduled background agent that fetches current Zillow Zestimate values for all 541 contacts and stores them in the database.

## How It Works

1. **Trigger:** Runs on schedule (hourly/daily via cron)
2. **Process:** 
   - Fetch all contacts from database
   - Query Zillow for each property's current estimate
   - Store result in `property_estimates` table with timestamp
3. **UI:** Displays cached estimate from database (no API wait)
4. **Benefits:**
   - No client-side timeouts
   - Batch processing is efficient
   - Values cached for instant display
   - Can run during off-peak hours

## Database Schema

```sql
CREATE TABLE property_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  state VARCHAR NOT NULL,
  zillow_estimate INT,
  zillow_url VARCHAR,
  updated_at TIMESTAMP DEFAULT NOW(),
  source VARCHAR DEFAULT 'zillow',
  UNIQUE(contact_id)
);

CREATE INDEX idx_property_estimates_contact_id ON property_estimates(contact_id);
```

## Scraper Agent Task

```bash
openclaw cron:add \
  --name "zillow-zestimate-scraper" \
  --schedule "0 */4 * * *" \
  --task "Fetch Zillow Zestimate values for all 541 contacts and cache in database"
```

## API Implementation

### GET /api/property-estimates/:contactId
Returns cached estimate or NULL if not yet fetched

### POST /api/scraper/zillow
Triggers immediate scrape (admin only)

## Next Steps
1. Set up Supabase table
2. Create scraper agent
3. Update UI to fetch from database instead of API
4. Test with sample of contacts
5. Deploy scheduled task
