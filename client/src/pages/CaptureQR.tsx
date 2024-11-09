import React, { useEffect, useState } from 'react';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonFab,
  IonFabButton,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { scanOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

enum CourseCode {
  MATH101 = 'MATH101',
  PHYS102 = 'PHYS102',
  CHEM103 = 'CHEM103',
  CS104 = 'CS104',
  // add other course codes as needed
}

const CaptureQR: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [alertShown, setAlertShown] = useState(false);
  const history = useHistory();

  useEffect(() => {
    BarcodeScanner.isSupported().then((result) => {
      setIsSupported(result.supported);
    });
  }, []);

  const scan = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      setAlertShown(true);
      return;
    }

    const { barcodes: scannedBarcodes } = await BarcodeScanner.scan();
    setBarcodes([...barcodes, ...scannedBarcodes]);
    validateAndRedirect(scannedBarcodes);
  };

  const requestPermissions = async (): Promise<boolean> => {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  };

  const validateAndRedirect = (scannedBarcodes: Barcode[]) => {
    scannedBarcodes.forEach((barcode) => {
      // Extract the first 7 characters of the QR code's raw value
      const codeToCheck = barcode.rawValue?.substring(0, 7);
      
      // Check if the extracted code is in the CourseCode enum
      if (codeToCheck && Object.values(CourseCode).includes(codeToCheck as CourseCode)) {
        history.push('/captureYourself');
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
      <IonContent className="ion-padding">
        <IonList>
          {barcodes.map((barcode, index) => (
            <IonItem key={index}>
              <IonLabel position="stacked">{barcode.format}</IonLabel>
              <IonInput type="text" value={barcode.rawValue} readonly></IonInput>
            </IonItem>
          ))}
        </IonList>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={scan} disabled={!isSupported}>
            <IonIcon icon={scanOutline} />
          </IonFabButton>
        </IonFab>
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
