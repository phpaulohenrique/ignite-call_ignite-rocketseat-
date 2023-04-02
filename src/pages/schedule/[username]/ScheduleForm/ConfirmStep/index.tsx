import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'
import { CalendarBlank, Clock } from 'phosphor-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: 'O nome precisa no mínimo 3 caracteres' }),
    email: z.string().email({ message: 'Digite um email válido' }),
    observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
    onCancelConfirmation: () => void
    schedulingDate: Date
}

export default function ConfirmStep({ onCancelConfirmation, schedulingDate }: ConfirmStepProps) {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<ConfirmFormData>({ resolver: zodResolver(confirmFormSchema) })

    const router = useRouter()
    const username = String(router.query.username)

    async function handleConfirmScheduling(data: ConfirmFormData) {
        const { name, email, observations } = data

        await api.post(`/users/${username}/schedule`, {
            name,
            email,
            observations,
            date: schedulingDate,
        })

        await router.push(`/schedule/${username}`)

        onCancelConfirmation()
        alert(`Agendamento com ${username} agendado com sucesso! \n `)
    }

    const describedDate = dayjs(schedulingDate).format('DD [ de ]MMMM[ de ]YYYY')
    const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

    return (
        <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
            <FormHeader>
                <Text>
                    <CalendarBlank />
                    {describedDate}
                </Text>

                <Text>
                    <Clock />
                    {describedTime}
                </Text>
            </FormHeader>

            <label>
                <Text>Nome completo</Text>
                <TextInput placeholder="Seu nome" {...register('name')} />
                {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
            </label>

            <label>
                <Text>E-mail</Text>
                <TextInput type="email" placeholder="johndoe@example.com" {...register('email')} />
                {errors.email && <FormError size="sm">{errors.email.message}</FormError>}
            </label>

            <label>
                <Text>Observações</Text>
                <TextArea {...register('observations')} />
            </label>

            <FormActions>
                <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    Confirmar
                </Button>
            </FormActions>
        </ConfirmForm>
    )
}
