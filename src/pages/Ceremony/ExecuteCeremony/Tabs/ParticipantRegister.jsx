import { useState } from "react";
import { LabeledInput } from "../../../../components/Input";
import { PrimaryButton } from "../../../../components/Button";
import { LabeledSelect } from "../../../../components/Select";
import axios from "axios";

export function ParticipantRegister({ data }) {
    const [name, setName] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [institution, setInstitution] = useState("");
    const [missingFieldsError, setMissingFieldsError] = useState(false);
    const [identifierErrorMessage, setIdentifierErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const token = localStorage.getItem('authToken');

    const changeName = (e) => {
        const value = e.target.value;
        setName(value);
    }

    const changeIdentifier = (e) => {
        const value = e.target.value;
        setIdentifier(value);
    }

    const changeEmail = (e) => {
        const value = e.target.value;
        setEmail(value);
    }

    const changeDateOfBirth = (e) => {
        const value = e.target.value;
        setDateOfBirth(value);
    }

    const changeGender = (e) => {
        console.log(e);
        const value = e.target.value;
        setGender(value);
    }

    const changeInstitution = (e) => {
        const value = e.target.value;
        setInstitution(value);
    }

    const cleanInputs = () => {
        setName("");
        setIdentifier("");
        setEmail("");
        setDateOfBirth("");
        setGender("");
        setInstitution("");
    }

    console.log(data)

    const handleRegisterParticipator = async () => {
        if (!(name && identifier && email && dateOfBirth && gender && institution)) {
            setMissingFieldsError(true);
            return;
        }

        setMissingFieldsError(false);
        setEmailErrorMessage("");
        setIdentifierErrorMessage("");
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/participator/`, {
                name,
                identifier,
                email,
                dateOfBirth,
                gender,
                institution
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            if (response.status === 200) {
                cleanInputs();
            }
        } catch (error) {
            if (error?.response?.data?.includes("dup key: { identifier")) {
                setIdentifierErrorMessage("RA/CPF já cadastrado")
            } else if (error?.response?.data?.includes("dup key: { email")) {
                setEmailErrorMessage("Email já cadastrado")
            } else {
                console.log("Erro ao criar participante!", error);
            }
        }
    }

    return (
        <div className="w-full flex flex-col items-center mt-8">
            <div className="flex w-1/2 flex-col gap-4 mb-4">
                <LabeledInput
                    description="Nome"
                    placeholder="José da Silva"
                    type="text"
                    value={name}
                    onChange={changeName}
                    toUppercase={false}
                />
                <LabeledInput
                    description="ra/cpf"
                    placeholder="0000000"
                    type="number"
                    value={identifier}
                    onChange={changeIdentifier}
                    errorMessage={identifierErrorMessage}
                />
                <LabeledInput
                    description="E-mail"
                    placeholder="jose@gmail.com"
                    type="email"
                    value={email}
                    onChange={changeEmail}
                    toUppercase={false}
                    errorMessage={emailErrorMessage}
                />
                <div className="flex gap-12">
                    <LabeledInput
                        description="Data nascimento"
                        type="date"
                        value={dateOfBirth}
                        onChange={changeDateOfBirth}
                        toUppercase={false}
                    />
                    <LabeledSelect
                        description="Gênero"
                        options={[
                            { id: "", text: "Selecione" },
                            { id: "male", text: "Masculino" },
                            { id: "female", text: "Feminino" },
                        ]}
                        value={gender}
                        onChange={changeGender}
                        toUppercase={false}
                    />
                </div>
                <LabeledSelect
                    description="Instituição"
                    options={[
                        { id: "", text: "Selecione" },
                        { id: "UTFPR-CP", text: "UTFPR - Cornélio Procópio" },
                        { id: "UTFPR-LONDRINA", text: "UTFPR - Londrina" },
                        { id: "UENP", text: "UENP" },
                        { id: "OUTRAS", text: "Outras" },
                    ]}
                    value={institution}
                    onChange={changeInstitution}
                    toUppercase={false}
                />
            </div>
            {missingFieldsError &&
                <span className="text-red-400 font-bold">Preencha todos os campos</span>
            }
            <PrimaryButton
                className="w-fit text-2xl font-bold px-16 mt-4"
                text="cadastrar"
                fullWidth={false}
                onClick={handleRegisterParticipator}
            />
        </div>
    )
}