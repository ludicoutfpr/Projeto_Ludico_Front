import { ca, is, se } from "date-fns/locale"
import { useState, useEffect } from "react"
import { Header } from "../../components/Header"
import { Table } from "../../components/Table"
import { PrimaryButton } from "../../components/Button"
import { LabeledInput } from "../../components/Input"
import { LabeledSelect } from "../../components/Select"
import axios from "axios"
import { Modal } from "../../components/Modal"

export function BoardGames() {
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [boardGames, setBoardGames] = useState([])
  const token = localStorage.getItem('authToken');
  const [boardGameName, setBoardGameName] = useState("")
  const [minAge, setMinAge] = useState("")
  const [quantityOfPlayers, setQuantityOfPlayers] = useState("")
  const [storageLocation, setStorageLocation] = useState("")
  const [publisher, setPublisher] = useState("")
  const [designers, setDesigners] = useState("")
  const [sugestedNumberOfPlayers, setSugestedNumberOfPlayers] = useState("")
  const [bggRating, setBggRating] = useState("")
  const [owner, setOwner] = useState("")
  const [barCode, setBarCode] = useState("")
  const [addBoardGameError, setAddBoardGameError] = useState(false)
  const [mainCategory, setMainCategory] = useState("Board Game")
  const [mechanicsList, setMechanicsList] = useState([""]);
  const [themeList, setThemeList] = useState([""]);
  const [selectedBoardGame, setSelectedBoardGame] = useState(null);
  const [borrow, setBorrow] = useState("");

  useEffect(() => {
    
    getBoardGames()
  }, [])

  
  const cleanInputs = () => {
    setBoardGameName("")
    setMinAge("")
    setQuantityOfPlayers("")
    setStorageLocation("")
    setPublisher("")
    setDesigners("")
    setSugestedNumberOfPlayers("")
    setBggRating("")
    setOwner("")
    setBarCode("")
    setMechanicsList([""])
    setThemeList([""])
    setAddBoardGameError(false)
    setMainCategory("")
    selectedBoardGame(null);
    setBorrow("");
  }
  
  const changeBoardGameName = (e) => {
    setBoardGameName(e.target.value)
  }

  const changeMainCategory = (e) => {
    setMainCategory(e.target.value)
  }

  const chageBarCode = (e) => {
    setBarCode(e.target.value)
  }
  
  const changeMinAge = (e) => {
    setMinAge(e.target.value)
  }

  const changeQuantityOfPlayers = (e) => {
    setQuantityOfPlayers(e.target.value)
  }
  
  const changeStorageLocation = (e) => {
    setStorageLocation(e.target.value)
  }
  
  const changePublisher = (e) => {
    setPublisher(e.target.value) 
  }
  
  const changeDesigners = (e) => {
    setDesigners(e.target.value)
  }
  
  const changeSugestedNumberOfPlayers = (e) => {
    setSugestedNumberOfPlayers(e.target.value)
  }
  
  const changeBggRating = (e) => {
    setBggRating(e.target.value)
  }
  
  const changeOwner = (e) => {
    setOwner(e.target.value)
  }

  const handleMechanicChange = (index, value) => {
    const updatedMechanics = [...mechanicsList];
    updatedMechanics[index] = value;
    setMechanicsList(updatedMechanics);
  };

  const handleAddMechanic = () => {
    setMechanicsList([...mechanicsList, ""]);
  };
  
  const handleThemesChanges = (index, value) => {
    const updatedThemes = [...themeList];
    updatedThemes[index] = value;
    setThemeList(updatedThemes);
  }

  const handleAddTheme = () => {
    setThemeList([...themeList, ""]);
  }

  const changeBorrow = (e) => {
    setBorrow(e.target.value)
  }

  const getBoardGames = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/boardgame`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        setBoardGames(response.data);
      }
      else {
        console.error("Failed to fetch board games:", response);
        
      }
    } catch (error) {
      console.error("Error fetching board games:", error);
      
    }
  }

  const handleAddBoardGame = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/boardgame`,{
        boardGameName: boardGameName,
        minAge: minAge,
        qrCode: barCode,
        minPlayerQuantity: 1,
        maxPlayerQuantity: quantityOfPlayers,
        publisher: publisher,
        designer: designers,
        bggRank: 0,
        IsExpansion: false,
        mainCategory: mainCategory,
        mechanics: mechanicsList,
        themeList: themeList,
        storageLocation: storageLocation,
        isExpasion: false,
        bestQuantityOfPlayers: sugestedNumberOfPlayers,
        rating: bggRating,
        owner: owner,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(response.status === 201) {
        console.log("Board Game added successfully");
        getBoardGames();
        cleanInputs();
        setIsCreating(false);
      }else {
        console.error("Failed to add scape:", response.data);
        setAddBoardGameError(true);
        return;
      }
    }
    catch (error) {
      console.error("Error adding scape:", error);
      setAddBoardGameError(true);
      return;
    }
  }

  const handleOnClickEdit = async (item) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/boardgame/${item._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if(response.status !== 200) {
        console.error("Failed to fetch scape for edit:", response.data);
        return;
      }
      
      setSelectedBoardGame(response.data);
      setIsEditing(true);
      setBoardGameName(response.data.boardGameName);
      setMinAge(response.data.minAge);
      setBarCode(response.data.qrCode);
      setQuantityOfPlayers(response.data.maxPlayerQuantity);
      setStorageLocation(response.data.storageLocation);
      setPublisher(response.data.publisher);
      setDesigners(response.data.designer);
      setMainCategory(response.data.mainCategory);
      setMechanicsList(response.data.mechanics || [""]);
      setThemeList(response.data.themes || [""]);
      setSugestedNumberOfPlayers(response.data.bestQuantityOfPlayers);
      setBggRating(response.data.rating);
      setOwner(response.data.owner);

      console.log("Edit scape => ", response.data);
    }catch (error) {
      console.error("Error fetching scape for edit:", error);
      return;
    }
  }

  const handleDelete = async (item) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/boardgame/${item._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setBoardGames(boardGames.filter(boardGame => boardGame._id !== item._id));
      } else {
        console.error("Failed to delete scape:", response.data);
      }
    } catch (error) {
      console.error("Error deleting scape:", error);
    }
  }
  
  const handleUpdate = async () => {
    console.log("Updating scape:", selectedBoardGame._id);
    

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/boardgame/${selectedBoardGame._id}`,{
        boardGameName: boardGameName,
        minAge: minAge,
        qrCode: barCode,
        minPlayerQuantity: 1,
        maxPlayerQuantity: quantityOfPlayers,
        publisher: publisher,
        designer: designers,
        bggRank: 0,
        IsExpansion: false,
        mainCategory: mainCategory,
        mechanics: mechanicsList,
        themeList: themeList,
        storageLocation: storageLocation,
        isExpasion: false,
        bestQuantityOfPlayers: sugestedNumberOfPlayers,
        rating: bggRating,
        owner: owner,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(response.status === 200) {
        getBoardGames();
        console.log("Scape updated successfully");
        cleanInputs();
      } else {
        console.error("Failed to update scape:", response.data);
        setAddBoardGameError(true);
        return;
      }
    }catch (error) {
      console.error("Error updating scape:", error);
      setAddBoardGameError(true);
      return;
    }
    
    setIsEditing(false);
  }  

  const handleLent = async (item) => {
    console.log("Lending board game:", item._id);
    setSelectedBoardGame(item);

    document.getElementById("lentGameModal")?.showModal();
  }

  
  const handleConfirmLent = async () => {
    console.log("Confirming lent for board game:", selectedBoardGame._id);
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/lent`,{
        boardgameLent: selectedBoardGame._id,
        participator: borrow
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(response.status === 200) {
        console.log("Board game lent successfully");
        getBoardGames();
        cleanInputs();
        document.getElementById("lentGameModal")?.close();
      }
    } catch (error) {
      console.error("Error lending board game:", error);
      return;
    }
  }

  const handleReturnBoardGame = async (item) => {
    console.log("Returning board game:", item._id);
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/boardgame/return/`,{
        boardGameId: item._id
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(response.status === 200) {
        console.log("Board game returned successfully");
        getBoardGames();
      } else {
        console.error("Failed to return board game:", response.data);
      }
    }catch (error) {
      console.error("Error returning board game:", error);
      return;
    }
  }

  return (
    <>
      {isCreating ? 
        <div className="min-h-screen w-screen bg-zinc-700 pb-8">
          <Header title="Create Scape" />
          <div className="flex flex-col items-center mt-8">
            <div className="w-1/2 flex flex-col gap-4">
              <LabeledInput
                description="Jogo"
                placeholder="Nome do jogo de tabuleiro"
                toUppercase={false}
                value={boardGameName}
                onChange={changeBoardGameName}
              />
              <LabeledInput
                description="Código de Barras"
                placeholder="Código de barras do jogo"
                toUppercase={false}
                value={barCode}
                onChange={chageBarCode}
              />
              <div className="flex gap-12 items-end">
                <LabeledInput
                  description="Idade Mínima"
                  placeholder="Idade mínima para jogar"
                  toUppercase={false}
                  value={minAge}
                  onChange={changeMinAge}
                />
                <LabeledInput
                  description="Quantidade de Jogadores"
                  placeholder={"Quantidade máxima de jogadores"}
                  toUppercase={false}
                  value={quantityOfPlayers}
                  onChange={changeQuantityOfPlayers}
                />
              </div>
              <LabeledInput
                description="Local de Armazenagem"
                placeholder="Local onde o jogo é armazenado"
                toUppercase={false}
                value={storageLocation}
                onChange={changeStorageLocation}
              />
              <div className="flex gap-12 items-end">
                <LabeledInput
                  description="Editora"
                  placeholder="Editora do jogo"
                  toUppercase={false}
                  value={publisher}
                  onChange={changePublisher}
                />
                <LabeledInput
                  description="Designers do jogo"
                  placeholder="Nome dos designers do jogo"
                  toUppercase={false}
                  value={designers}
                  onChange={changeDesigners}
                />
              </div>
              
              <LabeledInput
                  description="Categoria Principal do Jogo (Ex: Card Game)"
                  placeholder="Categoria Principal"
                  toUppercase={false}
                  value={mainCategory}
                  onChange={changeMainCategory}
                />

              {mechanicsList.map((mechanic, idx) => (
                <LabeledInput
                  key={idx}
                  description={idx === 0 ? "Mecânica" : `Mecânica ${idx + 1}`}
                  placeholder="Mecânica do jogo"
                  toUppercase={false}
                  value={mechanic}
                  onChange={e => handleMechanicChange(idx, e.target.value)}
                />
              ))}
              <button
                type="button"
                className="text-zinc-50 text-left w-fit mb-2 text-xl"
                onClick={handleAddMechanic}
              >
                Adicionar outra mecânica
              </button>
              {themeList.map((theme, idx) => (
                <LabeledInput
                  key={idx}
                  description={idx === 0 ? "Tema" : `Tema ${idx + 1}`}
                  placeholder="Tema do jogo"
                  toUppercase={false}
                  value={theme}
                  onChange={e => handleThemesChanges(idx, e.target.value)}
                />
              ))}
              <button
                type="button"
                className="text-zinc-50 text-left w-fit mb-2 text-xl"
                onClick={handleAddTheme}
              >
                Adicionar outro tema
              </button>              
              <div className="flex gap-12 items-end">
                <LabeledInput
                  description="Quantidade Ideal de Jogadores"
                  placeholder="Sugestão de quantidade de jogadores"
                  toUppercase={false}
                  value={sugestedNumberOfPlayers}
                  onChange={changeSugestedNumberOfPlayers}
                />
                <LabeledInput
                  description="Avaliação do jogo no BGG"
                  placeholder="Avaliação no BGG"
                  toUppercase={false}
                  value={bggRating}
                  onChange={changeBggRating}
                />
              </div>
              <LabeledInput
                description="Proprietário"
                placeholder="Proprietário do jogo"
                toUppercase={false}
                value={owner}
                onChange={changeOwner}
              />
              {addBoardGameError &&
                <span className="text-red-400 font-bold text-center">Preencha todos os campos</span>
              }
              <div className="flex justify-center">
                <PrimaryButton
                  className="w-fit text-2xl font-bold px-8 mt-6"
                  onClick={handleAddBoardGame}
                  text="Cadastrar Jogo"
                  fullWidth={false}
                />
              </div>
            </div>
          </div>
        </div>
      : isEditing ?
        <div className="min-h-screen w-screen bg-zinc-700 pb-8">
          <Header title="Create Scape" />
          <div className="flex flex-col items-center mt-8">
            <div className="w-1/2 flex flex-col gap-4">
              <LabeledInput
                description="Jogo"
                placeholder="Nome do jogo de tabuleiro"
                toUppercase={false}
                value={boardGameName}
                onChange={changeBoardGameName}
              />
              <LabeledInput
                description="Código de Barras"
                placeholder="Código de barras do jogo"
                toUppercase={false}
                value={barCode}
                onChange={chageBarCode}
              />
              <div className="flex gap-12 items-end">
                <LabeledInput
                  description="Idade Mínima"
                  placeholder="Idade mínima para jogar"
                  toUppercase={false}
                  value={minAge}
                  onChange={changeMinAge}
                />
                <LabeledInput
                  description="Quantidade de Jogadores"
                  placeholder={"Quantidade máxima de jogadores"}
                  toUppercase={false}
                  value={quantityOfPlayers}
                  onChange={changeQuantityOfPlayers}
                />
              </div>
              <LabeledInput
                description="Local de Armazenagem"
                placeholder="Local onde o jogo é armazenado"
                toUppercase={false}
                value={storageLocation}
                onChange={changeStorageLocation}
              />
              <div className="flex gap-12 items-end">
                <LabeledInput
                  description="Editora"
                  placeholder="Editora do jogo"
                  toUppercase={false}
                  value={publisher}
                  onChange={changePublisher}
                />
                <LabeledInput
                  description="Designers do jogo"
                  placeholder="Nome dos designers do jogo"
                  toUppercase={false}
                  value={designers}
                  onChange={changeDesigners}
                />
              </div>
              
              <LabeledInput
                  description="Categoria Principal do Jogo (Ex: Card Game)"
                  placeholder="Categoria Principal"
                  toUppercase={false}
                  value={mainCategory}
                  onChange={changeMainCategory}
                />

              {mechanicsList.map((mechanic, idx) => (
                <LabeledInput
                  key={idx}
                  description={idx === 0 ? "Mecânica" : `Mecânica ${idx + 1}`}
                  placeholder="Mecânica do jogo"
                  toUppercase={false}
                  value={mechanic}
                  onChange={e => handleMechanicChange(idx, e.target.value)}
                />
              ))}
              <button
                type="button"
                className="text-zinc-50 text-left w-fit mb-2 text-xl"
                onClick={handleAddMechanic}
              >
                Adicionar outra mecânica
              </button>
              {themeList.map((theme, idx) => (
                <LabeledInput
                  key={idx}
                  description={idx === 0 ? "Tema" : `Tema ${idx + 1}`}
                  placeholder="Tema do jogo"
                  toUppercase={false}
                  value={theme}
                  onChange={e => handleThemesChanges(idx, e.target.value)}
                />
              ))}
              <button
                type="button"
                className="text-zinc-50 text-left w-fit mb-2 text-xl"
                onClick={handleAddTheme}
              >
                Adicionar outro tema
              </button>              
              <div className="flex gap-12 items-end">
                <LabeledInput
                  description="Quantidade Ideal de Jogadores"
                  placeholder="Sugestão de quantidade de jogadores"
                  toUppercase={false}
                  value={sugestedNumberOfPlayers}
                  onChange={changeSugestedNumberOfPlayers}
                />
                <LabeledInput
                  description="Avaliação do jogo no BGG"
                  placeholder="Avaliação no BGG"
                  toUppercase={false}
                  value={bggRating}
                  onChange={changeBggRating}
                />
              </div>
              <LabeledInput
                description="Proprietário"
                placeholder="Proprietário do jogo"
                toUppercase={false}
                value={owner}
                onChange={changeOwner}
              />
              {addBoardGameError &&
                <span className="text-red-400 font-bold text-center">Preencha todos os campos</span>
              }
              <div className="flex justify-center">
                <PrimaryButton
                  className="w-fit text-2xl font-bold px-8 mt-6"
                  onClick={handleUpdate}
                  text="Atualizar Jogo"
                  fullWidth={false}
                />
              </div>
            </div>
          </div>
        </div>
      : 
        <div className="h-screen w-screen bg-zinc-700 p-0 m-0">
          <Header title="Scape" />
          <div className="w-full flex flex-col px-14 mt-16">
            <Table
              title="Board Games"
              column={["Jogo", "Local de Armazenagem", "Status", "Quantidade de Jogadores Sugerida"]}
              data={boardGames?.map((boardGame) => ({
                _id : boardGame._id,
                jogo: boardGame.boardGameName,
                local: boardGame.storageLocation,
                status: boardGame.isAvailable ? "Disponível" : "Indisponível",
                bestQuantity: boardGame.bestQuantityOfPlayers
              }))}
              hasEdit={true}
              hasDelete={true}
              onDelete={handleDelete}
              onEdit={handleOnClickEdit}
              hasAddPresence={false}
              customButton={(item) => {
                if(item.status === "Disponível") {
                    return (
                    <button
                      className="w-40 flex flex-col text-2xl font-bold bg-green-500 hover:bg-green-600 text-zinc-50 rounded-full"
                      onClick={() => handleLent(item)}
                    >Emprestar</button>
                    )
                } else {
                  return (
                    <button
                      className="w-40 flex flex-col text-2xl font-bold bg-orange-500 hover:bg-orange-600 text-zinc-50 rounded-full"
                      onClick={() => handleReturnBoardGame(item)}
                    >Devolver</button>
                  )
                }
              }}
            />
          </div>
          <div className="flex w-full justify-end mt-9 px-14">
            <PrimaryButton
              className="w-fit text-2xl font-bold px-8"
              onClick={() => setIsCreating(true)}
              text="Criar Jogo de Tabuleiro"
              fullWidth={false}
            />
          </div>
        </div>
      }
      <Modal
        openerId="lentGameModal"
        modalId="lentGameModal"
        content={
            <div className="">
                <div className="w-full flex flex-col gap-4 px-8 items-center">
                    <LabeledInput
                        description="Informe o RA ou CPF de quem está pegando o jogo emprestado?"
                        placeholder="João da Silva"
                        type="text"
                        name="player"
                        value={borrow}
                        onChange={changeBorrow}
                        toUppercase={false}
                    />
                    <PrimaryButton
                        className="text-2xl font-bold px-8 my-4 w-10/12"
                        text="Emprestar Jogo"
                        toUppercase={false}
                        fullWidth={false}
                        onClick={handleConfirmLent}
                    />
                </div>
            </div>
        }
    />
    </>
  )
}