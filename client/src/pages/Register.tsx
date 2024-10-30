import {
  IonContent,
  IonPage,
  IonText,
  IonInput,
  IonButton,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonToast,
} from "@ionic/react";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";

const Register: React.FC = () => {
  const { control, handleSubmit, reset, setError } = useForm();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();

  interface InputProps {
    name: string;
    label: string;
    component?: React.ReactElement;
    validation?: any;
  }

  const formFields: InputProps[] = [
    {
      name: "email",
      label: "Email",
      component: <IonInput type="email" />,
      validation: {
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@iitj\.ac\.in$/,
          message: "Email must end with @iitj.ac.in",
        },
        required: "Email is required",
      },
    },
    {
      name: "fullName",
      label: "Full Name",
      validation: { required: "Full Name is required" },
    },
    {
      name: "password",
      label: "Password",
      component: <IonInput type="password" clearOnEdit={false} />,
      validation: { required: "Password is required" },
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
        setToastMessage("Successfully registered!");
        setShowToast(true);
        reset();
        setTimeout(() => {
          history.push("/capture");
        }, 2000);
      } else if (result.message === "User already exists") {
        setError("email", { type: "manual", message: "USER ALREADY EXISTS" });
        setToastMessage("USER ALREADY EXISTS");
        setShowToast(true);
      } else {
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
                  rules={field.validation}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      {React.cloneElement(field.component || <IonInput />, {
                        onIonChange: (e: any) => onChange(e.detail.value),
                        value,
                      })}
                      {error && (
                        <IonText color="danger">
                          <p>{error.message}</p>
                        </IonText>
                      )}
                    </>
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
