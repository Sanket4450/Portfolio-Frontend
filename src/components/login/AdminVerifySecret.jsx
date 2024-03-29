import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { Box, TextField } from '@mui/material'
import { userDetails } from '../../data/user'
import { secretSchema } from '../../schemas'
import { verifyAdminSecret } from '../../api/admin'
import { setItem } from '../../utils/localStorage'

export const AdminVerifySecret = ({ isSecretVerified, setIsSecretVerified }) => {
  const navigate = useNavigate()
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    isSecretVerified && navigate('/admin/verify-otp')
  }, [isSecretVerified])

  useEffect(() => {
    window.addEventListener('resize', () => setScreenWidth(window.innerWidth))

    return () => {
      window.removeEventListener('resize', () => setScreenWidth(window.innerWidth))
    }
  }, [])

  const initialValues = {
    secret: '',
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: secretSchema,
    onSubmit: (values, action) => {
      verifyAdminSecret(values.secret)
        .then(() => {
          action.resetForm()
          setItem('isSecretVerified', true)
          setIsSecretVerified(true)
          navigate('/admin/verify-otp')
        })
        .catch((error) => setErrorMessage(error.message))
    },
  })

  return (
    <section className=" text-center">
      <div className=" flex justify-center py-14">
        <img src={userDetails.logo} className=" w-24 md:w-36" />
      </div>

      <h1 className=" text-gray-strong font-sans text-center text-3xl sm:text-5xl lg:text-6xl">
        Login to the Admin Section
      </h1>

      <div className=" my-14 space-y-3">
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: screenWidth < 640 ? '95%' : '550px' },
          }}
          noValidate
          autoComplete="off"
          overflow="hidden"
        >
          <TextField
            label="Admin Secret"
            variant="outlined"
            name="secret"
            helperText={
              touched.secret && errors.secret ? `* ${errors.secret}` : errorMessage ? `* ${errorMessage}` : null
            }
            spellCheck={false}
            autoComplete="off"
            value={values.secret}
            onBlur={handleBlur}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--text-primary)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--text-primary)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--text-theme-primary)',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'var(--text-theme-primary)',
              },
              '& .MuiFormHelperText-root': {
                color: 'var(--text-theme-primary)',
                fontSize: '14px',
                marginLeft: 0,
              },
              '& .MuiFormHelperText-contained': {
                marginTop: '5px',
              },
              '& > :not(style)': { color: 'var(--text-primary)' },
            }}
          />
        </Box>
        <button
          type="submit"
          style={{ width: screenWidth < 640 ? '95%' : '550px' }}
          className=" w-48 h-12 rounded-md text-bg-primary bg-text-theme-primary hover:bg-text-theme-hover-primary transition duration-200 text-2xl"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </section>
  )
}
