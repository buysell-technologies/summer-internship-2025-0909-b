import { z } from 'zod';

export const ProfileFormSchema = z.object({
  name: z.string().min(1, { message: '入力してください' }),
  email: z.string().min(1, { message: '入力してください' }).email({
    message:
      'メールアドレスの形式で入力してください（例: sample@buysell-technologies.com）',
  }),
});
