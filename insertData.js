const mysql = require('mysql2/promise');

// Database connection settings
const dbConfig = {
    host: 'localhost',
    user: 'yourUsername',
    password: 'yourPassword',
    database: 'u724788492_sobatkrs'
};

async function insertData(entries) {
    console.log(entries);
    const connection = await mysql.createConnection(dbConfig);
    for (const entry of entries) {
        const { day, time, session, courseInfo } = entry;
        try {
            // Check if the class already exists by both kode_matkul and nama
            const [rows] = await connection.execute(
                'SELECT id FROM kelas WHERE kode_matkul = ? AND nama = ?',
                [courseInfo.code, courseInfo.name]
            );

            if (rows.length > 0) {
                // Class exists, update it
                const classId = rows[0].id;
                await connection.execute(
                    'UPDATE kelas SET updated_at = NOW() WHERE id = ?',
                    [classId]
                );
            } else {
                // Insert new class
                await connection.execute(
                    'INSERT INTO kelas (kode_matkul, nama, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
                    [courseInfo.code, courseInfo.name]
                );
            }
        } catch (error) {
            console.error('Database operation failed:', error);
        }
    }
    await connection.end();
}
