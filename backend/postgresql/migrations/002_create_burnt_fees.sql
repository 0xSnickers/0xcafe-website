-- ============================================================================
-- Burnt Fees 存储表创建脚本
-- 用途: 存储区块的燃烧费用数据（baseFee × gasUsed）
-- 创建日期: 2025-10-28
-- ============================================================================

-- 创建 burnt_fees 表（区块级别）
CREATE TABLE IF NOT EXISTS burnt_fees (
  id BIGSERIAL PRIMARY KEY,
  block_number BIGINT NOT NULL,
  timestamp BIGINT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 1,
  
  -- 区块基础数据
  block_hash TEXT NOT NULL,
  gas_limit NUMERIC(78, 0) NOT NULL,
  gas_used NUMERIC(78, 0) NOT NULL,
  
  -- baseFee 数据
  base_fee NUMERIC(78, 0) NOT NULL,
  base_fee_gwei DECIMAL(20, 9) GENERATED ALWAYS AS (
    base_fee / 1000000000.0
  ) STORED,
  
  -- 燃烧费用 (baseFee × gasUsed)
  burnt_fees NUMERIC(78, 0) GENERATED ALWAYS AS (
    base_fee * gas_used
  ) STORED,
  burnt_fees_eth DECIMAL(30, 18) GENERATED ALWAYS AS (
    (base_fee * gas_used) / 1000000000000000000.0
  ) STORED,
  
  -- 交易数量
  transaction_count INTEGER NOT NULL DEFAULT 0,
  
  synced_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT uk_burnt_fees_block_chain UNIQUE (block_number, chain_id)
);

-- 创建索引（优化查询性能）
CREATE INDEX IF NOT EXISTS idx_burnt_fees_block_number
  ON burnt_fees(block_number);

CREATE INDEX IF NOT EXISTS idx_burnt_fees_timestamp
  ON burnt_fees(timestamp);

CREATE INDEX IF NOT EXISTS idx_burnt_fees_chain_id
  ON burnt_fees(chain_id);

-- 创建复合索引（用于范围查询）
CREATE INDEX IF NOT EXISTS idx_burnt_fees_chain_time
  ON burnt_fees(chain_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_burnt_fees_chain_block
  ON burnt_fees(chain_id, block_number);

-- 添加注释
COMMENT ON TABLE burnt_fees IS '区块燃烧费用存储表';
COMMENT ON COLUMN burnt_fees.id IS '主键 ID';
COMMENT ON COLUMN burnt_fees.block_number IS '区块号';
COMMENT ON COLUMN burnt_fees.timestamp IS '区块时间戳';
COMMENT ON COLUMN burnt_fees.chain_id IS '链 ID (1=Ethereum)';
COMMENT ON COLUMN burnt_fees.block_hash IS '区块哈希';
COMMENT ON COLUMN burnt_fees.gas_limit IS '区块 Gas 限制';
COMMENT ON COLUMN burnt_fees.gas_used IS '区块实际使用的 Gas';
COMMENT ON COLUMN burnt_fees.base_fee IS 'Wei 单位的 baseFee';
COMMENT ON COLUMN burnt_fees.base_fee_gwei IS 'Gwei 单位的 baseFee（自动计算）';
COMMENT ON COLUMN burnt_fees.burnt_fees IS 'Wei 单位的燃烧费用（自动计算）';
COMMENT ON COLUMN burnt_fees.burnt_fees_eth IS 'ETH 单位的燃烧费用（自动计算）';
COMMENT ON COLUMN burnt_fees.transaction_count IS '区块中的交易数量';
COMMENT ON COLUMN burnt_fees.synced_at IS '同步时间';

-- ============================================================================
-- 创建聚合统计视图（可选：用于快速查询时间段统计）
-- ============================================================================

-- 按小时聚合
CREATE OR REPLACE VIEW burnt_fees_hourly AS
SELECT 
  chain_id,
  DATE_TRUNC('hour', TO_TIMESTAMP(timestamp)) as hour_start,
  COUNT(*) as block_count,
  SUM(gas_used) as total_gas_used,
  AVG(base_fee_gwei) as avg_base_fee_gwei,
  SUM(burnt_fees_eth) as total_burnt_eth
FROM burnt_fees
GROUP BY chain_id, DATE_TRUNC('hour', TO_TIMESTAMP(timestamp));

-- 按天聚合
CREATE OR REPLACE VIEW burnt_fees_daily AS
SELECT 
  chain_id,
  DATE_TRUNC('day', TO_TIMESTAMP(timestamp)) as day_start,
  COUNT(*) as block_count,
  SUM(gas_used) as total_gas_used,
  AVG(base_fee_gwei) as avg_base_fee_gwei,
  SUM(burnt_fees_eth) as total_burnt_eth
FROM burnt_fees
GROUP BY chain_id, DATE_TRUNC('day', TO_TIMESTAMP(timestamp));

COMMENT ON VIEW burnt_fees_hourly IS '按小时聚合的燃烧费用统计';
COMMENT ON VIEW burnt_fees_daily IS '按天聚合的燃烧费用统计';

