// backend/swagger.js
const swaggerJSDoc   = require('swagger-jsdoc');
const swaggerUi     = require('swagger-ui-express');

const { requireAuth, requireAdmin } = require('./middleware/auth');  // Pfad ggf. anpassen

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LRT WebApp API',
      version: '1.0.0',
      description: 'Automatisch generierte API‑Dokumentation via Swagger',
    },
    servers: [
      { url: `${process.env.BASE_URL || 'http://localhost:3000'}/api` },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      parameters: {
        idParam: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'MongoDB ObjectId',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Nicht authentifiziert',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        Forbidden: {
          description: 'Keine Berechtigung',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        NotFound: {
          description: 'Nicht gefunden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    },
  },
  // Hier legst du fest, wo Swagger nach deinen JSDoc‑Kommentaren sucht
  apis: [ './controllers/*.js', './routes/*.js' ],
};

const spec = swaggerJSDoc(options);

module.exports = (app) => {
  // OpenAPI‑JSON frei verfügbar (z.B. für externe Tools)
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(spec);
  });

  // Swagger‑UI nur für authentifizierte Admins
  app.use(
    '/api/docs',
    requireAuth,
    requireAdmin,
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      explorer: true,
      swaggerOptions: {
        authAction: {
          bearerAuth: {
            name: 'bearerAuth',
            schema: { type: 'http', in: 'header', name: 'Authorization', description: '' },
            value: 'Bearer <TOKEN>',
          },
        },
      },
    }),
  );
};
