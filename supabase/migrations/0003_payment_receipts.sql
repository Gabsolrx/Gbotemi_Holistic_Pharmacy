-- ====================================================================
-- GBOTEMI HOLISTIC PHARMACY - PAYMENT RECEIPTS TABLE MIGRATION
-- ====================================================================

CREATE TABLE IF NOT EXISTS payment_receipts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_receipts_order_id ON payment_receipts(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_user_id ON payment_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_status ON payment_receipts(status);

-- Enable RLS
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own payment receipts
CREATE POLICY "Users can view own payment receipts" 
ON payment_receipts FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow admins full access
CREATE POLICY "Admins full access to payment receipts" 
ON payment_receipts FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'super_admin')
    )
);

-- Allow public or anon checkout users to submit receipts
CREATE POLICY "Anyone can insert payment receipts during checkout" 
ON payment_receipts FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
