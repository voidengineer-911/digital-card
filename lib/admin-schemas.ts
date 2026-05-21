import { z } from 'zod';

const slugRe = /^[a-z0-9](?:[a-z0-9-]{0,40}[a-z0-9])?$/;

const baseSchema = z.object({
  slug: z.string().regex(slugRe, 'lowercase letters, digits, hyphens; 1-42 chars'),
  template: z.enum(['lux', 'force']),
  brand: z.enum(['force-ai', 'force-media']).nullable(),
  defaultLocale: z.enum(['en', 'ar']),
  enName: z.string().min(1, 'required').max(80),
  enTitle: z.string().min(1, 'required').max(200),
  arName: z.string().min(1, 'required').max(80),
  arTitle: z.string().min(1, 'required').max(200),
  photoUrl: z.string().url(),
  phone: z.string().regex(/^\+?[0-9]{6,16}$/).nullable().or(z.literal('').transform(() => null)),
  phoneDisplay: z.string().max(40).nullable().or(z.literal('').transform(() => null)),
  whatsapp: z.string().regex(/^\+?[0-9]{6,16}$/).nullable().or(z.literal('').transform(() => null)),
  emails: z.array(z.string().email()).max(5).default([]),
  websites: z.array(z.string().min(3).max(200)).max(10).default([]),
  instagram: z.string().max(60).nullable().or(z.literal('').transform(() => null)),
  linkedin:  z.string().max(60).nullable().or(z.literal('').transform(() => null)),
  x:         z.string().max(60).nullable().or(z.literal('').transform(() => null)),
  github:    z.string().max(60).nullable().or(z.literal('').transform(() => null)),
  youtube:   z.string().max(60).nullable().or(z.literal('').transform(() => null)),
  tiktok:    z.string().max(60).nullable().or(z.literal('').transform(() => null)),
  copyrightYear: z.number().int().min(2000).max(2100),
});

export const cardInputSchema = baseSchema.superRefine((val, ctx) => {
  if (val.template === 'force' && !val.brand) {
    ctx.addIssue({ code: 'custom', path: ['brand'], message: 'brand is required when template is force' });
  }
  if (val.template === 'lux' && val.brand) {
    ctx.addIssue({ code: 'custom', path: ['brand'], message: 'brand must be empty for lux template' });
  }
});

export type CardInput = z.infer<typeof cardInputSchema>;
