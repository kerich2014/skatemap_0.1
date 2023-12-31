import { createUserSchema, SignIn } from '../server/schema/user.schema'

import Head from 'next/head'
import Link from 'next/link'
import type { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useRouter } from 'next/router'

const SignIn: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm<SignIn>({
    resolver: zodResolver(createUserSchema),
  })

  const onSubmit = async (data: SignIn) => {
      setLoading(true)
      await signIn('credentials', {
        ...data,
        callbackUrl: '/',
      })
    }

  return (
    <div>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col items-center justify-center h-screen w-full'>
        <form
          className='flex items-center justify-center'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className=' w-96 bg-base-100 shadow-xl border-2 rounded-md p-4'>
            <div>
              <h1 className='text-xl'>С возвращением!</h1>
              <input
                autoComplete='off'
                type='text'
                placeholder='Введите имя пользователя'
                className='h-8 rounded-md pl-2 w-full max-w-xs my-2 dark:bg-black-velvet '
                {...register('name')}
              />
              <input
                autoComplete='off'
                type='password'
                placeholder='Введите пароль'
                className='h-8 rounded-md pl-2 w-full max-w-xs my-2 dark:bg-black-velvet '
                {...register('password')}
              />
              <div className='flex justify-between'>
                <button
                  disabled={loading}
                  type='submit'
                  className='inline-block mt-2 px-6 py-2 bg-white dark:bg-night-sky font-medium text-md leading-tight rounded-md shadow-md border-2 hover:border-blue-500 transition duration-150 ease-in-out'
                >
                  {loading ? 'Загрузка' : 'Войти'}
                </button>
              </div>
            </div>
          </div>
        </form>
        <Link href='/signup'>
          <button className='flex items-center m-2 px-4 py-2 bg-white dark:bg-night-sky font-medium text-md leading-tight rounded-md shadow-md border-2 hover:border-blue-500 transition duration-150 ease-in-out'>
            Перейти на страницу регистрации
          </button>
        </Link>
      </main>
    </div>
  )
}

export default SignIn