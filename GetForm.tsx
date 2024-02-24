import { MenuItem, TextField, Divider, InputAdornment, Tooltip, Autocomplete, Stack, Button, Select } from '@mui/material'
import { MaxSearchNum, locationOptions, roomNumOptions, transactionTypeOptions, typeOptions } from '../enums';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import rentHouse from '../assets/rent_house.jpg'
import buyHouse from '../assets/buy_house.jpg'
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'

type getData = {
    // asset data
    action?: string,
    id?: string,
    transactionType?: string,
    location: string,
    propertyType?: string,
    roomNum?: number,
    price: number,
    entryDate: string,

    // contact data
    firstName: string,
    lastName: string,
    phoneNum: string,
}

export const GetForm = ({ onSave }: { onSave: Function }) => {
    const { register, handleSubmit, formState, reset, getValues, setValue, control } = useForm<getData>({
        defaultValues: {
            transactionType: transactionTypeOptions[0].toLocaleLowerCase().replace(' ', '_'),
            location: locationOptions[0],
            propertyType: typeOptions[0],
            roomNum: 1,
            phoneNum: '',
            price: 0,
            entryDate: '',
        }
    })
    const [location, setLocation] = useState<string>('')

    const { errors, isDirty } = formState

    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false)
    const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0)

    const handleSave = (formValues: getData) => {
        formValues.location = formValues.location.toLowerCase().replaceAll(' ', '_')
        onSave({ ...formValues, price: Number(formValues.price) })
        reset(getValues())
        setIsSubmitDisabled(true)
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory') as string) || []
        searchHistory.push(getValues())
        if (Object.keys(searchHistory).length > MaxSearchNum) {
            searchHistory.shift()
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
        const currentHistoryLength = Object.keys(JSON.parse(localStorage.getItem('searchHistory') as string)).length
        const newIndex = (currentSearchIndex + 1) % Math.min(MaxSearchNum, currentHistoryLength)
        setCurrentSearchIndex(newIndex)
    }

    const nextSearch = () => {
        const currentHistoryLength = Object.keys(JSON.parse(localStorage.getItem('searchHistory') as string)).length
        const newIndex = (currentSearchIndex + 1) % Math.min(MaxSearchNum, currentHistoryLength)
        setCurrentSearchIndex(newIndex)
        const currentSearch = JSON.parse(localStorage.getItem('searchHistory') as string)[newIndex]
        Object.entries(currentSearch).forEach((entry: any) => setValue(entry[0], entry[1], { shouldDirty: true }))
        setLocation(currentSearch.location)
    }

    const prevSearch = () => {
        const currentHistoryLength = Object.keys(JSON.parse(localStorage.getItem('searchHistory') as string)).length
        const length = Math.min(MaxSearchNum, currentHistoryLength)
        const newIndex = (currentSearchIndex - 1 + length) % length
        setCurrentSearchIndex(newIndex)
        const currentSearch = JSON.parse(localStorage.getItem('searchHistory') as string)[newIndex]
        Object.entries(currentSearch).forEach((entry: any) => setValue(entry[0], entry[1], { shouldDirty: true }))
        setLocation(currentSearch.location)
    }

    return (
        <Stack direction='row' gap={8} height='100%' justifyContent={'center'}>
            <Stack>
                <img src={rentHouse} style={{ height: '76vh', aspectRatio: '9/16' }} />
            </Stack>

            <form onSubmit={handleSubmit(handleSave)}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1>חיפוש נכסים</h1>
                </div>
                
                <Divider>מטרה</Divider>
                <div className='form-control'>
                    <Controller
                        control={control}
                        name='transactionType'
                        render={({ field }) => (
                            <Select fullWidth {...field} onChange={(e: any) => field.onChange(e.target.value)} style={{ textAlign: 'center' }}>
                                {
                                    transactionTypeOptions.map(option => <MenuItem key={option} value={option.toLowerCase().replace(' ', '_')}>{option}</MenuItem>)
                                }
                            </Select>
                        )}
                    />
                </div>
                <Divider>סוג נכס</Divider>
                <div className='form-control'>
                    <Controller
                        control={control}
                        name='propertyType'
                        render={({ field }) => (
                            <Select fullWidth {...field} onChange={(e: any) => field.onChange(e.target.value)} style={{ textAlign: 'center' }}>
                                {
                                    typeOptions.map(option => <MenuItem key={option} value={option.toLowerCase().replace(' ', '_')}>{option}</MenuItem>)
                                }
                            </Select>
                        )}
                    />
                </div>
                <Divider>מספר חדרים</Divider>
                <div className='form-control'>
                    <Controller
                        control={control}
                        name='roomNum'
                        render={({ field }) => (
                            <Select fullWidth {...field} onChange={(e: any) => field.onChange(e.target.value)} style={{ textAlign: 'center' }}>
                                {
                                    roomNumOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)
                                }
                            </Select>
                        )}
                    />
                </div>
                <Divider>מיקום</Divider>
                <div className='form-control'>
                    <Autocomplete
                        value={location}
                        options={locationOptions}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                {...register('location')}
                                inputProps={{
                                    ...params.inputProps,
                                    style: { textAlign: "center" }
                                }}
                            />
                        )}
                        onChange={(_, v) => {
                            setValue('location', '', { shouldDirty: true })
                            setLocation(v as string)
                        }}
                    />
                </div>
                <Divider>תאריך כניסה</Divider>
                <div className='form-control'>
                    <TextField
                        type='date'
                        fullWidth
                        {...register('entryDate')}
                        inputProps={{
                            style: { textAlign: "center" },
                        }}
                    />
                </div>
                <Divider>מחיר</Divider>
                <div className='form-control'>
                    <TextField
                        type='number'
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">ש"ח</InputAdornment>
                        }}
                        inputProps={{
                            style: { textAlign: "center" },
                        }}
                        {...register('price', {
                            validate: fieldValue => !isNaN(fieldValue) && fieldValue >= 1000 || "המחיר חייב להיות מספר מעל 999"
                        })}

                    />
                    <p className='error'>{errors.price?.message}</p>
                </div>

                <Divider>שם פרטי</Divider>
                <div className='form-control'>
                    <TextField
                        type='text' fullWidth
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
                </div>
                <Divider>מספר טלפון</Divider>
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
                    <p className='error'>{errors.phoneNum?.message}</p>
                </div>
                <Stack direction='row'>
                    <Tooltip title="בקשה קודמת">
                        <Button type='button' onClick={prevSearch} disabled={!localStorage.getItem('searchHistory')}><ArrowBackIcon /></Button>
                    </Tooltip>
                    <Button type='submit' variant="contained" disabled={!isDirty} fullWidth>חפש</Button>
                    <Tooltip title="בקשה הבאה">
                        <Button type='button' onClick={nextSearch} disabled={!localStorage.getItem('searchHistory')}><ArrowForwardIcon /></Button>
                    </Tooltip>
                </Stack>
                <p className='success'>{!isDirty && isSubmitDisabled && `Get request successful!`}</p>
            </form>

            <Stack>
                <img src={buyHouse} style={{ height: '76vh', aspectRatio: '9/16' }} />
            </Stack>
        </Stack>
    )
}