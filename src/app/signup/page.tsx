'use client';

import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/supabase/client/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (values: SignUpFormValues) => {
    setLoading(true);
    setError('');

    try {
      await signUp(values.email, values.password, values.name);
      setSuccess(true);
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err: unknown) {
      setError((err as Error).message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-green-600 dark:text-green-400 text-lg font-semibold">회원가입 성공!</div>
              <p className="text-muted-foreground">로그인 페이지로 이동합니다...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>새 계정을 만들어 구독 서비스를 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                disabled={loading}
                {...register('name', {
                  required: '이름을 입력해주세요.',
                  minLength: { value: 2, message: '이름은 2자 이상이어야 합니다.' },
                })}
              />
              <div className="h-[15px]">
                <p className={`text-sm text-destructive transition-opacity ${errors.name ? 'opacity-100' : 'opacity-0'}`}>
                  {errors.name?.message || '\u00A0'}
                </p>
              </div>
            </div>
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
                placeholder="최소 6자 이상"
                disabled={loading}
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                  minLength: { value: 6, message: '비밀번호는 6자 이상이어야 합니다.' },
                })}
              />
              <div className="h-[15px]">
                <p className={`text-sm text-destructive transition-opacity ${errors.password ? 'opacity-100' : 'opacity-0'}`}>
                  {errors.password?.message || '\u00A0'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                disabled={loading}
                {...register('confirmPassword', {
                  required: '비밀번호를 다시 입력해주세요.',
                  validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
                })}
              />
              <div className="h-[15px]">
                <p className={`text-sm text-destructive transition-opacity ${errors.confirmPassword ? 'opacity-100' : 'opacity-0'}`}>
                  {errors.confirmPassword?.message || '\u00A0'}
                </p>
              </div>
            </div>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '가입 중...' : '회원가입'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <button type="button" onClick={() => router.push('/signin')} className="text-primary hover:underline">
                로그인
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
