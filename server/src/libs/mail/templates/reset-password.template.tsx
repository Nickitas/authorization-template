import * as React from 'react';
import { Body, Container, Heading, Hr, Link, Preview, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html';

interface ResetPasswordTemplateProps {
    domain: string;
    token: string;
}

export function ResetPasswordTemplate({
    domain,
    token
}: ResetPasswordTemplateProps) {
    const confirmLink = `${domain}/auth/new-password?token=${token}`;

    return (
        <Tailwind>
            <Html>
                <Preview>Сброс пароля</Preview>
                <Body className='m-0 bg-[#f4f5f7] py-10 font-sans'>
                    <Container className='mx-auto w-full max-w-[520px] px-4'>
                        <div className='rounded-2xl bg-white px-10 py-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]'>
                            {/* Логотип */}
                            <div className='mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600'>
                                <svg
                                    className='h-7 w-7'
                                    fill='none'
                                    stroke='white'
                                    strokeWidth={2.5}
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M4.5 12.75l6 6 9-13.5'
                                    />
                                </svg>
                            </div>

                            <Heading className='m-0 mb-3 text-2xl font-bold tracking-tight text-[#18181b]'>
                                Сброс пароля
                            </Heading>

                            <Text className='m-0 mb-8 text-[15px] leading-relaxed text-[#52525b]'>
                                Привет! Вы запросили сброс пароля. Пожалуйста, перейдите по следующей ссылке, чтобы создать новый пароль:
                            </Text>

                            <a
                                href={confirmLink}
                                className='inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-10 py-4 text-[15px] font-semibold text-white no-underline shadow-[0_8px_20px_rgba(99,102,241,0.35)] transition-colors hover:from-indigo-600 hover:to-violet-700'
                            >
                                Подтвердить сброс пароля
                            </a>

                            <Text className='mt-6 text-sm text-[#a1a1aa]'>
                                Или скопируйте ссылку в браузер:
                                <br />
                                <Link
                                    href={confirmLink}
                                    className='break-all text-indigo-600 underline underline-offset-2'
                                >
                                    {confirmLink}
                                </Link>
                            </Text>

                            <Hr className='my-8 border-none border-t border-[#e4e4e7]' />

                            <Text className='m-0 text-[13px] leading-relaxed text-[#a1a1aa]'>
                                Ссылка действительна в течение{' '}
                                <span className='font-semibold text-[#52525b]'>1 часа</span>.
                                Если вы не запрашивали сброс пароля, просто проигнорируйте
                                это сообщение.
                            </Text>
                        </div>

                        <Text className='mt-6 text-center text-xs text-[#a1a1aa]'>
                            Спасибо за использование нашего сервиса!
                        </Text>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}