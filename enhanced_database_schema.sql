-- Enhanced Database Schema for House Booking App with Admin Management

-- 1. Enhanced Houses Table
ALTER TABLE houses ADD COLUMN IF NOT EXISTS price_per_night DECIMAL(10,2);
ALTER TABLE houses ADD COLUMN IF NOT EXISTS max_guests INTEGER DEFAULT 1;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 1;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 1;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS location_address TEXT;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8);
ALTER TABLE houses ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);
ALTER TABLE houses ADD COLUMN IF NOT EXISTS amenities TEXT[]; -- Array of amenities
ALTER TABLE houses ADD COLUMN IF NOT EXISTS house_rules TEXT;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS cancellation_policy VARCHAR(50);
ALTER TABLE houses ADD COLUMN IF NOT EXISTS check_in_time TIME DEFAULT '15:00';
ALTER TABLE houses ADD COLUMN IF NOT EXISTS check_out_time TIME DEFAULT '11:00';
ALTER TABLE houses ADD COLUMN IF NOT EXISTS admin_notes TEXT; -- For admin use
ALTER TABLE houses ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0; -- For admin sorting
ALTER TABLE houses ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Admin Management Tables
CREATE TABLE IF NOT EXISTS admin_actions (
  id SERIAL PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id),
  action_type VARCHAR(50) NOT NULL, -- 'verify_house', 'suspend_user', 'feature_house', etc.
  target_type VARCHAR(50) NOT NULL, -- 'house', 'user', 'booking'
  target_id INTEGER NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_permissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  permission_level VARCHAR(20) NOT NULL, -- 'super_admin', 'moderator', 'support'
  permissions JSONB, -- Specific permissions like ['verify_houses', 'manage_users']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 3. Enhanced User Profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS admin_level VARCHAR(20) DEFAULT 'user';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS documents_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- 4. Enhanced Bookings Table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_count INTEGER DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_by UUID REFERENCES auth.users(id);

-- 5. Enhanced Payments Table
ALTER TABLE upload_payments ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE upload_payments ADD COLUMN IF NOT EXISTS refunded BOOLEAN DEFAULT FALSE;
ALTER TABLE upload_payments ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE upload_payments ADD COLUMN IF NOT EXISTS refunded_by UUID REFERENCES auth.users(id);
ALTER TABLE upload_payments ADD COLUMN IF NOT EXISTS refund_reason TEXT;

-- 6. System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- 7. Notification System
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'booking_request', 'admin_action', 'system'
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action_url TEXT, -- URL to navigate to when notification is tapped
  metadata JSONB -- Additional data for the notification
);

-- 8. Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_houses_verified ON houses(is_verified);
CREATE INDEX IF NOT EXISTS idx_houses_featured ON houses(featured);
CREATE INDEX IF NOT EXISTS idx_houses_status ON houses(status);
CREATE INDEX IF NOT EXISTS idx_houses_location ON houses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON admin_actions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON admin_actions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON user_profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verification ON user_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_actions
CREATE POLICY "Admins can view all admin actions" ON admin_actions FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
);
CREATE POLICY "Admins can insert admin actions" ON admin_actions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
);

-- RLS Policies for admin_permissions
CREATE POLICY "Admins can view all permissions" ON admin_permissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
);
CREATE POLICY "Admins can manage permissions" ON admin_permissions FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
);

-- RLS Policies for system_settings
CREATE POLICY "Admins can view all settings" ON system_settings FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
);
CREATE POLICY "Admins can manage settings" ON system_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all notifications" ON notifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
);

-- RLS Policies for audit_log
CREATE POLICY "Admins can view audit log" ON audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('upload_fee', '9.99', 'number', 'Fee charged for uploading house images'),
('max_images_per_house', '10', 'number', 'Maximum number of images allowed per house'),
('auto_verify_houses', 'false', 'boolean', 'Whether to automatically verify new houses'),
('admin_email', 'admin@bookingapp.com', 'string', 'Admin contact email'),
('support_phone', '+1234567890', 'string', 'Support phone number'),
('terms_of_service_url', 'https://bookingapp.com/terms', 'string', 'Terms of service URL'),
('privacy_policy_url', 'https://bookingapp.com/privacy', 'string', 'Privacy policy URL')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_houses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for houses table
CREATE TRIGGER update_houses_updated_at 
    BEFORE UPDATE ON houses 
    FOR EACH ROW EXECUTE FUNCTION update_houses_updated_at();

-- Create function to log audit changes
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
        VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (user_id, action, table_name, record_id, old_values)
        VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (user_id, action, table_name, record_id, new_values)
        VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create audit triggers for important tables
CREATE TRIGGER audit_houses_changes
    AFTER INSERT OR UPDATE OR DELETE ON houses
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_bookings_changes
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER audit_user_profiles_changes
    AFTER INSERT OR UPDATE OR DELETE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_uuid AND is_admin = true
    );
END;
$$ language 'plpgsql';

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT permissions FROM admin_permissions 
        WHERE user_id = user_uuid
        LIMIT 1
    );
END;
$$ language 'plpgsql';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create a view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM houses) as total_houses,
    (SELECT COUNT(*) FROM houses WHERE is_verified = false) as pending_verifications,
    (SELECT COUNT(*) FROM user_profiles) as total_users,
    (SELECT COUNT(*) FROM bookings) as total_bookings,
    (SELECT COUNT(*) FROM upload_payments WHERE status = 'completed') as completed_payments,
    (SELECT COALESCE(SUM(amount), 0) FROM upload_payments WHERE status = 'completed') as total_revenue,
    (SELECT COUNT(*) FROM user_profiles WHERE verification_status = 'pending') as pending_user_verifications,
    (SELECT COUNT(*) FROM user_profiles WHERE verification_status = 'suspended') as suspended_users;

-- Create a view for recent admin actions
CREATE OR REPLACE VIEW recent_admin_actions AS
SELECT 
    aa.id,
    aa.action_type,
    aa.target_type,
    aa.target_id,
    aa.details,
    aa.created_at,
    up.full_name as admin_name
FROM admin_actions aa
JOIN user_profiles up ON aa.admin_user_id = up.id
ORDER BY aa.created_at DESC
LIMIT 50;
