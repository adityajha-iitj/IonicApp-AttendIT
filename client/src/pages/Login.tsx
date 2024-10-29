import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonImg } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Login: React.FC = () => {
  const history = useHistory();
  const { register, handleSubmit } = useForm();

  const handleloginClick = () => {
    history.push('/capture');
  };
  const handlesignpClick = () => {
    history.push('/signup');
  }
  const onSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonTitle>Login page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding bg-gray-50 dark:bg-gray-900">
        <IonGrid class="max-w-screen-md py-8 lg:py-16"> {/* Adjusted max width here */}
          <IonRow class="ion-justify-content-center ion-align-items-center">
            <IonCol size-md="5" class="ion-text-center">
              {/* Circular Image */}
              <IonImg
                src="./login_page.jpg" // Replace with your image source
                className="rounded-full w-48 h-48 object-cover mx-auto" // Circular styling
                alt="Profile"
              />
            </IonCol>
            <IonCol size-md="6">
              <IonCard className="lg:max-w-sm p-6 space-y-8 dark:bg-gray-800">
                <IonCardHeader>
                  <IonCardTitle class="text-2xl font-bold text-gray-900 dark:text-white">
                    sign in to mark attendence 
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={handleSubmit(onSubmit)} >
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
                      {...register('course')}
                      label="Course"
                      labelPlacement="floating"
                      fill="solid"
                      placeholder="MAL2010"
                      type="text"
                      required
                    ></IonInput>
                    <br />
                    <IonButton expand="block" type="submit" color="primary" onClick={handleloginClick}>
                      Login to your account
                    </IonButton>
                  </form>
                  <IonText class="text-sm font-medium text-gray-900 dark:text-white mt-4">
                    Not registered yet?
                    <IonButton fill="clear" color="primary" onClick={handlesignpClick}>
                      Register
                    </IonButton>
                  </IonText>
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
