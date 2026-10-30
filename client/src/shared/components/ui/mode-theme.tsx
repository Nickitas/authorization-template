'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/shared/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

export function ModeTheme() {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant='outline'
						size='icon-lg'
						className='rounded-full'
						aria-label='Смена темы'
					>
						<span className='relative flex size-4 items-center justify-center'>
							<Sun className='size-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0' />
							<span className='absolute inset-0 flex items-center justify-center'>
								<Moon className='size-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100' />
							</span>
						</span>
					</Button>
				}
			/>
			<DropdownMenuContent align='end' className='w-36'>
				<DropdownMenuItem onClick={() => setTheme('light')}>
					<Sun className='size-3.5 text-muted-foreground' />
					Светлая
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					<Moon className='size-3.5 text-muted-foreground' />
					Тёмная
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					<Monitor className='size-3.5 text-muted-foreground' />
					Системная
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
