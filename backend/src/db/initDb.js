const { run, get } = require("./dbClient");

async function initDb() {
  try {
    console.log("[DB] Init started");

    await run("PRAGMA foreign_keys = ON");

    await run(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INTEGER PRIMARY KEY,
        migration_name TEXT NOT NULL UNIQUE,
        applied_at TEXT NOT NULL
      );
    `);

    const migration1 = await get(`
      SELECT * 
      FROM schema_migrations 
      WHERE migration_name = '001_init_schema'
    `);

    if (!migration1) {
      console.log("[DB] Applying migration 001_init_schema");

      await run(`
        CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          createdAt TEXT NOT NULL
        );
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS Tickets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          subject TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('new', 'in_progress', 'done')),
          priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
          createdAt TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS TicketMessages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ticketId INTEGER NOT NULL,
          userId INTEGER NOT NULL,
          message TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          FOREIGN KEY (ticketId) REFERENCES Tickets(id) ON DELETE CASCADE,
          FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
      `);

      await run(`
        INSERT INTO schema_migrations (migration_name, applied_at)
        VALUES ('001_init_schema', '${new Date().toISOString()}');
      `);
    }

    const migration2 = await get(`
      SELECT * 
      FROM schema_migrations 
      WHERE migration_name = '002_add_indexes'
    `);

    if (!migration2) {
      console.log("[DB] Applying migration 002_add_indexes");

      await run(`
        CREATE INDEX IF NOT EXISTS idx_tickets_status ON Tickets(status);
      `);

      await run(`
        INSERT INTO schema_migrations (migration_name, applied_at)
        VALUES ('002_add_indexes', '${new Date().toISOString()}');
      `);
    }

    const userCount = await get(`
      SELECT COUNT(*) as count FROM Users
    `);

    if (userCount.count === 0) {
      console.log("[DB] Seeding data");

      const now = new Date().toISOString();

      await run(`
        INSERT INTO Users (name, email, createdAt) VALUES 
        ('Kyrian Karolina', 'karolina@gmail.com', '${now}'),
        ('Shevcova Inna', 'inna@gmail.com', '${now}'),
        ('Chernishova Anna', 'anna@gmail.com', '${now}'),
        ('Sidorenko Polina', 'polina@gmail.com', '${now}');
      `);

      await run(`
        INSERT INTO Tickets (userId, subject, description, status, priority, createdAt) VALUES 
        (1, 'System update', 'Need update', 'new', 'high', '${now}'),
        (2, 'Login issue', 'Cannot login', 'in_progress', 'medium', '${now}'),
        (3, 'Wi-Fi', 'Wi-Fi is not working', 'in_progress', 'medium', '${now}'),
        (4, 'UI Bug', 'Button issue', 'new', 'low', '${now}');
      `);

      await run(`
        INSERT INTO TicketMessages (ticketId, userId, message, createdAt) VALUES 
        (1, 1, 'Коли буде оновлення?', '${now}'),
        (1, 2, 'Плануємо на наступний тиждень.', '${now}'),
        (2, 2, 'Досі не можу зайти в систему.', '${now}');
      `);

      console.log("[DB] Seed completed");
    } else {
      console.log("[DB] Seed skipped");
    }

    console.log("[DB] Init finished");
  } catch (err) {
    console.error("[DB ERROR]", err);
    throw err;
  }
}

module.exports = { initDb };