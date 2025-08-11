-- Corrected Database Schema for House Booking App
-- This fixes the data type mismatch issues

-- 1. Houses Table
CREATE TABLE IF NOT EXISTS houses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  images TEXT[],
  user_id UUID REFERENCES auth.users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bookings Table (Fixed: house_id is now INTEGER to match houses.id)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  house_id INTEGER REFERENCES houses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Upload Payments Table
CREATE TABLE IF NOT EXISTS upload_payments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for houses
CREATE POLICY "Users can view all houses" ON houses FOR SELECT USING (true);
CREATE POLICY "Users can insert their own houses" ON houses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own houses" ON houses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own houses" ON houses FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookings" ON bookings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for upload_payments
CREATE POLICY "Users can view their own payments" ON upload_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payments" ON upload_payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_houses_user_id ON houses(user_id);
CREATE INDEX IF NOT EXISTS idx_houses_verified ON houses(is_verified);
CREATE INDEX IF NOT EXISTS idx_bookings_house_id ON bookings(house_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON upload_payments(user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Check and fix images field if needed
-- If the images field doesn't exist or is not an array, this will fix it
DO $$
BEGIN
    -- Check if images column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'houses' AND column_name = 'images'
    ) THEN
        -- Add images column as TEXT array
        ALTER TABLE houses ADD COLUMN images TEXT[];
        RAISE NOTICE 'Added images column as TEXT array';
    ELSE
        -- Check if images column is TEXT array
        IF (
            SELECT data_type FROM information_schema.columns 
            WHERE table_name = 'houses' AND column_name = 'images'
        ) != 'ARRAY' THEN
            -- Convert to TEXT array
            ALTER TABLE houses ALTER COLUMN images TYPE TEXT[] USING ARRAY[images];
            RAISE NOTICE 'Converted images column to TEXT array';
        ELSE
            RAISE NOTICE 'Images column already exists as TEXT array';
        END IF;
    END IF;
END $$;
