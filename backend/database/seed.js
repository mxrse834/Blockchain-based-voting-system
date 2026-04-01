import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'voting_system',
  port: process.env.DB_PORT || 3306
});

async function seedDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    console.log('Starting database seeding...');

    // Hash passwords
    const adminHash = await bcrypt.hash('admin123456', 10);
    const voterHash = await bcrypt.hash('voter123456', 10);

    // Insert users
    const adminId = uuidv4();
    const voterId = uuidv4();

    await connection.execute(
      'INSERT INTO users (user_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [adminId, 'Admin User', 'admin@test.com', adminHash, 'ADMIN']
    );
    console.log('✓ Admin user created');

    await connection.execute(
      'INSERT INTO users (user_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [voterId, 'Voter User', 'voter@test.com', voterHash, 'VOTER']
    );
    console.log('✓ Voter user created');

    // Insert elections
    const election1Id = uuidv4();
    const election2Id = uuidv4();

    const now = new Date();
    const startTime1 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
    const endTime1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const startTime2 = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
    const endTime2 = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000); // 20 days from now

    await connection.execute(
      'INSERT INTO elections (election_id, title, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)',
      [election1Id, 'Presidential Election 2024', startTime1, endTime1, 'ACTIVE']
    );
    console.log('✓ Election 1 created');

    await connection.execute(
      'INSERT INTO elections (election_id, title, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)',
      [election2Id, 'Board of Directors 2024', startTime2, endTime2, 'UPCOMING']
    );
    console.log('✓ Election 2 created');

    // Insert candidates for election 1
    const candidateIds1 = [uuidv4(), uuidv4(), uuidv4()];
    const candidateNames1 = ['John Smith', 'Jane Doe', 'Mike Johnson'];

    for (let i = 0; i < candidateNames1.length; i++) {
      await connection.execute(
        'INSERT INTO candidates (candidate_id, election_id, name) VALUES (?, ?, ?)',
        [candidateIds1[i], election1Id, candidateNames1[i]]
      );
    }
    console.log('✓ Candidates for Election 1 created');

    // Insert candidates for election 2
    const candidateIds2 = [uuidv4(), uuidv4()];
    const candidateNames2 = ['Alice Williams', 'Bob Brown'];

    for (let i = 0; i < candidateNames2.length; i++) {
      await connection.execute(
        'INSERT INTO candidates (candidate_id, election_id, name) VALUES (?, ?, ?)',
        [candidateIds2[i], election2Id, candidateNames2[i]]
      );
    }
    console.log('✓ Candidates for Election 2 created');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin:');
    console.log('  Email: admin@test.com');
    console.log('  Password: admin123456');
    console.log('Voter:');
    console.log('  Email: voter@test.com');
    console.log('  Password: voter123456');

  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
    await pool.end();
  }
}

seedDatabase();
