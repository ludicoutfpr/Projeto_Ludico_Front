import { useState, useEffect, useCallback } from "react";
import { LabeledInput } from "../../../components/Input";
import { PrimaryButton } from "../../../components/Button";
import { Table } from "../../../components/Table";
import { LabeledSelect } from "../../../components/Select";
import { Modal } from "../../../components/Modal";
import axios from "axios";
import { debounce } from "lodash";

export function User({ data, tabsComponent, getUsers }) {
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [email, setEmail] = useState("");
    const [institution, setInstitution] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [roles, setRoles] = useState([]);
    const [addUserError, setAddUserError] = useState("");
    const [identifierErrorMessage, setIdentifierErrorMessage] = useState("");
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        getRoles();
    }, []);

    const getRoles = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/role`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRoles(response?.data || []);
        } catch (err) {
            console.log(err);
        }
    }

    const changeName = (e) => {
        const value = e.target.value;
        setName(value);
    }

    const changeUsername = (e) => {
        const value = e.target.value;
        setUsername(value);
    }

    const changeIdentifier = (e) => {
        const value = e.target.value;
        setIdentifier(value);
    }

    const changeEmail = (e) => {
        const value = e.target.value;
        setEmail(value);
    }

    const changeInstitution = (e) => {
        const value = e.target.value;
        setInstitution(value);
    }

    const changeRole = (e) => {
        const value = e.target.value;
        setRole(value);
    }

    const changePassword = (e) => {
        const value = e.target.value;
        setPassword(value);
    }

    const changeConfirmPassword = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
    }

    const cleanInputs = () => {
        setName("");
        setUsername("");
        setIdentifier("");
        setEmail("");
        setInstitution("");
        setRole("");
        setPassword("");
        setConfirmPassword("");
    }

    const cleanErrorMessages = () => {
        setEmailErrorMessage("");
        setAddUserError("");
        setUsernameErrorMessage("");
        setIdentifierErrorMessage("");
    }

    const handleAddUser = async () => {
        cleanErrorMessages();
        if (!(name && username && identifier && email && institution && role && password && confirmPassword)) {
            setAddUserError("Preencha todos os campos");
            return;
        } else if (password !== confirmPassword) {
            setAddUserError("As senhas estão diferentes");
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/user`, {
                name,
                identifier,
                username,
                password,
                email,
                institution,
                role
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 200) {
                getUsers();
                setIsAddingUser(false);
                cleanInputs();
            }
        } catch (error) {
            if (error?.response?.data?.includes("dup key: { identifier")) {
                setIdentifierErrorMessage("RA/CPF já cadastrado")
            } else if (error?.response?.data?.includes("dup key: { email")) {
                setEmailErrorMessage("Email já cadastrado")
            } else if (error?.response?.data?.includes("dup key: { username")) {
                setUsernameErrorMessage("Username já cadastrado")
            } else {
                console.log("Erro ao criar participante!", error);
                setAddUserError("Erro ao criar participante")
            }
        }
    }

    const handleDeleteUser = async (item) => {
        console.log(item);
        try {
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/user/${item._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                getUsers();
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            {<>
                {isAddingUser ?
                    <div className="flex flex-col items-center">
                        <div className="w-1/2 flex flex-col gap-4">
                            {tabsComponent}
                            <div className="flex gap-12 items-start">
                                <LabeledInput
                                    description="Nome"
                                    placeholder="Nome Completo"
                                    toUppercase={false}
                                    value={name}
                                    onChange={changeName}
                                />
                                <LabeledInput
                                    description="Usuário"
                                    placeholder="nomedeusuario"
                                    toUppercase={false}
                                    value={username}
                                    onChange={changeUsername}
                                    errorMessage={usernameErrorMessage}
                                />
                            </div>
                            <LabeledInput
                                description="CPF ou RA"
                                placeholder="00000000"
                                toUppercase={false}
                                value={identifier}
                                onChange={changeIdentifier}
                                errorMessage={identifierErrorMessage}
                            />
                            <LabeledInput
                                description="E-mail"
                                placeholder="email@email.com"
                                toUppercase={false}
                                value={email}
                                onChange={changeEmail}
                                errorMessage={emailErrorMessage}
                            />
                            <LabeledSelect
                                description="Instituição"
                                options={[
                                    { id: "", text: "Selecione" },
                                    { id: "UTFPR-CP", text: "UTFPR - Cornélio Procópio" },
                                    { id: "UTFPR-LONDRINA", text: "UTFPR - Londrina" },
                                    { id: "UENP", text: "UENP" },
                                    { id: "OUTRAS", text: "Outras" },
                                ]}
                                toUppercase={false}
                                value={institution}
                                onChange={changeInstitution}
                            />
                            <LabeledSelect
                                description="Acesso"
                                options={[
                                    { id: "", text: "Selecione" },
                                    ...roles?.map(item => ({ id: item._id, text: item.description }))
                                ]}
                                toUppercase={false}
                                value={role}
                                onChange={changeRole}
                            />
                            <div className="flex gap-12 items-end">

                                <LabeledInput
                                    description="Senha"
                                    placeholder="*********"
                                    type="password"
                                    toUppercase={false}
                                    value={password}
                                    onChange={changePassword}
                                />
                                <LabeledInput
                                    description="Repetir senha"
                                    placeholder="*********"
                                    type="password"
                                    toUppercase={false}
                                    value={confirmPassword}
                                    onChange={changeConfirmPassword}
                                />
                            </div>
                            {addUserError &&
                                <span className="text-red-400 font-bold text-center">{addUserError}</span>
                            }
                            <div className="flex justify-center">
                                <PrimaryButton
                                    className="w-1/3 text-2xl font-bold px-8 mt-6"
                                    onClick={handleAddUser}
                                    text="Cadastrar"
                                    fullWidth={false}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    <div className="w-full flex flex-col px-14 mt-4">
                        {tabsComponent}
                        <Table
                            column={["Nome", "Usuário", "Acesso"]}
                            data={data?.map(item => {
                                return {
                                    _id: item._id,
                                    name: item.name,
                                    username: item.username,
                                    role: item.role?.description
                                }
                            })}
                            hasEdit={false}
                            hasDelete={true}
                            hasAddPresence={false}
                            onDelete={handleDeleteUser}
                        />
                        <div className="flex w-full justify-end mt-9">
                            <div className="">
                                <PrimaryButton
                                    className="text-2xl font-bold px-8"
                                    onClick={() => setIsAddingUser(true)}
                                    text="cadastrar usuário"
                                />
                            </div>
                        </div>
                    </div>
                }
            </>}
        </>
    )
}