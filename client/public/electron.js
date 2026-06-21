const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Database = require('better-sqlite3');
const os = require('os');
const fs = require('fs');

let mainWindow;
let db;

function initDatabase() {
  const dbPath = path.join(os.homedir(), 'AppData', 'Local', 'FainPlanning');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }
  
  db = new Database(path.join(dbPath, 'fainplanning.db'));
  
  // Crear tablas
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      color TEXT DEFAULT '#3B82F6',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      departmentId TEXT NOT NULL,
      position TEXT,
      maxHoursPerDay INTEGER DEFAULT 8,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(departmentId) REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      workerId TEXT NOT NULL,
      departmentId TEXT NOT NULL,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      hoursPerDay REAL DEFAULT 8,
      color TEXT DEFAULT '#10B981',
      taskOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(workerId) REFERENCES workers(id),
      FOREIGN KEY(departmentId) REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS holidays (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      date DATE NOT NULL UNIQUE,
      type TEXT DEFAULT 'company',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS holiday_departments (
      holidayId TEXT NOT NULL,
      departmentId TEXT NOT NULL,
      PRIMARY KEY(holidayId, departmentId),
      FOREIGN KEY(holidayId) REFERENCES holidays(id),
      FOREIGN KEY(departmentId) REFERENCES departments(id)
    );
  `);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'icon.ico')
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.on('ready', () => {
  initDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers para base de datos
const { ipcMain } = require('electron');
const { v4: uuidv4 } = require('uuid');

// Departments
ipcMain.handle('db:getDepartments', () => {
  return db.prepare('SELECT * FROM departments ORDER BY createdAt DESC').all();
});

ipcMain.handle('db:addDepartment', (event, dept) => {
  const id = uuidv4();
  db.prepare(`
    INSERT INTO departments (id, name, description, color)
    VALUES (?, ?, ?, ?)
  `).run(id, dept.name, dept.description, dept.color);
  return { id, ...dept };
});

ipcMain.handle('db:updateDepartment', (event, id, dept) => {
  db.prepare(`
    UPDATE departments 
    SET name = ?, description = ?, color = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(dept.name, dept.description, dept.color, id);
  return { id, ...dept };
});

ipcMain.handle('db:deleteDepartment', (event, id) => {
  db.prepare('DELETE FROM departments WHERE id = ?').run(id);
  return true;
});

// Workers
ipcMain.handle('db:getWorkers', () => {
  return db.prepare(`
    SELECT w.*, d.name as departmentName, d.color as departmentColor
    FROM workers w
    LEFT JOIN departments d ON w.departmentId = d.id
    ORDER BY w.createdAt DESC
  `).all();
});

ipcMain.handle('db:addWorker', (event, worker) => {
  const id = uuidv4();
  db.prepare(`
    INSERT INTO workers (id, name, email, departmentId, position, maxHoursPerDay)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, worker.name, worker.email, worker.departmentId, worker.position, worker.maxHoursPerDay);
  return { id, ...worker };
});

ipcMain.handle('db:updateWorker', (event, id, worker) => {
  db.prepare(`
    UPDATE workers 
    SET name = ?, email = ?, departmentId = ?, position = ?, maxHoursPerDay = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(worker.name, worker.email, worker.departmentId, worker.position, worker.maxHoursPerDay, id);
  return { id, ...worker };
});

ipcMain.handle('db:deleteWorker', (event, id) => {
  db.prepare('DELETE FROM workers WHERE id = ?').run(id);
  return true;
});

// Tasks
ipcMain.handle('db:getTasks', () => {
  return db.prepare(`
    SELECT t.*, w.name as workerName, d.name as departmentName
    FROM tasks t
    LEFT JOIN workers w ON t.workerId = w.id
    LEFT JOIN departments d ON t.departmentId = d.id
    ORDER BY t.startDate ASC, t.taskOrder ASC
  `).all();
});

ipcMain.handle('db:addTask', (event, task) => {
  const id = uuidv4();
  db.prepare(`
    INSERT INTO tasks (id, title, description, workerId, departmentId, startDate, endDate, priority, hoursPerDay, color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, task.title, task.description, task.workerId, task.departmentId, 
    task.startDate, task.endDate, task.priority, task.hoursPerDay, task.color
  );
  return { id, ...task };
});

ipcMain.handle('db:updateTask', (event, id, task) => {
  db.prepare(`
    UPDATE tasks 
    SET title = ?, description = ?, workerId = ?, departmentId = ?, startDate = ?, endDate = ?, 
        status = ?, priority = ?, hoursPerDay = ?, color = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    task.title, task.description, task.workerId, task.departmentId,
    task.startDate, task.endDate, task.status, task.priority,
    task.hoursPerDay, task.color, id
  );
  return { id, ...task };
});

ipcMain.handle('db:deleteTask', (event, id) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return true;
});

// Holidays
ipcMain.handle('db:getHolidays', () => {
  return db.prepare(`
    SELECT h.* FROM holidays h
    ORDER BY h.date ASC
  `).all();
});

ipcMain.handle('db:addHoliday', (event, holiday) => {
  const id = uuidv4();
  db.prepare(`
    INSERT INTO holidays (id, name, date, type)
    VALUES (?, ?, ?, ?)
  `).run(id, holiday.name, holiday.date, holiday.type);
  
  if (holiday.departments && holiday.departments.length > 0) {
    const insertDept = db.prepare('INSERT INTO holiday_departments (holidayId, departmentId) VALUES (?, ?)');
    for (const deptId of holiday.departments) {
      insertDept.run(id, deptId);
    }
  }
  return { id, ...holiday };
});

ipcMain.handle('db:updateHoliday', (event, id, holiday) => {
  db.prepare(`
    UPDATE holidays 
    SET name = ?, date = ?, type = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(holiday.name, holiday.date, holiday.type, id);
  
  db.prepare('DELETE FROM holiday_departments WHERE holidayId = ?').run(id);
  if (holiday.departments && holiday.departments.length > 0) {
    const insertDept = db.prepare('INSERT INTO holiday_departments (holidayId, departmentId) VALUES (?, ?)');
    for (const deptId of holiday.departments) {
      insertDept.run(id, deptId);
    }
  }
  return { id, ...holiday };
});

ipcMain.handle('db:deleteHoliday', (event, id) => {
  db.prepare('DELETE FROM holiday_departments WHERE holidayId = ?').run(id);
  db.prepare('DELETE FROM holidays WHERE id = ?').run(id);
  return true;
});

module.exports = { db };
