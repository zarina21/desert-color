"use client";
import React, { useState } from "react";
import InputComponent from "../../../components/InputComponent";
import AuthClass from "../../../authClass";

export default function Log() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({}); // Estado para almacenar errores
    const [showSuccess, setShowSuccess] = useState(false); // Estado para mostrar la notificación de éxito
    const [acceptedTerms, setAcceptedTerms] = useState(false); // Estado para controlar si los términos son aceptados

    const onChangeForm = (key, value) => {
        setForm({
            ...form,
            [key]: value,
        });
        // Limpia el error correspondiente al cambiar el valor
        setErrors({
            ...errors,
            [key]: '',
        });
    };

    // Validación del formulario
    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!form.name) {
            newErrors.name = 'El nombre es obligatorio';
            valid = false;
        }

        if (!form.email) {
            newErrors.email = 'El email es obligatorio';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Formato de email inválido';
            valid = false;
        }

        if (!form.password) {
            newErrors.password = 'La contraseña es obligatoria';
            valid = false;
        } else if (form.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            valid = false;
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            valid = false;
        }

        // Verificar si los términos y condiciones están aceptados
        if (!acceptedTerms) {
            newErrors.acceptedTerms = 'Debe aceptar los términos y condiciones';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const onSendForm = async () => {
        if (!validateForm()) return; // Llamada a la validación del formulario

        try {
            const result = await AuthClass.register(form);

            if (result.success) {
                setShowSuccess(true); // Mostrar la notificación de éxito
            }
        } catch (e) {
            // Mostrar el error en el formulario
            if (e.message === 'El correo electrónico ya está en uso') {
                setErrors(prevErrors => ({ ...prevErrors, email: 'El correo electrónico ya está en uso' }));
            } else if (e.message === 'El nombre de usuario ya está en uso') {
                setErrors(prevErrors => ({ ...prevErrors, name: 'El nombre de usuario ya está en uso' }));
            } else {
                console.log(e);
            }
        }
    };

    // Función para cerrar la notificación de éxito y limpiar el formulario
    const closeSuccessMessage = () => {
        setShowSuccess(false);
        setForm({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
        setAcceptedTerms(false); // Restablecer el checkbox de términos
    };

    return (
        <div className="columns is-centered">
            <div className="column is-6">
                {showSuccess && ( // Mostrar notificación de éxito si `showSuccess` es verdadero
                    <div className="notification is-success">
                        <button className="delete" onClick={closeSuccessMessage}></button>
                        Su cuenta ha sido creada exitosamente.
                    </div>
                )}

                <InputComponent
                    placeholder="Name"
                    value={form.name}
                    label="Name:"
                    onChange={(v) => onChangeForm('name', v)}
                />
                {errors.name && <p className="help is-danger">{errors.name}</p>} {/* Mensaje de error para el nombre */}

                <InputComponent
                    type="email"
                    placeholder="Correo@ejemplo.com"
                    value={form.email}
                    label="Email:"
                    onChange={(v) => onChangeForm('email', v)}
                />
                {errors.email && <p className="help is-danger">{errors.email}</p>} {/* Mensaje de error para el email */}

                <InputComponent
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    label="Password:"
                    onChange={(v) => onChangeForm('password', v)}
                />
                {errors.password && <p className="help is-danger">{errors.password}</p>} {/* Mensaje de error para la contraseña */}

                <InputComponent
                    type="password"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    label="Confirm password:"
                    onChange={(v) => onChangeForm('confirmPassword', v)}
                />
                {errors.confirmPassword && <p className="help is-danger">{errors.confirmPassword}</p>} {/* Mensaje de error para la confirmación de contraseña */}

                <div className="field py-5">
                    <div className="control">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={() => setAcceptedTerms(!acceptedTerms)}
                            />
                            I agree to the <a href="#">terms and conditions</a>
                        </label>
                    </div>
                    {errors.acceptedTerms && <p className="help is-danger">{errors.acceptedTerms}</p>} {/* Mensaje de error para términos y condiciones */}
                </div>

                <div className="field is-grouped">
                    <button onClick={onSendForm} className="button is-link is-fullwidth">Submit</button>
                </div>
            </div>
        </div>
    );
}
