import { TextField, Divider, Button } from '@mui/material'
import { useForm } from 'react-hook-form'

export const GetAssetForm = ({ onSave }: { onSave: Function }) => {

    const { register, handleSubmit, formState } = useForm<{ externalId: string }>()
    const { errors } = formState

    const handleSave = (formValues: any) => {
        onSave({ ...formValues })
    }

    return (
        <div className="flexbox-container">
            <form onSubmit={handleSubmit(handleSave)}>
                <Divider>חפש מס' זיהוי נכס</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('externalId', {
                            validate: fieldValue => /^[\d]{5}$/.test(fieldValue) || "Please enter a valid asset ID"
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.externalId?.message}</p>
                </div>
                <Button type='submit' fullWidth variant='contained'>Search</Button>
            </form>
        </div>
    )
}