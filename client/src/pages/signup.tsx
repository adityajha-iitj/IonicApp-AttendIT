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

const Signup: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [image, setImage] = useState<File | null>(null);

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
    if (image) {
      console.log('Uploaded image:', image);
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
            {/* Image Upload Section */}
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
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
