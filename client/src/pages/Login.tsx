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
  IonImg,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

// Define the CourseCode enum
enum CourseCode {
  MATH101 = 'MATH101',
  PHYS102 = 'PHYS102',
  CHEM103 = 'CHEM103',
  CS104 = 'CS104',
  // add other course codes as needed
}

const Login: React.FC = () => {
  const history = useHistory();
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [message, setMessage] = useState<string | null>(null);

  const handleloginClick = () => {
    history.push('/capture');
  };
  const handlesignpClick = () => {
    history.push('/signup');
  };

  const onSubmit = async (data: any) => {
    // Check if the course code is valid before making the API request
    if (!Object.values(CourseCode).includes(data.courseCode)) {
      setMessage('Invalid Course Code'); // Display error message
      return;
    }
    
    console.log('Form data:', data);
    try {
      // Send POST request to authenticate user
      const response = await axios.post('http://localhost:5000/login', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        formdata: {
          email: data.email,
          password: data.password,
          courseCode: data.courseCode, // Include course code in the request
        },
      });

      // Handle JWT from response and store it in local storage or state
      const token = response.data.token;
      localStorage.setItem('token', token); // Store JWT for later use
      setMessage("Login successful!"); // Success message or redirect
      handleloginClick();

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
            <IonCol size-md="5" class="ion-text-center">
              <IonImg
                src="./login_page.jpg"
                className="rounded-full w-48 h-48 object-cover mx-auto"
                alt="Profile"
              />
            </IonCol>
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
                    <br />
                    <IonButton expand="block" type="submit" color="primary">
                      Login to your account
                    </IonButton>
                  </form>
                  <IonText class="text-sm font-medium text-gray-900 dark:text-white mt-4">
                    Not registered yet?
                    <IonButton fill="clear" color="primary" onClick={handlesignpClick}>
                      Register
                    </IonButton>
                  </IonText>
                  {message && <p className="mt-3 text-center">{message}</p>}
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
