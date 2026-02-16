import { Router, Request, Response } from 'express';
import pool from '../db';
import { RowDataPacket } from 'mysql2';

const router = Router();

interface AuditRecord extends RowDataPacket {
  id: number;
  table_name: string;
  record_id: number;
  action: string;
  before_state: string | null;
  after_state: string | null;
  diff: string | null;
  changed_by: string;
  changed_at: Date;
}

interface CountResult extends RowDataPacket {
  total: number;
}

interface TableNameResult extends RowDataPacket {
  table_name: string;
}

// GET /api/audit-trail - Fetch audit records with filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      tableName,
      startDate,
      endDate,
      page = '1',
      limit = '50'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE clause dynamically
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (tableName) {
      conditions.push('table_name = ?');
      params.push(tableName as string);
    }

    if (startDate) {
      conditions.push('changed_at >= ?');
      params.push(startDate as string);
    }

    if (endDate) {
      conditions.push('changed_at <= ?');
      params.push(`${endDate} 23:59:59`);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM audit_log ${whereClause}`;
    const [countRows] = await pool.execute<CountResult[]>(countQuery, params);
    const total = countRows[0].total;

    // Get paginated data - use query() instead of execute() to avoid LIMIT/OFFSET parameter issues
    const dataQuery = `
      SELECT id, table_name, record_id, action, before_state, after_state, diff, changed_by, changed_at
      FROM audit_log
      ${whereClause}
      ORDER BY changed_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `;
    const [rows] = await pool.query<AuditRecord[]>(dataQuery, params);

    res.json({
      data: rows,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Error fetching audit trail:', error);
    res.status(500).json({ error: 'Failed to fetch audit trail records' });
  }
});

// GET /api/audit-trail/tables - Get distinct table names for dropdown
router.get('/tables', async (_req: Request, res: Response) => {
  try {
    const query = 'SELECT DISTINCT table_name FROM audit_log ORDER BY table_name';
    const [rows] = await pool.execute<TableNameResult[]>(query);
    const tableNames = rows.map(row => row.table_name);
    res.json(tableNames);
  } catch (error) {
    console.error('Error fetching table names:', error);
    res.status(500).json({ error: 'Failed to fetch table names' });
  }
});

export default router;
