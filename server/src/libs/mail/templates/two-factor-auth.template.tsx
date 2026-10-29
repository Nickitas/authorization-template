import * as React from 'react';
import { Body, Container, Heading, Hr, Link, Preview, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html';

interface TwoFactorAuthTemplateProps {
    token: string;
}

export function TwoFactorAuthTemplate({
    token
}: TwoFactorAuthTemplateProps) {

    return (
        <Tailwind>
            <Html>
                <Preview>2FA</Preview>
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
                                Двухфакторная аутентификация
                            </Heading>

                            <Text className='m-0 mb-8 text-[15px] leading-relaxed text-[#52525b]'>
                                Ваш код двухфакторной аутентификации:
                                <strong>
                                    {token}
                                </strong>
                            </Text>

                            <Text className='mt-6 text-sm text-[#a1a1aa]'>
                                Введите этот код в приложении для завершения процесса аутентификации.
                            </Text>

                            <Hr className='my-8 border-none border-t border-[#e4e4e7]' />

                            <Text className='m-0 text-[13px] leading-relaxed text-[#a1a1aa]'>
                                Если вы не запрашивали этот код, просто проигнорируйте
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