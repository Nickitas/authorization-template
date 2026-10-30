import { ArrowRight, KeyRound, MailCheck, ShieldCheck, UserPlus } from 'lucide-react'
import Link from 'next/link'

import { buttonVariants } from '@/shared/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card'

const features = [
	{ icon: UserPlus, label: 'Вход и регистрация' },
	{ icon: MailCheck, label: 'Подтверждение email' },
	{ icon: ShieldCheck, label: 'Двухфакторный вход' },
	{ icon: KeyRound, label: 'Восстановление пароля' },
] as const

export default function Home() {
	return (
		<section className='w-full max-w-md'>
			<Card className='relative gap-5 overflow-hidden rounded-2xl border-border/60 bg-card/80 py-7 shadow-xl shadow-primary/5 backdrop-blur-md'>
				{/* акцентная линия сверху карточки */}
				<div
					aria-hidden
					className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent'
				/>

				<CardHeader className='justify-items-center gap-3 text-center'>
					<span className='inline-flex items-center gap-2 rounded-full border border-border/60 bg-accent/50 px-3 py-1 text-xs font-medium text-accent-foreground'>
						<span className='size-1.5 animate-pulse rounded-full bg-primary' />
						Шаблон авторизации
					</span>

					<CardTitle className='text-balance text-2xl font-semibold tracking-tight sm:text-3xl'>
						Полный цикл авторизации{' '}
						<span className='bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent'>
							из коробки
						</span>
					</CardTitle>

					<CardDescription className='text-balance leading-relaxed'>
						Регистрация и вход по email, подтверждение почты, двухфакторная
						аутентификация и безопасное восстановление пароля — бэкенд уже
						подключён.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Link
						href='/auth/login'
						className={buttonVariants({
							className: 'h-10 w-full gap-2 rounded-xl text-sm sm:text-base',
						})}
					>
						Войти в аккаунт
						<ArrowRight className='size-4' />
					</Link>
				</CardContent>

				<CardFooter className='w-full'>
					<div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2'>
						{features.map(({ icon: Icon, label }) => (
							<div
								key={label}
								className='flex items-center gap-2.5 rounded-lg border border-border/50 bg-background/40 px-3 py-2.5'
							>
								<span className='flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary'>
									<Icon className='size-3.5' />
								</span>
								<span className='text-xs font-medium leading-snug'>{label}</span>
							</div>
						))}
					</div>
				</CardFooter>
			</Card>

			<p className='mt-5 text-center font-mono text-xs tracking-wide text-muted-foreground'>
				Next.js · React · Tailwind CSS · shadcn/ui
			</p>
		</section>
	)
}
