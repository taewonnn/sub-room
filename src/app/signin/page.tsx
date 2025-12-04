'use client';

import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type SignInFormValues = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setLoading(true);
    setError('');

    try {
      await signIn(values.email, values.password);
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>구독 서비스를 관리하려면 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                disabled={loading}
                {...register('email', {
                  required: '이메일을 입력해주세요.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '올바른 이메일 형식이 아닙니다.',
                  },
                })}
              />
              <div className="h-[15px]">
                <p className={`text-sm text-destructive transition-opacity ${errors.email ? 'opacity-100' : 'opacity-0'}`}>
                  {errors.email?.message || '\u00A0'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                disabled={loading}
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                })}
              />
              <div className="h-[15px]">
                <p className={`text-sm text-destructive transition-opacity ${errors.password ? 'opacity-100' : 'opacity-0'}`}>
                  {errors.password?.message || '\u00A0'}
                </p>
              </div>
            </div>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              계정이 없으신가요?{' '}
              <button type="button" onClick={() => router.push('/signup')} className="text-primary hover:underline">
                회원가입
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
