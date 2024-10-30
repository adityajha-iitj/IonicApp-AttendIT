import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonLabel,
  IonItem,
  IonText,
} from '@ionic/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Signup: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      const response = await axios.post('http://localhost:5000/register', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        formdata: {
          fullName: data.name,
          email: data.email,
          password: data.password,
        }
      });
  
      console.log(response.data);
      setMessage(response.data.message);
  
    } catch (error: any) {
      console.error('Error during registration:', error);
      if (error.response && error.response.data) {
        setError('email', { type: 'manual', message: error.response.data.message });
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonTitle>Registration Form</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid className="max-w-md mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <IonItem className="relative mb-5">
              <IonInput
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@iitj\.ac\.in$/,
                    message: 'Only emails ending with @iitj.ac.in are accepted',
                  }
                })}
                label="Email"
                labelPlacement="floating"
                fill="solid"
                placeholder="name@iitj.ac.in"
                type="email"
              ></IonInput>
            </IonItem>
            {errors.email && (
              <IonText color="danger">
                <p className="ion-padding-start">{String(errors.email.message)}</p>
              </IonText>
            )}
            <IonItem className="relative mb-5">
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                {...register('password', { required: 'Password is required' })}
                label="Password"
                labelPlacement="floating"
                fill="solid"
                placeholder="........"
                type="password"
              ></IonInput>
            </IonItem>
            <IonItem className="relative mb-5">
              <IonLabel position="floating">Confirm password</IonLabel>
              <IonInput
                {...register('confirm_password', { required: 'Confirm Password is required' })}
                label="Confirm Password"
                labelPlacement="floating"
                fill="solid"
                placeholder="........"
                type="password"
              ></IonInput>
            </IonItem>
            <IonGrid className="grid md:grid-cols-2 md:gap-6">
              <IonRow>
                <IonCol>
                  <IonItem className="relative mb-5">
                    <IonInput
                      {...register('name', { required: 'First Name is required' })}
                      label="First Name"
                      labelPlacement="floating"
                      fill="solid"
                      placeholder="John"
                      type="text"
                    ></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem className="relative mb-5">
                    <IonInput
                      {...register('surname', { required: 'Last Name is required' })}
                      label="Last Name"
                      labelPlacement="floating"
                      fill="solid"
                      placeholder="Doe"
                      type="text"
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonLabel position="floating">Upload your image</IonLabel>
            <IonItem className="relative mb-5">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                capture="environment"
              />
            </IonItem>
            <IonButton
              type="submit"
              expand="full"
              className="text-white bg-blue-700 hover:bg-blue-800"
            >
              Submit
            </IonButton>
          </form>
          {message && <p className="mt-3 text-center">{message}</p>}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
