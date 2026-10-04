import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sammlungen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sammlungen' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string().min(1, 'Titel darf nicht leer sein'),
      beschreibung: z.string().min(1),
      titelbild: image(),
      titelbildAlt: z.string().min(1, 'Alt-Text für das Titelbild ist Pflicht'),
      sortierung: z.number().int().optional(),
      datum: z.coerce.date().optional(),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      datum: z.coerce.date().default(() => new Date()),
      sammlung: z.string().min(1, 'Post benötigt eine Sammlung-Referenz'),
      bilder: z
        .array(
          z.object({
            datei: image(),
            alt: z.string().min(1, 'Jedes Bild benötigt einen Alt-Text'),
          }),
        )
        .min(1, 'Ein Post braucht mindestens 1 Bild')
        .max(5, 'Ein Post darf höchstens 3 Bilder haben'),
    }),
});

export const collections = { sammlungen, posts };
