"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = getConnection;
const mssql_1 = __importDefault(require("mssql"));
const config = {
    connectionString: process.env.SQL_CONNECTION_STRING,
    options: {
        encrypt: true // For Azure SQL
    }
};
async function getConnection() {
    if (!mssql_1.default.pool) {
        mssql_1.default.pool = await mssql_1.default.connect(config);
    }
    return mssql_1.default.pool;
}
exports.default = mssql_1.default;
