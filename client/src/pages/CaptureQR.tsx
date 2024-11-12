import React, { useEffect, useState } from 'react';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { scanOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

// Enum for course codes
enum CourseCode {
  MATH101 = 'MATH101',
  PHYS102 = 'PHYS102',
  CHEM103 = 'CHEM103',
  CS104 = 'CS104',
  // add other course codes as needed
}

const CaptureQR: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const history = useHistory();

  useEffect(() => {
    BarcodeScanner.isSupported().then((result) => {
      setIsSupported(result.supported);
    });
  }, []);

  // Function to scan the QR code
  const scan = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      setAlertShown(true);
      return;
    }

    const { barcodes: scannedBarcodes } = await BarcodeScanner.scan();
    validateAndRedirect(scannedBarcodes);
  };

  // Request camera permissions
  const requestPermissions = async (): Promise<boolean> => {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  };

  // Validate the scanned barcode and redirect if valid
  const validateAndRedirect = (scannedBarcodes: Barcode[]) => {
    scannedBarcodes.forEach((barcode) => {
      // Extract the first 7 characters of the QR code's raw value
      const codeToCheck = barcode.rawValue?.substring(0, 7);

      // Check if the extracted code is in the CourseCode enum
      if (codeToCheck && Object.values(CourseCode).includes(codeToCheck as CourseCode)) {
        history.push('/captureYourself'); // Redirect to '/captureYourself'
      }
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>CaptureQR</IonTitle>
        </IonToolbar>
      </IonHeader>
            <IonContent
        className="ion-padding"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {/* Static Image and Text */}
        <div style={{ textAlign: 'center' }}>
          <img
            src="./WHITE.png" // Replace with your actual image URL
            alt="Attend It"
            style={{
              width: '80%', // Adjust width to be responsive
              maxWidth: '400px', // Ensure the image doesn't exceed 400px
              height: 'auto', // Maintain aspect ratio
              marginBottom: '20px',
            }}
          />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Attend It</h2>
        </div>

        {/* Barcode Scan Button */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={scan} disabled={!isSupported}>
            <IonIcon icon={scanOutline} />
          </IonFabButton>
        </IonFab>

        {/* Permission Alert */}
        <IonAlert
          isOpen={alertShown}
          onDidDismiss={() => setAlertShown(false)}
          header="Permission Denied"
          message="Please grant camera permission to use the barcode scanner."
          buttons={['OK']}
        />
      </IonContent>

    </IonPage>
  );
};

export default CaptureQR;
