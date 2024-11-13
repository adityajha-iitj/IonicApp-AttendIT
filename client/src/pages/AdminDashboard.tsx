import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonInput,
  IonIcon,
} from '@ionic/react';
import { closeOutline, addOutline } from 'ionicons/icons';

const professorName = 'Prof. ABC';
const initialCourses = [
  { code: 'MATH101', name: 'Mathematics 101' },
  { code: 'PHYS102', name: 'Physics 102' },
];

// Function to generate a random string
const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
};

const downloadAttendance = (courseCode: string) => {
  const attendanceData = [
    { date: '2024-10-10', time: '10:00 AM', student: 'John Doe' },
    { date: '2024-10-10', time: '10:05 AM', student: 'Jane Smith' }
  ];

  const csvContent = [
    ['Date', 'Time', 'Student Name'],
    ...attendanceData.map((record) => [record.date, record.time, record.student]),
  ]
    .map((e) => e.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${courseCode}`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', name: '' });

  const generateQRCode = async (courseCode: string) => {
    const randomString = generateRandomString(8); // Generate a random 8-character string
    const qrData = `${courseCode}${randomString}`; // Append the random string to the course code

    try {
      const dataUrl = await QRCode.toDataURL(qrData, { width: 500 });
      setQrCodeDataUrl(dataUrl);
      setSelectedCourse(courseCode);
      setIsQrModalOpen(true);
    } catch (error) {
      console.error('Failed to generate QR Code', error);
    }
  };

  const handleAddCourse = () => {
    setCourses([...courses, newCourse]);
    setNewCourse({ code: '', name: '' });
    setIsAddCourseModalOpen(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <h2 className="text-2xl font-bold text-gray-800">Hello {professorName}!</h2>

        {/* Add Courses Button */}
        <div className="flex items-center mt-4">
          <IonButton color="success" onClick={() => setIsAddCourseModalOpen(true)} fill="clear">
            <IonIcon icon={addOutline} slot="start" />
            Add Courses
          </IonButton>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol>
              <h3 className="mt-4 text-lg font-semibold text-gray-700">Your Courses</h3>
              <IonList>
                {courses.map((course) => (
                  <IonItem key={course.code} className="flex items-center justify-between">
                    <IonLabel>{course.code}</IonLabel>
                    <IonButton color="secondary" onClick={() => generateQRCode(course.code)}>
                      Generate QR
                    </IonButton>
                    <IonButton color="tertiary" onClick={() => downloadAttendance(course.code)}>
                      Download Attendance
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>

              {/* QR Code Modal */}
              <IonModal isOpen={isQrModalOpen} onDidDismiss={() => setIsQrModalOpen(false)}>
                <IonContent class="ion-padding flex items-center justify-center">
                  <IonButton
                    onClick={() => setIsQrModalOpen(false)}
                    color="danger"
                    fill="clear"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 1000,
                    }}
                  >
                    <IonIcon icon={closeOutline} size="large" />
                  </IonButton>
                  <div className="flex flex-col items-center">
                    <h4 className="text-lg font-semibold text-gray-700">{selectedCourse} QR Code (Full Screen):</h4>
                    {qrCodeDataUrl && (
                      <div className="mt-4">
                        <img src={qrCodeDataUrl} alt="QR Code" width={500} height={500} />
                      </div>
                    )}
                  </div>
                </IonContent>
              </IonModal>

              {/* Add Course Modal */}
              <IonModal isOpen={isAddCourseModalOpen} onDidDismiss={() => setIsAddCourseModalOpen(false)}>
                <IonContent class="ion-padding">
                  <IonButton
                    onClick={() => setIsAddCourseModalOpen(false)}
                    color="danger"
                    fill="clear"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 1000,
                    }}
                  >
                    <IonIcon icon={closeOutline} size="large" />
                  </IonButton>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Course</h3>
                  <IonItem>
                    <IonLabel position="stacked">Course Code</IonLabel>
                    <IonInput
                      value={newCourse.code}
                      placeholder="Enter course code"
                      onIonChange={(e) => setNewCourse({ ...newCourse, code: e.detail.value! })}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Course Name</IonLabel>
                    <IonInput
                      value={newCourse.name}
                      placeholder="Enter course name"
                      onIonChange={(e) => setNewCourse({ ...newCourse, name: e.detail.value! })}
                    />
                  </IonItem>
                  <IonButton expand="block" color="primary" onClick={handleAddCourse} className="mt-4">
                    Add Course
                  </IonButton>
                </IonContent>
              </IonModal>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
