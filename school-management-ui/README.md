# SchoolManagementUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## UAT and production environments

Angular environment files are selected by the build configuration:

```bash
npm run build:uat
npm run build:prod
```

Use `npm run start:uat` to serve the UAT configuration locally; its dev-server proxy sends
`/api` requests to `http://localhost:8080`. Development builds keep using the API at
`http://<current-host>:8080/api`. UAT and production bundles use the relative `/api` URL,
so configure the deployed web server or reverse proxy to route `/api` to the Java API.
This keeps deployment hostnames out of the client bundle. If the API is hosted on a
different origin, update that environment file's `apiBaseUrl` and configure the API's
allowed CORS origins accordingly.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
