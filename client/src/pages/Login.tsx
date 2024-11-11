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
  IonRadioGroup,
  IonRadio,
  IonLabel,
  IonItem,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

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
  const [registrationType, setRegistrationType] = useState<'student' | 'admin'>('student');

  const handleLoginClick = () => {
    history.push('/capture');
  };
  
  const handleSignupClick = () => {
    if (registrationType === 'student') {
      history.push('/signup');
    } else {
      history.push('/adminRegister');
    }
  };

  const onSubmit = async (data: any) => {
    if (registrationType === 'student' && !Object.values(CourseCode).includes(data.courseCode)) {
      setMessage('Invalid Course Code');
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        formdata: registrationType === 'student' 
          ? { email: data.email, password: data.password, courseCode: data.courseCode }
          : { loginId: data.loginId, password: data.password },
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      setMessage("Login successful!");
      handleLoginClick();
    } catch (error: any) {
      console.error('Login error:', error);
      setError('email', { type: 'manual', message: 'Login failed. Please try again.' });
      setMessage('Login failed. Please check your credentials.');
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
                  <IonCardTitle class="text-4xl font-bold text-gray-900 dark:text-white">
                    Sign in 
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonRadioGroup value={registrationType} onIonChange={(e) => setRegistrationType(e.detail.value)}>
                    <IonItem>
                      <IonLabel>Student Registration</IonLabel>
                      <IonRadio slot="start" value="student" />
                    </IonItem>
                    <IonItem>
                      <IonLabel>Admin Registration</IonLabel>
                      <IonRadio slot="start" value="admin" />
                    </IonItem>
                  </IonRadioGroup>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {registrationType === 'student' ? (
                      <>
                        <IonInput
                          {...register('email')}
                          label="Your email"
                          labelPlacement="floating"
                          fill="solid"
                          placeholder="name@company.com"
                          type="email"
                          required
                        ></IonInput>
                        <br />
                        <IonInput
                          {...register('password')}
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
                      </>
                    ) : (
                      <>
                        <IonInput
                          {...register('loginId')}
                          label="Login ID"
                          labelPlacement="floating"
                          fill="solid"
                          placeholder="Enter your login ID"
                          type="text"
                          required
                        ></IonInput>
                        <br />
                        <IonInput
                          {...register('password')}
                          label="Your password"
                          labelPlacement="floating"
                          fill="solid"
                          placeholder="••••••••"
                          type="password"
                          required
                        ></IonInput>
                      </>
                    )}
                    <br />
                    <IonButton expand="block" type="submit" color="primary">
                      {registrationType === 'student' ? 'Login as Student' : 'Login as Admin'}
                    </IonButton>
                  </form>
                  <IonText class="text-sm font-medium text-gray-900 dark:text-white mt-4">
                    Not registered yet?
                    <IonButton fill="clear" color="primary" onClick={handleSignupClick}>
                      Register
                    </IonButton>
                  </IonText>
                  {message && <p className="mt-3 text-center">{message}</p>}
                  <IonButton expand="block" color="secondary" onClick={handleLoginClick}>
                    Test Redirect to Capture
                  </IonButton>
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
