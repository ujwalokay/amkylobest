import { neon } from "@neondatabase/serverless";

export class SecureReadOnlyConnection {
  private sql;
  private allowedTables = ['device_configs', 'bookings'];
  
  constructor(connectionUrl: string) {
    this.sql = neon(connectionUrl);
  }

  async query(queryString: string, params?: any[]) {
    const cleanQuery = queryString.trim().toUpperCase();
    
    if (!cleanQuery.startsWith('SELECT')) {
      throw new Error('SECURITY: Only SELECT queries are allowed. Write operations are blocked.');
    }
    
    const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'TRUNCATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE'];
    for (const keyword of dangerousKeywords) {
      if (cleanQuery.includes(keyword)) {
        throw new Error(`SECURITY: Query contains forbidden keyword: ${keyword}`);
      }
    }
    
    for (const table of this.allowedTables) {
      if (cleanQuery.includes(table.toUpperCase())) {
        return this.sql([queryString] as any, ...(params || []));
      }
    }
    
    throw new Error('SECURITY: Query must access only allowed tables: ' + this.allowedTables.join(', '));
  }

  async executeTemplate(strings: TemplateStringsArray, ...values: any[]) {
    const queryString = strings.join('?');
    const cleanQuery = queryString.trim().toUpperCase();
    
    if (!cleanQuery.startsWith('SELECT')) {
      throw new Error('SECURITY: Only SELECT queries are allowed. Write operations are blocked.');
    }
    
    const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'TRUNCATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE'];
    for (const keyword of dangerousKeywords) {
      if (cleanQuery.includes(keyword)) {
        throw new Error(`SECURITY: Query contains forbidden keyword: ${keyword}`);
      }
    }
    
    return this.sql(strings as any, ...values);
  }
}
