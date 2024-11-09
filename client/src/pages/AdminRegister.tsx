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
  IonAlert,
} from '@ionic/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation

const AdminRegister: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false); // State for alert
  const history = useHistory(); // Use history for navigation

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setBase64Image(reader.result as string); // Set the Base64 string
      };

      reader.readAsDataURL(file); // Convert to Base64
    } else {
      setBase64Image(null); // Reset if no file is selected
    }
  };

  const onSubmit = async (data: any) => {
    // Check if passwords match
    if (data.password !== data.confirm_password) {
      setShowAlert(true); // Show alert if passwords do not match
      return;
    }

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
          image: base64Image 
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

  const handleRedirect = () => {
    history.push('/'); // Redirect to login page
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
            <IonButton
              type="submit"
              expand="full"
              className="text-white bg-blue-700 hover:bg-blue-800"
            >
              Submit
            </IonButton>
          </form>
          {message && (
            <div className="mt-3 text-center">
              <p>{message}</p>
              <IonButton onClick={handleRedirect} expand="full" className="mt-2">
                Go to Login
              </IonButton>
            </div>
          )}
        </IonGrid>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Error'}
        message={'Confirm password and password do not match.'}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default AdminRegister;
