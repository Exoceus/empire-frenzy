import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { Link } from "react-router-dom";

import ChatDisplay from "./chat/chatDisplay";
import ChatInput from "./chat/chatInput";

import PlayerList from "./players/player_list";

import HandViewer from "./hand/handViewer";

import PersonalPlayArea from "./play_area/personal_play_area";
import OpponentPlayArea from "./play_area/opponent_play_area";

import { request } from "http";

import CashRequestModal from "./modal/cashRequestModal";
import OpponentActionModal from "./modal/OpponentActionModal";
import SlyDealModal from "./modal/SlyDealModal";
import SettingModal from "./modal/settingModal";
import FBIRaidModal from "./modal/FBIRaidModal";

import WaitingRoom from "./waiting_room/WaitingRoom";

let socket;

const Room = ({ history, location }) => {
  const [name, setName] = useState("");
  const [playerID, setPlayerID] = useState("");
  const [room, setRoom] = useState("");
  const [ready, setReady] = useState(false);

  const [hand, setHand] = useState("");
  const [chances, setChances] = useState(0);

  const [allPlayed, setAllPlayed] = useState("");
  const [personalPlayed, setPersonalPlayed] = useState("");
  const [opponentPlayed, setOpponentPlayed] = useState("");

  const [players, setPlayers] = useState("");

  const [turnStatus, setTurnStatus] = useState(false);

  const [cashRequest, setCashRequest] = useState(null);
  const [checkCashRequest, setCheckCashRequest] = useState(null);
  const [cashSelect, setCashSelect] = useState([]);
  const [propertiesCashSelect, setPropertiesCashSelect] = useState([]);

  const [chatMessage, setChatMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState("");

  const [gameStatus, setGameStatus] = useState("waiting");

  const [actionPrompt, setActionPrompt] = useState(null);
  const [cardSelect, setCardSelect] = useState({});

  const [playedCardIndex, setPlayedCardIndex] = useState(null);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [opponentAction, setOpponentAction] = useState("");

  const [propertySetSelect, setPropertySetSelect] = useState(null);

  const [actionUpdate, setActionUpdate] = useState("");

  const [completedSets, setCompletedSets] = useState([]);
  const [winner, setWinner] = useState(null);

  const [turnStatusMessage, SetTurnStatusMessage] = useState(null);

  const [settings, setSettings] = useState(false);
  const [opponentViewSize, setOpponentViewSize] = useState(32);

  const ENDPOINT = "http://localhost:5000";
  // const ENDPOINT = 'https://empire-frenzy.herokuapp.com/'

  //initialization
  useEffect(() => {
    //connect when component is mounted
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT + `?gameID=${room}&action=join&playerName=${name}&`);

    setName(name);
    setRoom(room);

    //join using name and room
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    //disconnect when component is dismounted
    return () => {
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  //receiving player list
  useEffect(() => {
    socket.on("prevent_game_join", () => {
      if (socket) {
        socket.disconnect();
        history.push("/");
      }
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving player list
  useEffect(() => {
    socket.on("player_id", (response) => {
      setPlayerID(response);
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving messages
  useEffect(() => {
    socket.on("chat_message", (message) => {
      setMessageHistory((prevState) => [...prevState, message]);
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving player list
  useEffect(() => {
    socket.on("player_list", (response) => {
      setPlayers(response.players);
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving game instructions
  useEffect(() => {
    socket.on("game_instruction", (instruction) => {
      if (instruction.subject === "game_status") {
        setGameStatus(instruction.action);
      }
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving hand
  useEffect(() => {
    socket.on("hand", (message) => {
      setHand(message.cards);
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving turn status
  useEffect(() => {
    socket.on("turn_status", (status) => {
      if (status === "start_turn") {
        setTurnStatus(true);
        setChances(3);
        setTimerSeconds(60);
        setTimerActive(true);
      } else if (status === "end_turn") {
        setTurnStatus(false);
        setTimerSeconds(0);
        setTimerActive(false);

        setActionPrompt(null);
      }
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving all played
  useEffect(() => {
    socket.on("played", (all_played) => {
      setAllPlayed(all_played);
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving all played
  useEffect(() => {
    socket.on("turn_message", (turn) => {
      SetTurnStatusMessage(turn);
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving cash request
  useEffect(() => {
    socket.on("cash_request", (data) => {
      setCheckCashRequest(data);
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving opponent action
  useEffect(() => {
    socket.on("opponent_action", (data) => {
      setOpponentAction(data);
    });
    return () => {
      socket.off();
    };
  }, []);

  //receiving winner found
  useEffect(() => {
    socket.on("winner_found", (data) => {
      setWinner(data);
    });
    return () => {
      socket.off();
    };
  }, []);

  //checking cash request
  useEffect(() => {
    if (checkCashRequest) {
      if (checkCashRequest.from.playerID !== playerID) {
        setCashRequest(checkCashRequest);
        setCheckCashRequest(null);
      }
    }
  }, [checkCashRequest]);

  //sorting all played
  useEffect(() => {
    if (allPlayed.length > 1) {
      const personal_played = allPlayed.filter((player) => {
        return player.playerID === playerID;
      });

      const opponent_played = allPlayed.filter((player) => {
        return player.playerID !== playerID;
      });

      setPersonalPlayed(personal_played);
      setOpponentPlayed(opponent_played);
    }
  }, [allPlayed]);

  //check amount of chances
  useEffect(() => {
    if (chances === 0 && turnStatus) {
      endTurn();
    }
  }, [chances]);

  //set timer
  useEffect(() => {
    let interval = null;

    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (!timerActive && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  //card is selected for sly deal
  useEffect(() => {
    if (actionPrompt === "sly_deal" && cardSelect) {
      socket.emit("place_card", playedCardIndex, cardSelect);
      setPlayedCardIndex(null);
      setCardSelect(null);
      setActionPrompt(null);
      setChances(chances - 1);
    }
  }, [cardSelect]);

  //card is selected for sly deal
  useEffect(() => {
    if (actionPrompt === "fbi_raid" && propertySetSelect) {
      socket.emit("place_card", playedCardIndex, propertySetSelect);
      setPlayedCardIndex(null);
      setActionPrompt(null);
      setPropertySetSelect(null);
      setChances(chances - 1);
    }
  }, [propertySetSelect]);

  //set timer
  useEffect(() => {
    if (completedSets.length >= 3) {
      socket.emit("winner", completedSets);
    }
  }, [completedSets]);

  //check amount of chances
  useEffect(() => {
    if (winner) {
      setTimeout(() => {
        socket.disconnect();
        history.push("/");
      }, 5000);
    }
  }, [winner]);

  //sending messages
  const sendChatMessage = (event) => {
    event.preventDefault();

    if (chatMessage) {
      socket.emit("send_chat_message", chatMessage, () => setChatMessage(""));
    }
  };

  //send ready status
  const sendReadyStatus = (event) => {
    event.preventDefault();

    if (ready) {
      socket.emit("player_ready", false, (player) => setReady(player.ready));
    } else {
      socket.emit("player_ready", true, (player) => setReady(player.ready));
    }
  };

  //send cash
  const sendCashPayment = (event) => {
    event.preventDefault();

    if (cashSelect) {
      socket.emit(
        "cash_payment",
        cashRequest.from.playerID,
        { cash: cashSelect, properties: propertiesCashSelect },
        () => {
          setCashRequest(null);
          setCashSelect([]);
          setPropertiesCashSelect([]);
          setCheckCashRequest(null);
        }
      );
    }
  };

  //emit end turn
  const endTurn = (event) => {
    if (event) {
      event.preventDefault();
    }

    socket.emit("end_turn");
  };

  // when playing an action card
  const playCard = (index, as_cash) => {
    if (turnStatus && gameStatus === "ongoing") {
      if (hand[index].action === 4 && !as_cash) {
        setActionPrompt("sly_deal");
        setPlayedCardIndex(index);
      } else if (hand[index].action === 6 && !as_cash) {
        setActionPrompt("fbi_raid");
        setPlayedCardIndex(index);
      } else {
        socket.emit("place_card", { index, as_cash });

        if (hand[index].type === "action") {
          setChances(chances - 1);
        }
      }
    }
  };

  const leaveGame = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  //responding to opponent action (allow or nein) in terms of cash and action
  const sendOpponentActionResponse = (e, actionResponse) => {
    console.log("");

    if (opponentAction) {
      socket.emit(
        "opponent_action_response",
        opponentAction,
        actionResponse,
        () => {
          setOpponentAction(null);
        }
      );
    } else if (cashRequest) {
      socket.emit(
        "opponent_action_response",
        cashRequest,
        actionResponse,
        () => {
          setCashRequest(null);
        }
      );
    }
  };

  if (messageHistory.length > 0) {
    var chatDisplay = (
      <ChatDisplay messages={messageHistory} user_name={name} />
    );
  }

  if (players.length > 0) {
    var playerList = <PlayerList players={players} />;
  }

  if (personalPlayed.length === 1) {
    var personal_played = (
      <PersonalPlayArea
        cards={personalPlayed[0].played}
        setCompletedSets={setCompletedSets}
        completedSets={completedSets}
        colorID={personalPlayed[0].colorID}
      />
    );
  }

  if (opponentPlayed.length > 0) {
    var opp_played = <OpponentPlayArea opponent_played={opponentPlayed} />;
  }

  if (hand.length > 0) {
    var handList = (
      <HandViewer hand={hand} turnStatus={turnStatus} playCard={playCard} />
    );
  }

  if (gameStatus === "ongoing") {
    if (turnStatusMessage) {
      var turnMessage = (
        <div>
          {turnStatusMessage.playerID === playerID
            ? `It is your turn. You have ${chances} left.`
            : `It is ${turnStatusMessage.playerName}'s turn.`}
        </div>
      );
    }
  }

  //modal for sly deal card selection
  if (actionPrompt === "sly_deal") {
    var actionModal = (
      <SlyDealModal
        opponentPlayed={opponentPlayed}
        setActionPrompt={setActionPrompt}
        setCardSelect={setCardSelect}
      />
    );
  } else if (actionPrompt === "fbi_raid") {
    var actionModal = (
      <FBIRaidModal
        opponentPlayed={opponentPlayed}
        setActionPrompt={setActionPrompt}
        setPropertySetSelect={setPropertySetSelect}
      />
    );
  }

  //modal for opponentAction (i.e playing Nein card or allowing action)
  if (opponentAction) {
    var actionModal = (
      <OpponentActionModal
        opponentAction={opponentAction}
        sendOpponentActionResponse={sendOpponentActionResponse}
        hand={hand}
        properties={personalPlayed[0].played.properties}
      />
    );
  }

  //modal for paying cash request
  if (cashRequest) {
    var actionModal = (
      <CashRequestModal
        cashSelect={cashSelect}
        setCashSelect={setCashSelect}
        propertiesCashSelect={propertiesCashSelect}
        setPropertiesCashSelect={setPropertiesCashSelect}
        sendOpponentActionResponse={sendOpponentActionResponse}
        sendCashPayment={sendCashPayment}
        cashRequest={cashRequest}
        personalPlayed={personalPlayed}
        hand={hand}
      />
    );
  }

  if (settings) {
    var actionModal = (
      <SettingModal
        opponentViewSize={opponentViewSize}
        setOpponentViewSize={setOpponentViewSize}
        settings={settings}
        setSettings={setSettings}
      />
    );
  }

  console.log(personalPlayed);

  //waiting room component
  if (gameStatus === "waiting") {
    return (
      <WaitingRoom
        chatDisplay={chatDisplay}
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        sendChatMessage={sendChatMessage}
        leaveGame={leaveGame}
        sendReadyStatus={sendReadyStatus}
        gameStatus={gameStatus}
        playerList={playerList}
        room={room}
        name={name}
        ready={ready}
      />
    );
  } else if (winner) {
    return (
      <div className="winner-screen-wrapper">
        <div>
          <div className="winner-screen-subtitle">Game Over</div>
          <div className="winner-screen-title">
            {winner.playerID === playerID
              ? "You have won!"
              : winner.playerName + " has won!"}
          </div>
        </div>
        <Link
          to="/"
          className="winner-screen-button-wrapper"
          onClick={leaveGame}
        >
          <i className="fas fa-sign-out-alt"></i> Go Back Home
        </Link>
      </div>
    );
  }

  //game component
  else {
    return (
      <div className="game-screen-wrapper">
        <div
          className="game-area-wrapper"
          style={{
            gridTemplateRows: turnStatus ? "57% 12% 31%" : "67% 12% 21%",
          }}
        >
          <div
            className="opponent-view game-area-container"
            style={{
              gridTemplateColumns: `repeat(${players.length}, ${opponentViewSize}%)`,
            }}
          >
            {personal_played}
            {opp_played}
          </div>
          <div className="game-overview-container game-area-container">
            <div>
              {gameStatus === "ongoing" && turnStatus ? (
                <button
                  className="end-turn-button"
                  onClick={(e) => endTurn(e)}
                  title="You can end your turn early"
                >
                  End turn
                </button>
              ) : null}
            </div>

            <div>{turnMessage}</div>

            <div className="timer-wrapper">
              {turnStatus ? (
                <div className="timer-text">
                  <i
                    className="fas fa-stopwatch"
                    style={{ color: "var(--accent)", marginRight: 8 }}
                  ></i>
                  {timerSeconds}
                </div>
              ) : null}

              <button
                className="settings-button"
                onClick={(e) => {
                  e.preventDefault();
                  setSettings(!settings);
                }}
              >
                <i class="fas fa-cog"></i>
              </button>
            </div>
          </div>
          <div className="personal-view game-area-container">{handList}</div>
        </div>

        <div className="chat-view-wrapper">
          {chatDisplay}
          <ChatInput
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            sendChatMessage={sendChatMessage}
          />
        </div>
        {actionModal}
      </div>
    );
  }
};

export default Room;
