import React, { FC } from "react";
import { IonItem, IonLabel, IonInput } from "@ionic/react";
import { Controller, Control } from "react-hook-form";

export interface InputProps {
  name: string;
  control?: Control;
  label?: string;
  component?: JSX.Element;
}

const Input: FC<InputProps> = ({
  name,
  control,
  component,
  label,
}) => {
  return (
    <>
      <IonItem>
        {label && (
          <IonLabel position="fixed">{label}</IonLabel>
        )}
            <Controller
            name={name}
            control={control}
            render={({ field }) => (
                component ? React.cloneElement(component, { ...field }) : <IonInput {...field} />
            )}
            />
      </IonItem>
    </>
  );
};

export default Input;