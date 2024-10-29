import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const history = useHistory();

  const handleRegisterClick = () => {
    history.push('/register');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonTitle>Login page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton onClick={handleRegisterClick}>Register</IonButton>
        <IonInput label="Solid input" labelPlacement="floating" fill="solid" placeholder="Enter text"></IonInput>
        <br />
        <IonInput label="Outline input" labelPlacement="floating" fill="outline" placeholder="Enter text"></IonInput>
      </IonContent>
    </IonPage>
  );
};

export default Login;
