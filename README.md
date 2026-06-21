# FainPlanning 📊

Sistema de gestión de tareas con diagrama de Gantt interactivo para coordinar trabajos de operarios en diferentes departamentos.

## Características ✨

### Diagrama de Gantt Interactivo
- 📅 Vista visual de todas las tareas asignadas
- 🎯 Drag & Drop: Arrastra tareas en el tiempo o entre operarios
- 📏 Redimensionamiento: Ajusta la duración de tareas arrastrando los bordes
- 🔄 Auto-ordenamiento: Las tareas se reorganizan automáticamente
- 🗓️ Días festivos: Visualización de días no laborables
- 🔗 Selección de rangos: Crea tareas seleccionando días en las filas

### Gestión de Departamentos
- ➕ Crear nuevos departamentos
- ✏️ Editar información de departamentos
- 🎨 Personalizar colores por departamento
- 🗑️ Eliminar departamentos

### Gestión de Operarios
- ➕ Registrar nuevos operarios
- 🏢 Asignar a departamentos
- ⏰ Configurar horas máximas por día
- ✏️ Editar datos de operarios
- 🗑️ Gestionar activos/inactivos

### Gestión de Tareas
- ➕ Crear tareas directamente en el Gantt
- 📝 Definir título, descripción y detalles
- 👤 Asignar a operarios específicos
- ⚡ Establecer prioridades (Baja, Media, Alta)
- 📊 Rastrear estado (Pendiente, En Progreso, Completada, Cancelada)
- 🎨 Personalizar colores
- ✏️ Editar y eliminar tareas

### Gestión de Días Festivos
- 📅 Registrar días no laborables
- 🌍 Tipos: Nacional, Regional, Empresa
- 🏢 Asignar a departamentos específicos
- 📍 Visualización en el Gantt

## Tecnología 🛠️

### Backend
- **Node.js** con Express
- **MongoDB** para persistencia
- **RESTful APIs** completas

### Frontend
- **React 18** con hooks modernos
- **CSS3** con diseño responsivo
- **Lucide React** para iconos
- **Axios** para comunicación HTTP
- **date-fns** para manipulación de fechas

## Instalación 🚀

### Requisitos previos
- Node.js v14+
- MongoDB
- npm o yarn

### Setup

1. **Clonar repositorio**
```bash
git clone https://github.com/misticagaru-star/fainplanning.git
cd fainplanning
```

2. **Instalar dependencias**
```bash
npm run install-all
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tu configuración de MongoDB
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Estructura del Proyecto 📁

```
fainplanning/
├── server.js                 # Punto de entrada del servidor
├── models/                   # Modelos de MongoDB
│   ├── Department.js
│   ├── Worker.js
│   ├── Task.js
│   └── Holiday.js
├── routes/                   # Rutas de API
│   ├── departments.js
│   ├── workers.js
│   ├── tasks.js
│   └── holidays.js
├── client/                   # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   ├── GanttChart.js
│   │   │   ├── GanttRow.js
│   │   │   ├── TaskBlock.js
│   │   │   ├── Navigation.js
│   │   │   ├── DepartmentManager.js
│   │   │   ├── WorkerManager.js
│   │   │   ├── TaskManager.js
│   │   │   └── HolidayManager.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   └── package.json
└── package.json
```

## Uso 📖

### Crear una tarea en el Gantt
1. Navega a "Diagrama Gantt"
2. Selecciona un rango de días en la fila del operario
3. Introduce el nombre de la tarea
4. La tarea aparecerá inmediatamente en el diagrama

### Mover una tarea
1. Haz clic y arrastra la tarea hacia una nueva fecha
2. Suelta para confirmar el cambio

### Cambiar duración de tarea
1. Posiciona el ratón en el borde derecho de la tarea
2. Arrastra hacia la derecha para extender o izquierda para reducir

### Mover tarea entre operarios
1. Arrastra la tarea a la fila de otro operario
2. Las tareas se auto-reorganizarán

## APIs 🔌

### Departamentos
- `GET /api/departments` - Obtener todos
- `GET /api/departments/:id` - Obtener uno
- `POST /api/departments` - Crear
- `PATCH /api/departments/:id` - Actualizar
- `DELETE /api/departments/:id` - Eliminar

### Operarios
- `GET /api/workers` - Obtener todos
- `GET /api/workers/department/:departmentId` - Por departamento
- `POST /api/workers` - Crear
- `PATCH /api/workers/:id` - Actualizar
- `DELETE /api/workers/:id` - Eliminar

### Tareas
- `GET /api/tasks` - Obtener todas
- `GET /api/tasks/worker/:workerId` - Por operario
- `POST /api/tasks` - Crear
- `PATCH /api/tasks/:id` - Actualizar (incluyendo drag & drop)
- `DELETE /api/tasks/:id` - Eliminar

### Días Festivos
- `GET /api/holidays` - Obtener todos
- `GET /api/holidays/range/:startDate/:endDate` - Por rango de fechas
- `POST /api/holidays` - Crear
- `PATCH /api/holidays/:id` - Actualizar
- `DELETE /api/holidays/:id` - Eliminar

## Funcionalidades Avanzadas 🎯

### Auto-ordenamiento de tareas
Cuando mueves una tarea o cambias de operario, el sistema automáticamente:
- Recalcula el orden de las tareas
- Evita solapamientos
- Reorganiza las tareas existentes

### Validación de conflictos
- Verifica disponibilidad del operario
- Respeta días festivos
- Controla horas máximas por día

### Visualización de holidays
- Los días festivos se destacan en el Gantt
- Patrón visual distintivo para identificarlos
- Filtrable por departamento

## Contribuir 🤝

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia 📄

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Soporte 💬

Para reportar problemas o sugerencias, abre un issue en GitHub.

---

**FainPlanning** - Gestión de tareas simplificada ✨
