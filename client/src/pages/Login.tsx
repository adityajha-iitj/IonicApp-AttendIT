import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { apiURL } from '../theme/constant';

enum CourseCode {
  MATH101 = 'MATH101',
  PHYS102 = 'PHYS102',
  CHEM103 = 'CHEM103',
  CS104 = 'CS104',
}

const Login: React.FC = () => {
  const history = useHistory();
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    if (!Object.values(CourseCode).includes(data.courseCode)) {
      setMessage('Invalid Course Code');
      return;
    }


    
    try {
      const response = await axios.post(`${apiURL}/login`, {
        email: data.email,
        password: data.password,
        role: data.role
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setMessage(response.data.message || "Login successful!");

        // Redirect based on role
        if (data.role === 'admin') {
          history.push('/admin');
        } else {
          history.push('/capture');
        }
      }

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError('email', { type: 'manual', message: errorMessage });
      setMessage(errorMessage);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonTitle>Login Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding bg-gray-50 dark:bg-gray-900">
        <IonGrid class="max-w-screen-md py-8 lg:py-16">
          <IonRow class="ion-justify-content-center ion-align-items-center">
            <IonCol size-md="6">
              <IonCard className="lg:max-w-sm p-6 space-y-8 dark:bg-gray-800">
                <IonCardHeader>
                  <IonCardTitle class="text-2xl font-bold text-gray-900 dark:text-white">
                    Sign in to mark attendance
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <IonInput
                      {...register('email', { required: true })}
                      label="Your email"
                      labelPlacement="floating"
                      fill="solid"
                      placeholder="name@company.com"
                      type="email"
                      required
                    ></IonInput>
                    <br />
                    <IonInput
                      {...register('password', { required: true })}
                      label="Your password"
                      labelPlacement="floating"
                      fill="solid"
                      placeholder="••••••••"
                      type="password"
                      required
                    ></IonInput>
                    <br />
                    <IonInput
                      {...register('courseCode', {
                        required: 'Course code is required',
                        validate: (value) =>
                          Object.values(CourseCode).includes(value) || 'Invalid Course Code',
                      })}
                      label="Course Code"
                      labelPlacement="floating"
                      fill="solid"
                      placeholder="Enter course code (e.g., MATH101)"
                      type="text"
                    ></IonInput>
                    {errors.courseCode && (
                      <IonText color="danger">
                        <p>{String(errors.courseCode.message)}</p>
                      </IonText>
                    )}
                    <br />
                    <select 
                      {...register('role', { required: true })}
                      className="w-full p-2 mb-4 border rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <br />
                    <IonButton expand="block" type="submit" color="primary">
                      Login to your account
                    </IonButton>
                  </form>
                  
                  {/* Test button for redirecting to /capture */}
                  <IonButton expand="block" color="secondary" onClick={() => history.push('/capture')}>
                    Test
                  </IonButton>

                  <IonText class="text-sm font-medium text-gray-900 dark:text-white mt-4">
                    Not registered yet?
                    <IonButton fill="clear" color="primary" onClick={() => history.push('/signup')}>
                      Register
                    </IonButton>
                  </IonText>
                  {message && (
                    <IonText color={message.includes('failed') ? 'danger' : 'success'}>
                      <p className="mt-3 text-center">{message}</p>
                    </IonText>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
