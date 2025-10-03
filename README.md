# 📌 CRUD con JSON Server

Este proyecto implementa un sistema **CRUD (Create, Read, Update, Delete)** utilizando **JSON Server** como base de datos simulada.  
La estructura del sistema incluye entidades relacionadas: **countries, regions, cities, companies y branches**.

---

## 🚀 Tecnologías utilizadas
- **HTML5**: Interfaz del usuario.
- **CSS3**: Estilos del sistema (layout, botones, tablas).
- **JavaScript (ES6 modules)**: Lógica del CRUD y componentes.
- **JSON Server**: API REST fake para la persistencia de datos.

---

## 🗂️ Estructura de la base de datos (`db.json`)

El archivo `db.json` debe contener los siguientes recursos:

```json
{
  "countries": [
    {
      "id": 1,
      "name": "Colombia"
    }
  ],
  "regions": [
    {
      "id": 1,
      "name": "Antioquia",
      "countryId": 1
    }
  ],
  "cities": [
    {
      "id": 1,
      "name": "Medellín",
      "regionId": 1
    }
  ],
  "companies": [
    {
      "id": 1,
      "name": "TechCorp",
      "UKNiu": "123456",
      "address": "Cra 10 #20",
      "cityId": 1,
      "email": "contacto@techcorp.com"
    }
  ],
  "branches": [
    {
      "id": 1,
      "number": "001",
      "name_commercial": "TechCorp Norte",
      "address": "Cra 15 #25",
      "email": "sucursal@empresa.com",
      "contact_name": "Juan Pérez",
      "phone": "3204567890",
      "cityId": 1,
      "companyId": 1
    }
  ]
}
````
## 🔗 Relaciones entre entidades

- **Countries → Regions**: un country tiene muchas regiones.  
- **Regions → Cities**: una región tiene muchas ciudades.  
- **Cities → Companies**: una ciudad puede tener varias compañías.  
- **Companies → Branches**: una compañía puede tener varias sucursales.  

---

## ⚙️ Instalación y uso

1. Instalar dependencias de JSON Server:
   ```bash
   npm install -g json-server
   ````
## ⚙️ Correr el servidor con el archivo db.json

```bash
npx json-server --watch db.json --port 3000
`````

Esto expone los siguientes endpoints:

http://localhost:3000/countries

http://localhost:3000/regions

http://localhost:3000/cities

http://localhost:3000/companies

http://localhost:3000/branches

Abrir el proyecto en el navegador (ejemplo con Live Server):

👉 http://127.0.0.1:5501/index.html
---

### AUTORA
- Wendy angelica vega sanchez
