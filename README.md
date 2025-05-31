# Gym Management System

Sistema integral de gestión para gimnasios que automatiza la administración de socios, entrenadores, pagos y seguimiento de progreso.

## 🚀 Características Principales

### Para Socios
- Registro y autogestión de cuenta
- Reserva de turnos y clases
- Seguimiento de rutinas y progreso
- Pagos en línea
- Notificaciones y recordatorios

### Para Entrenadores
- Gestión de clientes asignados
- Creación y seguimiento de rutinas
- Control de asistencia
- Comunicación con socios

### Para Administradores
- Gestión completa de socios y membresías
- Facturación y cobranzas
- Reportes y análisis
- Gestión del personal

## 🛠️ Tecnologías

### Frontend
- SvelteKit (TypeScript)
- Tailwind CSS
- PWA habilitado

### Backend
- NestJS (Node.js)
- TypeORM
- PostgreSQL
- JWT para autenticación

### Infraestructura
- Docker
- Nginx
- GitHub Actions para CI/CD
- AWS/VPS para producción

## 🚀 Empezando

### Requisitos
- Node.js 18+
- Docker y Docker Compose
- pnpm (recomendado)

### Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/gym-management.git
cd gym-management
```

2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar las variables según sea necesario
```

3. Iniciar con Docker
```bash
docker-compose up -d
```

4. Acceder a la aplicación
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PGAdmin: http://localhost:5050

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
