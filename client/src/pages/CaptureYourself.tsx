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

  const handleSubmit = async () => {
    if (selectedImage) {
      console.log('Image selected:', selectedImage);
      
      // Create a FormData object to send the image
      const formData = new FormData();
      formData.append('image', selectedImage);
  
      // Send the image to the backend
      try {
        const response = await fetch('http://localhost:5000/captureYourself', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          console.log('Image uploaded successfully');
        } else {
          console.log('Image upload failed');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
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
