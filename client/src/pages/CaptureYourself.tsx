import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonLabel,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

const CaptureYourself: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      console.log('Image selected:', selectedImage);
      // Handle image submission here (e.g., upload to server)
    } else {
      console.log('No image selected');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Image Upload</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonGrid class="h-full">
          <IonRow class="ion-justify-content-center ion-align-items-center h-full">
            <IonCol size="auto">
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
                onClick={handleSubmit}
                expand="full"
                className="text-white bg-blue-700 hover:bg-blue-800"
              >
                Submit
              </IonButton>
              {selectedImage && (
                <IonText>
                  <p>Image selected: {selectedImage.name}</p>
                </IonText>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CaptureYourself;
