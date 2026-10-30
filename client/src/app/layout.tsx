import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Manrope } from 'next/font/google'
import { LockKeyhole } from 'lucide-react'
import Link from 'next/link'

import '@/shared/styles/globals.css'
import { ModeTheme } from '@/shared/components/ui/mode-theme'
import { Provider } from '@/shared/providers'

const fontSans = Manrope({
	variable: '--font-app-sans',
	subsets: ['latin', 'cyrillic'],
})

const fontMono = JetBrains_Mono({
	variable: '--font-app-mono',
	subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
	title: {
		absolute: 'AuthTemplate',
		template: '%s | AuthTemplate',
	},
	description:
		'Шаблон полного цикла авторизации: вход и регистрация, подтверждение email, двухфакторная аутентификация и восстановление пароля.',
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#fbfaff' },
		{ media: '(prefers-color-scheme: dark)', color: '#16131a' },
	],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang='ru'
			// next-themes меняет класс на <html> до гидратации — без этого флага React ругается на несовпадение
			suppressHydrationWarning
			className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
		>
			<body className='min-h-dvh'>
				<Provider>
					<div className='relative isolate flex min-h-dvh flex-col'>
						{/* декоративный фон: сетка + фиолетовые свечения */}
						<div
							aria-hidden
							className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'
						>
							<div className='absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_38%,black_25%,transparent_78%)]' />
							<div className='absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_55%_75%_at_50%_-15%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_70%)]' />
							<div className='absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(ellipse_45%_70%_at_50%_115%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_70%)]' />
						</div>

						<header className='flex items-center justify-between p-4 sm:px-6'>
							<Link href='/' className='flex items-center gap-2.5'>
								<span className='flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30'>
									<LockKeyhole className='size-4' />
								</span>
								<span className='text-sm font-semibold tracking-tight'>
									AuthTemplate
								</span>
							</Link>
							<ModeTheme />
						</header>

						<main className='flex flex-1 items-center justify-center px-4 py-10 sm:py-14'>
							{children}
						</main>
					</div>
				</Provider>
			</body>
		</html>
	)
}
