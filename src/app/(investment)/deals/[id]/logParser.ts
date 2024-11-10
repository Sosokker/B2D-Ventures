export interface LogEntry {
  id: number;
  operation_type: string;
  record_id: number;
  old_data: Record<string, any>;
  new_data: Record<string, any>;
  changed_at: string;
  table_name: string;
}

type ChangeSummary = {
  field: string;
  from: any;
  to: any;
};

function parseProjectLog(logs: LogEntry[]): { changes: ChangeSummary[]; table: string; changed_at: string }[] {
  return logs.map((log) => {
    const changes: ChangeSummary[] = [];

    if (log.table_name === "project_investment_detail") {
      if (log.operation_type === "UPDATE") {
        for (const key in log.old_data) {
          if (log.old_data[key] !== log.new_data[key]) {
            changes.push({
              field: key,
              from: log.old_data[key],
              to: log.new_data[key],
            });
          }
        }
      }
    }

    if (log.table_name === "project") {
      if (log.operation_type === "UPDATE") {
        for (const key in log.old_data) {
          if (log.old_data[key] !== log.new_data[key]) {
            changes.push({
              field: key,
              from: log.old_data[key],
              to: log.new_data[key],
            });
          }
        }
      }
    }

    return {
      table: log.table_name,
      changed_at: log.changed_at,
      changes,
    };
  });
}

export { parseProjectLog };
