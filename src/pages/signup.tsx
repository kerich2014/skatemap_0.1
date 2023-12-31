import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { signUpSchema, SignUp } from '../server/schema/user.schema'
import { api } from "skatemap_new/utils/api";



const SignUp: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
  })

  const { mutate, error } = api.auth.auth.useMutation({
    onSuccess: () => router.push("/")
  })

  const onSubmit = useCallback(
    (values: SignUp) => {
      setLoading(true)
      mutate(values)
    },
    [mutate]
  )

  return (
    <div>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col items-center justify-center h-screen w-full'>
        <form
          className='flex items-center justify-center '
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className=' w-96 bg-base-100 shadow-xl border-2 rounded-md p-4'>
            <div className=''>
              <h1 className='text-xl'>Создайте аккаунт!</h1>
              <h2 className='text-rose-500'>{error && error.message}</h2>
              <input
                autoComplete='off'
                type='text'
                placeholder='Придумайте имя пользователя'
                className='h-8 rounded-md pl-2 w-full max-w-xs my-2 dark:bg-black-velvet'
                {...register('name')}
              />
              <input
                type='email'
                placeholder='Введите вашу почту'
                className='h-8 rounded-md pl-2 w-full max-w-xs dark:bg-black-velvet'
                {...register('email')}
              />
              <input
                autoComplete='off'
                type='password'
                placeholder='Придумайте пароль'
                className='h-8 rounded-md pl-2 w-full max-w-xs my-2 dark:bg-black-velvet'
                {...register('password')}
              />
              <div className='flex justify-between'>
                <button
                  type='submit'
                  className='inline-block mt-2 px-6 py-2 bg-white dark:bg-night-sky font-medium text-md leading-tight rounded-md shadow-md border-2 hover:border-blue-500 transition duration-150 ease-in-out'
                >
                  {loading ? 'Загрузка' : 'Зарегистрироваться'}
                </button>
              </div>
            </div>
          </div>
        </form>
        <Link href='/signin'>
          <button className='flex items-center m-2 px-4 py-2 bg-white dark:bg-night-sky font-medium text-md leading-tight rounded-md shadow-md border-2 hover:border-blue-500 transition duration-150 ease-in-out'>
            
            Перейти на страницу авторизации
          </button>
        </Link>
      </main>
    </div>
  )
}

export default SignUp