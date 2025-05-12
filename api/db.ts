import sql from 'mssql';

export async function getConnection() {
    if (!sql.pool) {
        sql.pool = await sql.connect(process.env.SQL_CONNECTION_STRING as string);
    }
    return sql.pool;
}

export default sql;
