import React from 'react';
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
} from '@ionic/react';

// Simulate data for demonstration
const professorName = 'Prof. ABC';
const courses = [
  { code: 'MATH101', name: 'Mathematics 101' },
  { code: 'PHYS102', name: 'Physics 102' },
];

// Function to generate and download attendance data
const downloadAttendance = (courseCode: string) => {
  // Simulated data for attendance
  const attendanceData = [
    { date: '2024-10-10', time: '10:00 AM', student: 'John Doe' },
    { date: '2024-10-10', time: '10:05 AM', student: 'Jane Smith' },
    // Add more attendance records as needed
  ];

  // Generate CSV content from attendance data
  const csvContent = [
    ['Date', 'Time', 'Student Name'],
    ...attendanceData.map((record) => [record.date, record.time, record.student]),
  ]
    .map((e) => e.join(','))
    .join('\n');

  // Create a blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  // Create a temporary download link
  const link = document.createElement('a');
  link.href = url;
  link.download = `${courseCode}_Attendance.csv`;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const AdminDashboard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <h2 className="text-2xl font-bold text-gray-800">Hello {professorName}!</h2>
        <IonGrid>
          <IonRow>
            <IonCol>
              <h3 className="mt-4 text-lg font-semibold text-gray-700">Your Courses</h3>
              <IonList>
                {courses.map((course) => (
                  <IonItem key={course.code} className="flex items-center justify-between">
                    <IonLabel>{course.code}</IonLabel>
                    <IonButton color="tertiary" onClick={() => downloadAttendance(course.code)}>
                      Download Attendance
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
