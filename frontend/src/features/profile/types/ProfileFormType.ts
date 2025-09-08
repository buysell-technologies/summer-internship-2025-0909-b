import z from 'zod';
import type { ProfileFormSchema } from '../schemas/ProfileFormSchema';

export type ProfileFormType = z.infer<typeof ProfileFormSchema>;
