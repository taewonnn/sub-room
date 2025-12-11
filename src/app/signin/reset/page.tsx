'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';

type ForgotPasswordFormValues = {
  email: string;
};

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/signin/resetpassword`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || '이메일 전송에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>이메일을 확인해주세요</CardTitle>
            <CardDescription>비밀번호 재설정 링크를 이메일로 보냈습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/signin')} className="w-full">
              로그인 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>비밀번호 찾기</CardTitle>
          <CardDescription>가입하신 이메일 주소를 입력해주세요. 비밀번호 재설정 링크를 보내드립니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '전송 중...' : '재설정 링크 보내기'}
            </Button>
            <div className="text-center text-sm">
              <button type="button" onClick={() => router.push('/signin')} className="text-primary hover:underline">
                로그인 페이지로 돌아가기
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
