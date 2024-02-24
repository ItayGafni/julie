import { TextField, Divider, Button } from '@mui/material'
import { useForm } from 'react-hook-form'

export const GetContactForm = ({ onSave }: { onSave: Function }) => {

    const { register, handleSubmit, formState } = useForm<{ phoneNum: string }>()
    const { errors } = formState

    const handleSave = (formValues: any) => {
        onSave({ ...formValues })
    }

    return (
        <div className="flexbox-container">
            <form onSubmit={handleSubmit(handleSave)}>
                <Divider>חפש מספר טלפון</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('phoneNum', {
                            validate: fieldValue => /^05[\d]{8}$/.test(fieldValue) || "Please enter a valid phone number"
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.phoneNum?.message}</p>
                </div>
                <Button type='submit' fullWidth variant='contained'>Search</Button>
            </form>
        </div>
    )
}