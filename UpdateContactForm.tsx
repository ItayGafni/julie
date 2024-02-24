import { TextField, Divider, FormControlLabel, Switch, Stack, Button } from '@mui/material'
import { GetContactForm } from './GetContact'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'

type contactData = {
    firstName: string,
    lastName: string,
    phoneNum: string,
    oldPhoneNum: string,
    advertisement: boolean,
    email: string,
    autoUpdateCount: number
}

export const UpdateContactForm = ({ onSave }: { onSave: Function }) => {

    const { register, handleSubmit, formState, setValue, reset, control } = useForm<contactData>()
    const { errors } = formState

    const handleSave = (formValues: any) => {
        onSave({ ...formValues, autoUpdateCount: Number(formValues.autoUpdateCount) })
        reset()
    }

    const [hasData, setHasData] = useState<boolean>(false)

    return (
        <Stack height='100%' justifyContent={'center'}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1 style={{ color: 'red' }}>עדכון איש קשר</h1>
            </div>

            <GetContactForm onSave={async (value: any) => {
                try {
                    const responseData = (await axios.get(`http://localhost:5000/contact/${value.phoneNum}`)).data.body
                    setValue('firstName', responseData.firstName)
                    setValue('lastName', responseData.lastName)
                    setValue('advertisement', responseData.advertisement)
                    setValue('email', responseData.email || '')
                    setValue('phoneNum', responseData.phoneNum)
                    setValue('oldPhoneNum', responseData.phoneNum)
                    setValue('autoUpdateCount', responseData.autoUpdateCount)
                    setHasData(true)
                } catch {
                    setValue('firstName', '')
                    setValue('lastName', '')
                    setValue('advertisement', false)
                    setValue('email', '')
                    setValue('phoneNum', '')
                    setValue('oldPhoneNum', '')
                    setValue('autoUpdateCount', 0)
                }
            }} />

            <Divider variant='fullWidth' sx={{ borderBottomWidth: 5, marginTop: 4, marginBottom: 3 }} />

            <form onSubmit={handleSubmit(handleSave)}>
                <Divider>שם פרטי</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('firstName', {
                            validate: (fieldValue: string) => /^[A-Za-zא-ת\s-]{2,}$/.test(fieldValue) || 'שם תקין צריך להיות ארוך יותר מאות אחת'
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.firstName?.message}</p>
                </div>
                <Divider>שם משפחה</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('lastName', {
                            validate: (fieldValue: string) => /^[A-Za-zא-ת\s-]{2,}$/.test(fieldValue) || 'שם תקין צריך להיות ארוך יותר מאות אחת'
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.lastName?.message}</p>
                </div> <Divider>מספר טלפון</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('phoneNum', {
                            validate: fieldValue => /^05[\d]{8}$/.test(fieldValue) || "מספר טלפון לא תקין"
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.lastName?.message}</p>
                </div>
                <Divider>אי-מייל</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('email', {
                            validate: (fieldValue: string) => {
                                if (fieldValue === '') {
                                    return true
                                }
                                return /^[\S]+@[\S]+.{1}[\S]+$/.test(fieldValue) || 'אי-מייל לא תקין'
                            }
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.email?.message}</p>
                </div>
                <Divider>כמות עדכונים</Divider>
                <div className='form-control'>
                    <TextField
                        type='number'
                        fullWidth
                        {...register('autoUpdateCount', {
                            validate: fieldValue => !isNaN(fieldValue)
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.email?.message}</p>
                </div>
                <Divider>תוכן שיווקי</Divider>
                <div className='form-control' style={{ display: 'flex', justifyContent: 'center' }} >
                    <Controller
                        control={control}
                        name='advertisement'
                        render={({ field }) => (
                            <Switch {...field} checked={!!field.value} />
                        )}
                    />
                </div>
                <Button type='submit' disabled={!hasData} fullWidth variant='contained'>Update</Button>
            </form>
        </Stack>
    )
}