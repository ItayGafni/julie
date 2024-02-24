import { FormControlLabel, MenuItem, TextField, Divider, Switch, InputAdornment, Autocomplete, Stack, Select, Button } from '@mui/material'
import { locationOptions, roomNumOptions, transactionTypeOptions, typeOptions } from '../enums'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
import Modal from './Modal'

type insertData = {
    // asset data
    action?: string,
    id?: string,
    transactionType: string,
    location: string,
    propertyType?: string,
    roomNum?: number,
    price: number,
    entryDate: string,
    link: string,
    shortLink: string,

    // contact data
    firstName: string,
    lastName: string,
    phoneNum: string,
    advertisement: boolean,
    email?: string,
    // buyingProperty
    // sellingProperty
}

export const InsertForm = ({ onSave }: { onSave: Function }) => {

    const { register, handleSubmit, formState, reset, getValues, trigger, setValue } = useForm<insertData>({
        defaultValues: {
            location: '',
            propertyType: typeOptions[0],
            roomNum: 1,
            phoneNum: '',
            price: 0,
            entryDate: '',
        }
    })
    const [location, setLocation] = useState<string>('')

    const { errors, isDirty } = formState

    const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false)
    const [buttonModal, setButtonModal] = useState<boolean>(false)

    const handleSave = async (formValues: insertData) => {
        formValues.location = formValues.location.toLowerCase().replace(' ', '_')
        onSave({ ...formValues, price: Number(formValues.price) })
        reset(getValues())
        setIsSubmitClicked(true)
    }

    const checkDuplicate = async () => {
        if (!await trigger()) {
            return
        }
        const formValues = getValues()
        formValues['price'] = Number(formValues['price'])
        const responseData = (await axios.post('http://localhost:5000/assets', formValues)).data.body
        if (responseData.length) {
            setButtonModal(true)
            setIsSubmitClicked(true)
            return
        }
        return handleSave(getValues())
    }

    const acceptDuplicate = () => {
        setButtonModal(false)
        handleSave(getValues())
    }

    return (
        <Stack direction='row' height='100%'>
            <form onSubmit={handleSubmit(handleSave)}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1 style={{ color: '#66F500' }}>הוספת נכס חדש</h1>
                </div>

                <Divider>מטרה</Divider>
                <div className='form-control'>
                    <Select {...register('transactionType')} fullWidth defaultValue={transactionTypeOptions[0].toLocaleLowerCase().replace(' ', '_')} style={{ textAlign: 'center' }} >
                        {
                            transactionTypeOptions.map(option => <MenuItem key={option} value={option.toLowerCase().replace(' ', '_')}>{option}</MenuItem>)
                        }
                    </Select>
                </div>
                <Divider>סוג נכס</Divider>
                <div className='form-control'>
                    <Select {...register('propertyType')} fullWidth defaultValue={typeOptions[0]} style={{ textAlign: 'center' }} >
                        {
                            typeOptions.map(option => <MenuItem key={option} value={option.toLowerCase().replace(' ', '_')}>{option}</MenuItem>)
                        }
                    </Select>
                </div>
                <Divider>מספר חדרים</Divider>
                <div className='form-control'>
                    <Select {...register('roomNum')} fullWidth defaultValue={roomNumOptions[0]} style={{ textAlign: 'center' }} >
                        {
                            roomNumOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)
                        }
                    </Select>
                </div>
                <Divider>מיקום</Divider>
                <div className='form-control'>
                    <Autocomplete
                        value={location}
                        options={locationOptions}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                {...register('location', {
                                    validate: field => field.length > 0 || 'מיקום לא תקין'
                                })}
                                inputProps={{
                                    ...params.inputProps,
                                    style: { textAlign: "center" }
                                }}
                            />)}
                        onChange={(_, v) => {
                            setValue('location', '', { shouldDirty: true })
                            setLocation(v as string)
                        }}
                    />
                    <p className='error'>{errors.location?.message}</p>
                </div>
                <Divider>תאריך כניסה</Divider>
                <div className='form-control'>
                    <TextField
                        fullWidth
                        type='date'
                        {...register('entryDate', {
                            validate: fieldValue => !isNaN(Date.parse(fieldValue)) || 'תאריך לא תקין'
                        })}
                        inputProps={{
                            style: { textAlign: "center" },
                        }}
                    />
                    <p className='error'>{errors.entryDate?.message}</p>
                </div>
                <Divider>מחיר</Divider>
                <div className='form-control'>
                    <TextField
                        fullWidth
                        type='number'
                        InputProps={{
                            startAdornment: <InputAdornment position="start">ש"ח</InputAdornment>
                        }}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                        {...register('price', {
                            validate: fieldValue => (!isNaN(fieldValue) && fieldValue >= 1000) || "המחיר חייב להיות מספר מעל 999"
                        })} />
                    <p className='error'>{errors.price?.message}</p>
                </div>
                <Divider>שם פרטי</Divider>
                <div className='form-control'>
                    <TextField
                        fullWidth
                        type='text'
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
                        fullWidth
                        type='text'
                        {...register('lastName', {
                            validate: (fieldValue: string) => /^[A-Za-zא-ת\s-]{2,}$/.test(fieldValue) || 'שם תקין צריך להיות ארוך יותר מאות אחת'
                        })}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.lastName?.message}</p>
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
                <Divider>לינק</Divider>
                <div className='form-control'>
                    <TextField
                        fullWidth
                        type='text'
                        {...register('link')}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.phoneNum?.message}</p>
                </div>
                <Divider>לינק מקוצר</Divider>
                <div className='form-control'>
                    <TextField
                        fullWidth
                        type='text'
                        {...register('shortLink')}
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                    />
                    <p className='error'>{errors.phoneNum?.message}</p>
                </div>
                <Divider>תוכן שיווקי</Divider>
                <div className='form-control' style={{ display: 'flex', justifyContent: 'center' }}>
                    <FormControlLabel control={<Switch defaultChecked />} label="פעיל" {...register('advertisement')} />
                </div>
                <Button type='button' onClick={checkDuplicate} disabled={!isDirty} variant="contained" fullWidth>Insert</Button>
                <Modal text='A similar property already exists, are you sure you want to insert another?' open={buttonModal} onClose={() => setButtonModal(false)}>
                    <button type='button' onClick={acceptDuplicate}>YES</button>
                </Modal>
                <p className='success'>{!isDirty && isSubmitClicked && `Insert request successful!`}</p>
            </form>
        </Stack>
    )
}