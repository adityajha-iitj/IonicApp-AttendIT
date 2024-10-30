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
} from '@ionic/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Signup: React.FC = () => {
  const { register, handleSubmit, setError } = useForm();
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);



  const onSubmit = async (data: any) => {
    console.log(data); // Log incoming data from the form
  
    try {
  
      // Ensure the image is valid and append it
     
      // Optional: Log each entry in formData to verify structure
  
      // Send POST request with formData as the body
      const response = await axios.post('http://localhost:5000/register', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
        formdata : {
        fullName : data.name,
        email : data.email,
        password : data.password,
        }
      });
  
      console.log(response.data); // Log response data
      setMessage(response.data.message); // Display success message
  
    } catch (error: any) {
      console.error('Error during registration:', error);
      if (error.response && error.response.data) {
        // Handle specific error message from server
        setError('email', { type: 'manual', message: error.response.data.message });
      } else {
        setMessage('Registration failed. Please try again.'); // Generic error message
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
                {...register('email')}
                label="Email"
                labelPlacement="floating"
                fill="solid"
                placeholder="name@gmail.com"
                type="email"
                required
              ></IonInput>
            </IonItem>
            <IonItem className="relative mb-5">
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                {...register('password')}
                label="Password"
                labelPlacement="floating"
                fill="solid"
                placeholder="........"
                type="password"
                required
              ></IonInput>
            </IonItem>
            <IonItem className="relative mb-5">
              <IonLabel position="floating">Confirm password</IonLabel>
              <IonInput
                {...register('confirm_password')}
                label="Confirm Password"
                labelPlacement="floating"
                fill="solid"
                placeholder="........"
                type="password"
                required
              ></IonInput>
            </IonItem>
            <IonGrid className="grid md:grid-cols-2 md:gap-6">
              <IonRow>
                <IonCol>
                  <IonItem className="relative mb-5">
                    <IonInput
                      {...register('name')}
                      label="First Name"
                      labelPlacement="floating"
                      fill="solid"
                      placeholder="John"
                      type="text"
                      required
                    ></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem className="relative mb-5">
                    <IonInput
                      {...register('surname')}
                      label="Last Name"
                      labelPlacement="floating"
                      fill="solid"
                      placeholder="Doe"
                      type="text"
                      required
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
                capture="environment" // Opens camera on mobile devices
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
