-- schema.sql - PostgreSQL Database Schema for Meta Funnel Insights

-- Campaign Insights Table
CREATE TABLE IF NOT EXISTS campaign_insights (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    country VARCHAR(50) NOT NULL,
    account_id VARCHAR(100) NOT NULL,
    account_label VARCHAR(255),
    
    campaign_id VARCHAR(100) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    objective VARCHAR(100),
    campaign_goal VARCHAR(50), -- awareness, traffic, leads, sales, app_installs
    funnel_stage VARCHAR(10), -- TOF, MOF, BOF
    
    -- Spend & Budget
    spend DECIMAL(12, 2) DEFAULT 0,
    budget_remaining DECIMAL(12, 2),
    daily_budget DECIMAL(12, 2),
    
    -- Reach & Impressions
    reach BIGINT DEFAULT 0,
    impressions BIGINT DEFAULT 0,
    frequency DECIMAL(5, 2) DEFAULT 0,
    cpm DECIMAL(10, 2) DEFAULT 0,
    cpp DECIMAL(10, 2) DEFAULT 0,
    
    -- Engagement
    clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    ctr DECIMAL(5, 4) DEFAULT 0,
    unique_ctr DECIMAL(5, 4) DEFAULT 0,
    cpc DECIMAL(10, 2) DEFAULT 0,
    cost_per_unique_click DECIMAL(10, 2) DEFAULT 0,
    outbound_clicks INTEGER DEFAULT 0,
    landing_page_views INTEGER DEFAULT 0,
    cost_per_landing_page_view DECIMAL(10, 2) DEFAULT 0,
    
    -- Video Metrics
    video_views INTEGER DEFAULT 0,
    thruplays INTEGER DEFAULT 0,
    cost_per_thruplay DECIMAL(10, 2) DEFAULT 0,
    video_plays_25 INTEGER DEFAULT 0,
    video_plays_50 INTEGER DEFAULT 0,
    video_plays_75 INTEGER DEFAULT 0,
    video_plays_95 INTEGER DEFAULT 0,
    video_plays_100 INTEGER DEFAULT 0,
    video_3_sec_plays INTEGER DEFAULT 0,
    video_avg_time_watched DECIMAL(10, 2) DEFAULT 0,
    
    -- Social Engagement
    post_engagement INTEGER DEFAULT 0,
    post_reactions INTEGER DEFAULT 0,
    post_comments INTEGER DEFAULT 0,
    post_shares INTEGER DEFAULT 0,
    post_saves INTEGER DEFAULT 0,
    page_likes INTEGER DEFAULT 0,
    cost_per_page_like DECIMAL(10, 2) DEFAULT 0,
    
    -- Consideration
    content_views INTEGER DEFAULT 0,
    unique_content_views INTEGER DEFAULT 0,
    cost_per_content_view DECIMAL(10, 2) DEFAULT 0,
    add_to_cart INTEGER DEFAULT 0,
    unique_add_to_cart INTEGER DEFAULT 0,
    cost_per_add_to_cart DECIMAL(10, 2) DEFAULT 0,
    view_content INTEGER DEFAULT 0,
    cost_per_view_content DECIMAL(10, 2) DEFAULT 0,
    search INTEGER DEFAULT 0,
    cost_per_search DECIMAL(10, 2) DEFAULT 0,
    
    -- Lead Generation
    leads INTEGER DEFAULT 0,
    unique_leads INTEGER DEFAULT 0,
    cost_per_lead DECIMAL(10, 2) DEFAULT 0,
    onsite_leads INTEGER DEFAULT 0,
    messenger_conversations INTEGER DEFAULT 0,
    cost_per_conversation DECIMAL(10, 2) DEFAULT 0,
    
    -- App
    app_installs INTEGER DEFAULT 0,
    cost_per_app_install DECIMAL(10, 2) DEFAULT 0,
    mobile_app_actions INTEGER DEFAULT 0,
    cost_per_mobile_app_action DECIMAL(10, 2) DEFAULT 0,
    
    -- Conversions
    conversions INTEGER DEFAULT 0,
    cost_per_conversion DECIMAL(10, 2) DEFAULT 0,
    purchases INTEGER DEFAULT 0,
    unique_purchases INTEGER DEFAULT 0,
    website_purchases INTEGER DEFAULT 0,
    offline_purchases INTEGER DEFAULT 0,
    cost_per_purchase DECIMAL(10, 2) DEFAULT 0,
    
    -- Revenue
    revenue DECIMAL(12, 2) DEFAULT 0,
    purchase_conversion_value DECIMAL(12, 2) DEFAULT 0,
    roas DECIMAL(10, 2) DEFAULT 0,
    aov DECIMAL(10, 2) DEFAULT 0,
    ltv DECIMAL(10, 2) DEFAULT 0,
    
    -- Checkout
    initiate_checkout INTEGER DEFAULT 0,
    cost_per_initiate_checkout DECIMAL(10, 2) DEFAULT 0,
    add_payment_info INTEGER DEFAULT 0,
    cost_per_add_payment_info DECIMAL(10, 2) DEFAULT 0,
    
    -- Advanced Conversions
    complete_registration INTEGER DEFAULT 0,
    cost_per_complete_registration DECIMAL(10, 2) DEFAULT 0,
    contact INTEGER DEFAULT 0,
    cost_per_contact DECIMAL(10, 2) DEFAULT 0,
    subscribe INTEGER DEFAULT 0,
    cost_per_subscribe DECIMAL(10, 2) DEFAULT 0,
    
    -- Offline
    offline_revenue DECIMAL(12, 2) DEFAULT 0,
    store_visits INTEGER DEFAULT 0,
    cost_per_store_visit DECIMAL(10, 2) DEFAULT 0,
    
    -- Quality Metrics
    quality_ranking VARCHAR(20),
    engagement_rate_ranking VARCHAR(20),
    conversion_rate_ranking VARCHAR(20),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, date, account_id)
);

-- Audience Insights Table
CREATE TABLE IF NOT EXISTS audience_insights (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    country VARCHAR(50) NOT NULL,
    account_id VARCHAR(100) NOT NULL,
    
    campaign_id VARCHAR(100),
    campaign_name VARCHAR(255),
    campaign_goal VARCHAR(50),
    funnel_stage VARCHAR(10),
    
    breakdown_type VARCHAR(50) NOT NULL, -- demographics, location, device, platform
    
    -- Demographics
    age VARCHAR(20),
    gender VARCHAR(20),
    
    -- Location
    city VARCHAR(100),
    region VARCHAR(100),
    dma VARCHAR(100),
    
    -- Device
    device_platform VARCHAR(50),
    impression_device VARCHAR(50),
    
    -- Platform
    publisher_platform VARCHAR(50), -- facebook, instagram, messenger, audience_network
    platform_position VARCHAR(100), -- feed, stories, reels, etc.
    
    -- Metrics
    spend DECIMAL(12, 2) DEFAULT 0,
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    frequency DECIMAL(5, 2) DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr DECIMAL(5, 4) DEFAULT 0,
    cpc DECIMAL(10, 2) DEFAULT 0,
    cpm DECIMAL(10, 2) DEFAULT 0,
    landing_page_views INTEGER DEFAULT 0,
    add_to_cart INTEGER DEFAULT 0,
    leads INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    cpa DECIMAL(10, 2) DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0,
    roas DECIMAL(10, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(date, breakdown_type, account_id, age, gender, city, device_platform, publisher_platform, platform_position)
);

-- Ad Set Insights Table
CREATE TABLE IF NOT EXISTS adset_insights (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    country VARCHAR(50) NOT NULL,
    account_id VARCHAR(100) NOT NULL,
    
    campaign_id VARCHAR(100) NOT NULL,
    campaign_name VARCHAR(255),
    adset_id VARCHAR(100) NOT NULL,
    adset_name VARCHAR(255) NOT NULL,
    campaign_goal VARCHAR(50),
    funnel_stage VARCHAR(10),
    
    spend DECIMAL(12, 2) DEFAULT 0,
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr DECIMAL(5, 4) DEFAULT 0,
    cpc DECIMAL(10, 2) DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0,
    roas DECIMAL(10, 2) DEFAULT 0,
    cpa DECIMAL(10, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(adset_id, date, account_id)
);

-- Ad Insights Table
CREATE TABLE IF NOT EXISTS ad_insights (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    country VARCHAR(50) NOT NULL,
    account_id VARCHAR(100) NOT NULL,
    
    campaign_id VARCHAR(100) NOT NULL,
    adset_id VARCHAR(100) NOT NULL,
    ad_id VARCHAR(100) NOT NULL,
    ad_name VARCHAR(255) NOT NULL,
    campaign_goal VARCHAR(50),
    funnel_stage VARCHAR(10),
    
    spend DECIMAL(12, 2) DEFAULT 0,
    impressions BIGINT DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr DECIMAL(5, 4) DEFAULT 0,
    cpc DECIMAL(10, 2) DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0,
    roas DECIMAL(10, 2) DEFAULT 0,
    cpa DECIMAL(10, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(ad_id, date, account_id)
);

-- Indexes for Performance
CREATE INDEX idx_campaign_insights_date ON campaign_insights(date);
CREATE INDEX idx_campaign_insights_country ON campaign_insights(country);
CREATE INDEX idx_campaign_insights_account ON campaign_insights(account_id);
CREATE INDEX idx_campaign_insights_goal ON campaign_insights(campaign_goal);
CREATE INDEX idx_campaign_insights_funnel ON campaign_insights(funnel_stage);
CREATE INDEX idx_campaign_insights_roas ON campaign_insights(roas DESC);

CREATE INDEX idx_audience_insights_date ON audience_insights(date);
CREATE INDEX idx_audience_insights_breakdown ON audience_insights(breakdown_type);
CREATE INDEX idx_audience_insights_country ON audience_insights(country);
CREATE INDEX idx_audience_insights_account ON audience_insights(account_id);

CREATE INDEX idx_adset_insights_date ON adset_insights(date);
CREATE INDEX idx_adset_insights_campaign ON adset_insights(campaign_id);

CREATE INDEX idx_ad_insights_date ON ad_insights(date);
CREATE INDEX idx_ad_insights_adset ON ad_insights(adset_id);

-- Update Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaign_insights_updated_at BEFORE UPDATE ON campaign_insights
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audience_insights_updated_at BEFORE UPDATE ON audience_insights
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adset_insights_updated_at BEFORE UPDATE ON adset_insights
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_insights_updated_at BEFORE UPDATE ON ad_insights
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();