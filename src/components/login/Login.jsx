import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Container, Grid, Paper, TextField, Typography, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PreLoginImage from '../../assets/images/prelogin-background.svg'
import { LOGIN } from '../services/apiEndPoints';
import styles from './login.module.scss'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import publicRequest from '../services/publicRequest';

const Login = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const defaultValues = {
        phoneNumber: "",
        password: "",
    }
    const {register, getValues, handleSubmit, formState: { errors }} = useForm(defaultValues);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const onSubmit = async () => {
        setLoading(true);
        const values = getValues();
        const res = await publicRequest.post(LOGIN, {
            Username: values.phoneNumber,
            Password: values.password
        });
        
        if(res) {
            if(res?.data?.success){
                toast.success('Login Successful');
                localStorage.setItem(
                    "token",
                    btoa(values.phoneNumber + ":" + values.password)
                );
                localStorage.setItem("userId", res?.data?.userDetail?.data?.UserId);
                localStorage.setItem("userName", res?.data?.userDetail?.data?.Name);
                navigate("/");
            } else {
                toast.error(res?.data?.errorMessage ||  "Invalid Credentials")
                setLoading(false)
            }
        }
    }

  return (
    <Container maxWidth="lg" className={styles.loginContainer}>
        <Grid container className={styles.loginGrid}>
            <Grid item xs={12} md={6} className={styles.loginImage}>
                <img src={PreLoginImage} alt='login' />
            </Grid>
            <Grid item xs={12} md={6} className={styles.loginFormContainer}>
                <Paper elevation={6} className={styles.loginForm}>
                    <Typography variant='h4' component='h1'>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField 
                            fullWidth
                            label="Phone Number"
                            margin='normal'
                            {...register('phoneNumber', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Invalid phone number'
                                }
                            })}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                        />

                        <TextField 
                            fullWidth
                            label="Password"
                            type= {showPassword ? 'text' : "password"}
                            margin= "normal"
                            {...register('password', {
                                required: 'Password is required'
                            })}
                            error={!!errors.password}
                            helperText={errors.password ? errors.password.message : ''}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={handleClickShowPassword}
                                            edge='end'
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button type='submit' variant='contained' color='primary' fullWidth disabled={loading}>
                            {loading ? <CircularProgress size={24}/> : 'Sign In'}
                        </Button>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    </Container>
  )
}

export default Login