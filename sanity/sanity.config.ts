import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'aicslucca',
  title: 'AICS Lucca CMS',
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID ?? 'PLACEHOLDER_PROJECT_ID',
  dataset: import.meta.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
