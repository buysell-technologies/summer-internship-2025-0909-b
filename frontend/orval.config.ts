import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: '../server/docs/swagger.json',
      validation: false,
    },
    output: {
      mode: 'single',
      target: './src/api/generated/api.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/apiClient.ts',
          name: 'apiClient',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});