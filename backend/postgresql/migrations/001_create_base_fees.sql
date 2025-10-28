-- ============================================================================
-- baseFee 存储表创建脚本
-- 用途: 存储从 RPC 获取的区块 baseFee 数据
-- 创建日期: 2024-10-28
-- ============================================================================

-- 创建 base_fees 表
CREATE TABLE IF NOT EXISTS base_fees (
  id BIGSERIAL PRIMARY KEY,
  block_number BIGINT NOT NULL,
  base_fee NUMERIC(78, 0) NOT NULL,
  base_fee_gwei DECIMAL(20, 9) GENERATED ALWAYS AS (
    base_fee / 1000000000.0
  ) STORED,
  timestamp BIGINT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 1,
  synced_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT uk_block_chain UNIQUE (block_number, chain_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_base_fees_block_number 
  ON base_fees(block_number);

CREATE INDEX IF NOT EXISTS idx_base_fees_timestamp 
  ON base_fees(timestamp);

CREATE INDEX IF NOT EXISTS idx_base_fees_chain_id 
  ON base_fees(chain_id);

-- 创建复合索引（用于范围查询）
CREATE INDEX IF NOT EXISTS idx_base_fees_chain_time 
  ON base_fees(chain_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_base_fees_chain_block 
  ON base_fees(chain_id, block_number);

-- 添加注释
COMMENT ON TABLE base_fees IS '区块 baseFee 存储表';
COMMENT ON COLUMN base_fees.id IS '主键 ID';
COMMENT ON COLUMN base_fees.block_number IS '区块号';
COMMENT ON COLUMN base_fees.base_fee IS 'Wei 单位的 baseFee';
COMMENT ON COLUMN base_fees.base_fee_gwei IS 'Gwei 单位的 baseFee（自动计算）';
COMMENT ON COLUMN base_fees.timestamp IS '区块时间戳';
COMMENT ON COLUMN base_fees.chain_id IS '链 ID (1=Ethereum)';
COMMENT ON COLUMN base_fees.synced_at IS '同步时间';

-- 示例数据（可选）
-- INSERT INTO base_fees (block_number, base_fee, timestamp, chain_id)
-- VALUES 
--   (21000000, 25000000000, 1730102400, 1),
--   (21000001, 26000000000, 1730102412, 1);

