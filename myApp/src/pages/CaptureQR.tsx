import React, { useEffect, useState } from 'react';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonFab, IonFabButton, IonIcon, IonAlert } from '@ionic/react';
import { scanOutline } from 'ionicons/icons';

const CaptureQR: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [alertShown, setAlertShown] = useState(false);

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
  };

  const requestPermissions = async (): Promise<boolean> => {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
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
