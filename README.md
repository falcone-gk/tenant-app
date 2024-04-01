# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Estrucutra del proyecto Falcon App
Por el momento solo se agregará la administración de un hogar. **Se verá la posibilidad agregar otras casas y poder crear cada información desde cero**

## Páginas
Definimos la estructura de cada vista de página para organizar qué es lo que se verá y qué se podrá realizar en cada vista.

### Administración
Vista donde se podrá editar cada información disponible para editar. Actualmente incluye todo tipo de edición (GET, POST, PUT y DELETE) de los **Cuartos** e **Inquilinos**.

<!--
TODO:
    - Agregar Especificaciones de lo que se puede editar y las reglas a seguir.
    - Agregar una parte donde el admin pueda agregar nuevos pagos por realizar de inquilinos.
--> 

### Inquilinos
Vista donde se enlistan todos los inquilinos con sus datos y caracteristicas.

### Cuartos
Vista donde se enlistan todos los cuartos con sus datos y caracteristicas.

### Historial
Primero un historial de pagos de servicios de los inquilinos.

Inquilino | Cuarto (código) | servicio | Monto | Consumo del servicio | Fecha a pagar | Monto pagado | Fecha último pago | Pago Completado
--- | --- | --- | --- | --- | --- | --- | --- | ---
Tenant 1 | p1-a1 | Luz | 40 | 100kw or ?? | 2024/01/01 | 40 | 2024/01/15 | Si
Tenant 2 | p2-a1 | Agua | 20 | 20m3 or ?? | 2024/01/01 | 10 | 2024/01/15 | No

**Datos a tener en cuenta:**
- El símbolo '??' es porque puede ser un servicio que no realiza consumo (TV, internet) y en tabla se mostrará vacío.
- Se agregarán filtros a la tabla:
    + Por inquilino
    + Por cuarto
    + Por servicio
    + Rango de fechas (Filtrará tanto *fecha a pagar* y *fecha de último pago*)
    + Si ya realizó pago

Segundo historial donde muestra los pagos realizados y a realizar de los servicios en total de cada mes.

<!--
TODO: Crear una tabla de historial de pagos de servicios o Adaptarlo a la tabla de Payment ya creada.
-->

Servicio | Mes | Fecha de registro | Monto | Consumo
--- | --- | --- | --- | ---
Agua | Enero | 2024/01/01 | 300 | 100m3
Luz | Enero | 2024/01/01 | 600 | 500kw