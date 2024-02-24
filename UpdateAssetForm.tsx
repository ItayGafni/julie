import { locationOptions, transactionTypeOptions, typeOptions } from '../enums'
import { TextField, Divider, Stack, Button, Switch } from '@mui/material'
import { GetAssetForm } from './GetAsset'
import { Controller, useForm } from 'react-hook-form'
import { formatDate } from '../utility'
import { useState } from 'react'
import axios from 'axios'

type assetData = {
    transactionType: string,
    location: string,
    propertyType: string,
    roomNum: number,
    price: number,
    entryDate: string,
    externalId: string,
    link: string,
    shortLink: string,
    isValid: boolean,
    phoneNum: string
}

export const UpdateAssetForm = ({ onSave }: { onSave: Function }) => {
    const { register, handleSubmit, formState, setValue, reset, control } = useForm<assetData>({
        defaultValues: {
            transactionType: '',
            location: '',
            propertyType: '',
        }
    })
    const { errors } = formState

    const handleSave = (formValues: any) => {
        onSave({
            ...formValues,
            price: Number(formValues['price']),
            roomNum: Number(formValues['roomNum']),
            location: formValues['location'].toLocaleLowerCase().replace(' ', '_'),
            propertyType: formValues['propertyType'].toLocaleLowerCase().replace(' ', '_'),
        })
        reset()
    }

    const [hasData, setHasData] = useState<boolean>(false)

    return (
        <Stack height='100%' justifyContent={'center'}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1 style={{ color: 'red' }}>עדכון נכס</h1>
            </div>

            <GetAssetForm onSave={async (value: any) => {
                try {
                    const responseData = (await axios.get(`http://localhost:5000/asset/${value.externalId}`)).data.body
                    setValue('externalId', responseData.externalId)
                    setValue('price', responseData.price)
                    setValue('transactionType', responseData.transactionType)
                    setValue('location', responseData.location.replace('_', ' '))
                    setValue('propertyType', responseData.propertyType)
                    setValue('roomNum', responseData.roomNum)
                    setValue('entryDate', formatDate(new Date(responseData.entryDate)))
                    setValue('link', responseData.link)
                    setValue('shortLink', responseData.shortLink)
                    setValue('phoneNum', responseData.phoneNum)
                    setValue('isValid', responseData.isValid)
                    setHasData(true)
                } catch {
                    setValue('externalId', '')
                    setValue('price', 0)
                    setValue('transactionType', '')
                    setValue('location', '')
                    setValue('propertyType', '')
                    setValue('roomNum', 0)
                    setValue('entryDate', '')
                    setValue('link', '')
                    setValue('shortLink', '')
                    setValue('phoneNum', '')
                    setValue('isValid', false)
                }
            }} />

            <Divider variant='fullWidth' sx={{ borderBottomWidth: 5, marginTop: 4, marginBottom: 3 }} />

            <form onSubmit={handleSubmit(handleSave)}>
                <Divider>מטרה</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('transactionType', {
                            validate: (fieldValue: string) => transactionTypeOptions.map(value => value.toLowerCase()).includes(fieldValue) || `Transaction type doesn't exist`
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.transactionType?.message}</p>
                </div>
                <Divider>מיקום</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('location', {
                            validate: (fieldValue: string) => locationOptions.map(value => value.toLowerCase()).includes((fieldValue)) || `Invalid location`
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.location?.message}</p>
                </div>
                <Divider>סוג נכס</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('propertyType', {
                            validate: (fieldValue: string) => typeOptions.map(value => value.toLowerCase()).includes(fieldValue) || `Asset type doesn't exist`
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.propertyType?.message}</p>
                </div>
                <Divider>תאריך כניסה</Divider>
                <div className='form-control'>
                    <TextField
                        type='date'
                        fullWidth
                        {...register('entryDate')}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                </div>
                <Divider>מחיר</Divider>
                <div className='form-control'>
                    <TextField
                        type='number'
                        fullWidth
                        {...register('price', {
                            validate: (fieldValue: number) => !isNaN(fieldValue) && fieldValue >= 1000 || "Value has to be a number over 999"
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.price?.message}</p>
                </div>
                <Divider>לינק</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('link')}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.price?.message}</p>
                </div>
                <Divider>לינק מקוצר</Divider>
                <div className='form-control'>
                    <TextField
                        type='text'
                        fullWidth
                        {...register('shortLink')}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.price?.message}</p>
                </div>
                <Divider>מספר טלפון</Divider>
                <div className='form-control'>
                    <TextField
                        fullWidth
                        type='text'
                        {...register('phoneNum', {
                            validate: fieldValue => /^05[\d]{8}$/.test(fieldValue) || "מספר טלפון לא תקין"
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.phoneNum?.message}</p>
                </div>
                <Divider>נכס פעיל</Divider>
                <div className='form-control' style={{ display: 'flex', justifyContent: 'center' }} >
                    <Controller
                        control={control}
                        name='isValid'
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