const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  db: {
    getDepartments: () => ipcRenderer.invoke('db:getDepartments'),
    addDepartment: (dept) => ipcRenderer.invoke('db:addDepartment', dept),
    updateDepartment: (id, dept) => ipcRenderer.invoke('db:updateDepartment', id, dept),
    deleteDepartment: (id) => ipcRenderer.invoke('db:deleteDepartment', id),
    
    getWorkers: () => ipcRenderer.invoke('db:getWorkers'),
    addWorker: (worker) => ipcRenderer.invoke('db:addWorker', worker),
    updateWorker: (id, worker) => ipcRenderer.invoke('db:updateWorker', id, worker),
    deleteWorker: (id) => ipcRenderer.invoke('db:deleteWorker', id),
    
    getTasks: () => ipcRenderer.invoke('db:getTasks'),
    addTask: (task) => ipcRenderer.invoke('db:addTask', task),
    updateTask: (id, task) => ipcRenderer.invoke('db:updateTask', id, task),
    deleteTask: (id) => ipcRenderer.invoke('db:deleteTask', id),
    
    getHolidays: () => ipcRenderer.invoke('db:getHolidays'),
    addHoliday: (holiday) => ipcRenderer.invoke('db:addHoliday', holiday),
    updateHoliday: (id, holiday) => ipcRenderer.invoke('db:updateHoliday', id, holiday),
    deleteHoliday: (id) => ipcRenderer.invoke('db:deleteHoliday', id)
  }
});
