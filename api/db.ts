import sql from 'mssql';

const config = {
    connectionString: process.env.SQL_CONNECTION_STRING,
    options: {
        encrypt: true // For Azure SQL
    }
};

export async function getConnection() {
    if (!sql.pool) {
        sql.pool = await sql.connect(config);
    }
    return sql.pool;
}

export default sql;
