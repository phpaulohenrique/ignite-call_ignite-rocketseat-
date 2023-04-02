import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
        .regex(/^([a-z\\\\-]+)$/i, { message: 'O usuário pode conter apenas letras e hifens.' })
        .transform((username) => username.toLowerCase()),
    name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
})

type RegisterFromData = z.infer<typeof registerFormSchema>

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<RegisterFromData>({
        resolver: zodResolver(registerFormSchema),
    })

    async function handleRegister(data: RegisterFromData) {
        console.log(data)

        try {
            await api.post('/users', {
                name: data.name,
                username: data.username,
            })

            await router.push('/register/connect-calendar')
        } catch (err) {
            if (err instanceof AxiosError && err?.response?.data?.message) {
                alert(err.response.data.message)
                return
            }

            console.error(err)
        }
    }

    const router = useRouter()

    useEffect(() => {
        if (router.query.username) {
            setValue('username', String(router.query.username))
        }
    }, [router.query?.username, setValue])

    return (
        <>
            <NextSeo title="Crie uma conta | Ignite Call" />

            <Container>
                <Header>
                    <Heading as="strong">Bem vindo ao Ignite Call!</Heading>

                    <Text>
                        Precisamos de algumas informações para criar seu perfil! Ah, você pode
                        editar essas informações depois.
                    </Text>

                    <MultiStep size={4} currentStep={1} />
                </Header>

                <Form as="form" onSubmit={handleSubmit(handleRegister)}>
                    <label>
                        <Text>Nome de usuário</Text>
                        <TextInput
                            prefix="ignite.com/"
                            placeholder="seu-usuario"
                            {...register('username')}
                        />
                        {errors.username && (
                            <FormError size="xs">{errors.username?.message}</FormError>
                        )}
                    </label>

                    <label>
                        <Text>Nome completo</Text>
                        <TextInput placeholder="Seu nome" {...register('name')} />
                        {errors.username && <FormError size="xs">{errors.name?.message}</FormError>}
                    </label>

                    <Button type="submit" disabled={isSubmitting}>
                        Próximo passo
                        <ArrowRight />
                    </Button>
                </Form>
            </Container>
        </>
    )
}
