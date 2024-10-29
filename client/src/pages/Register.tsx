  import { IonContent, IonPage, IonText, IonInput, IonButton, IonCheckbox, IonItem, IonLabel, IonToast } from "@ionic/react";
  import React, { useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import Input, { InputProps } from "../components/Input";
  import { useHistory } from "react-router-dom";

  const Register: React.FC = () => {
    const { control, handleSubmit, reset } = useForm();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const history = useHistory();

    const formFields: InputProps[] = [
      {
        name: "email",
        label: "Email",
        component: <IonInput type="email" />,
      },
      {
        name: "fullName",
        label: "Full Name",
      },
      {
        name: "password",
        label: "Password",
        component: <IonInput type="password" clearOnEdit={false} />,
      },
    ];

    const registerUser = async (data: any) => {
      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          // Handle success
          setToastMessage("Successfully registered!");
          setShowToast(true);
          reset(); // Clear form fields
          setTimeout(() => {
            history.push("/capture"); // Redirect to "/capture" after success
          }, 2000);
        } else {
          // Handle error
          setToastMessage(result.message || "Error during registration");
          setShowToast(true);
        }
      } catch (error) {
        console.error("Error:", error);
        setToastMessage("Error during registration");
        setShowToast(true);
      }
    };

    return (
      <IonPage>
        <IonContent>
          <div className="ion-padding">
            <IonText color="muted">
              <h2>Create Account</h2>
            </IonText>
            <form onSubmit={handleSubmit(registerUser)}>
              {formFields.map((field, index) => (
                <IonItem key={index}>
                  <IonLabel position="stacked">{field.label}</IonLabel>
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      React.cloneElement(field.component || <IonInput />, {
                        onIonChange: (e: any) => onChange(e.detail.value),
                        value,
                      })
                    )}
                  />
                </IonItem>
              ))}
              <IonItem>
                <IonLabel>I agree to the terms of service</IonLabel>
                <IonCheckbox slot="start" />
              </IonItem>
              <IonButton expand="block" type="submit" className="ion-margin-top">
                Register
              </IonButton>
            </form>
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={toastMessage}
              duration={2000}
            />
          </div>
        </IonContent>
      </IonPage>
    );
  };

  export default Register;
