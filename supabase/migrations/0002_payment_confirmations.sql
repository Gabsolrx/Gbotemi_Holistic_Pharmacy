-- ====================================================================
-- GBOTEMI HOLISTIC PHARMACY - PAYMENT CONFIRMATIONS MIGRATION
-- ====================================================================

CREATE TABLE IF NOT EXISTS payment_confirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    amount NUMERIC(10, 2),
    message_text TEXT NOT NULL,
    channel TEXT DEFAULT 'whatsapp',
    confirmed_by TEXT DEFAULT 'admin',
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE payment_confirmations ENABLE ROW LEVEL SECURITY;

-- Allow read for authenticated admins and system operations
CREATE POLICY "Allow authenticated read payment confirmations" 
ON payment_confirmations FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated and anon insert for admin confirmation logging
CREATE POLICY "Allow insert payment confirmations" 
ON payment_confirmations FOR INSERT 
WITH CHECK (true);

-- Indexes for fast order lookup
CREATE INDEX IF NOT EXISTS idx_payment_confirmations_order_id ON payment_confirmations(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_confirmations_phone ON payment_confirmations(customer_phone);
