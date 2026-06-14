import sql from 'mssql';

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    server: process.env.SQL_SERVER || "",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // Mandatory for Azure SQL
        trustServerCertificate: false 
    }
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export const getDbConnection = () => {
    if (poolPromise) return poolPromise;
    poolPromise = new sql.ConnectionPool(config).connect();
    return poolPromise;
};