import { useEffect, useState } from 'react';
import { useLocation, useNavigate, NavigateFunction } from 'react-router-dom';
import Logo from '../components/Logo';
import Box from '../components/Box';
import RoomCodeBox from '../components/RoomCodeBox';

import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_WS_SERVER || 'http://localhost:5000');

const GameScreen: React.FC = () => {
    const [game, setGame] = useState<any[]>(Array(9).fill(''));
    const [turnNumber, setTurnNumber] = useState<number>(0);
    const [myTurn, setMyTurn] = useState<boolean>(true);
    const [winner, setWinner] = useState<boolean>(false);
    const [xo, setXO] = useState<string>('X');
    const [player, setPlayer] = useState<string>('');
    const [hasOpponent, setHasOpponent] = useState<boolean>(false);
    const [winningCombination, setWinningCombination] = useState<number[]>([]);
    const [room, setRoom] = useState<string>("");
    const [turnData, setTurnData] = useState<boolean>(false);

    const location = useLocation();
    const paramsRoom: string = location.search.substring(1);
    const navigate: NavigateFunction = useNavigate();
  
    const sendTurn = (index: number) => {
      if (!game[index] && !winner && myTurn && hasOpponent) {
        socket.emit('reqTurn', JSON.stringify({ index, value: xo, room }));
      }
    };
  
    const sendRestart = () => {
      socket.emit('reqRestart', JSON.stringify({ room }));
    };
  
    const restart = () => {
      setGame(Array(9).fill(''));
      setWinner(false);
      setTurnNumber(0);
      setWinningCombination([]);
    };
  
    useEffect(() => {
      combinations.forEach((c: number[]) => {
        if (game[c[0]] === game[c[1]] && game[c[0]] === game[c[2]] && game[c[0]] !== '') {
          setWinningCombination(c);
          setWinner(true);
        }
      });
  
      if (turnNumber === 0) {
        setMyTurn(myTurn ? true : false);
      }
    }, [game, turnNumber, xo]);
  
    useEffect(() => {
      socket.on('playerTurn', (json) => {
        setTurnData(json);
      });
  
      socket.on('restart', () => {
        restart();
      });
  
      socket.on('opponent_joined', () => {
        setHasOpponent(true);
      });

      socket.on('error_room_is_full', () => {
        console.log("ROOM IS FULL");
        navigate("/");
      });

      socket.on('error_invalid_room_code', () => {
        console.log("INVALID ROOM CODE");
        navigate("/");
      });

     socket.on("gameStatus", function() {
      if (paramsRoom.length > 8){
         socket.emit('update', paramsRoom.substring(5));
      } else {
         socket.emit('update', paramsRoom);
      }
    });

     socket.on('pause', function(){
        setXO('X');
        setMyTurn(true);
        setHasOpponent(false);
        setGame(Array(9).fill(''));
        setWinner(false);
        setTurnNumber(0);
        setWinningCombination([]);
   });
    }, []);
  
    useEffect(() => {
      if (turnData) {
        const data: any = JSON.parse(turnData.toString());
        let g: any[] = [...game];
        if (!g[data.index] && !winner) {
          g[data.index] = data.value;
          setGame(g);
          setTurnNumber(turnNumber + 1);
          setTurnData(false);
          setMyTurn(!myTurn);
          setPlayer(data.value);
        }
      }
    }, [turnData, game, turnNumber, winner, myTurn]);
  
    useEffect(() => {
      const roomName: string = paramsRoom.substring(5);
      if (roomName.length === 8) {
        // means you are player 1
        socket.emit('create', roomName);
        setRoom(roomName);
        setMyTurn(true);
      }
      else {
        // means you are player 2
        setXO('O');
        socket.emit('join', paramsRoom);
        setRoom(paramsRoom);
        setMyTurn(false);
      } 
    }, [paramsRoom]);
  
    return (
      <div className="gameContainer">
        <section className="gameHeader">
            <RoomCodeBox room={room} link={paramsRoom.length > 8 ? paramsRoom.substring(5) : paramsRoom} isLeft={true} isFull={hasOpponent}/>
            <Logo theme="game" width={100} height={100}/>
            <RoomCodeBox room={room} link={paramsRoom.length > 8 ? paramsRoom.substring(5) : paramsRoom} isLeft={false} isFull={hasOpponent}/>
        </section>
        <section className="gameInfo">
            {hasOpponent ? ((winner || turnNumber === 9) ? (winner ? (player === xo ? <h2 className="standardSize">You've won!</h2> : <h2 className="standardSize">You've lost!</h2>) : (turnNumber === 9 ? <h2 className="standardSize">You've tied!</h2> : null)) : (myTurn ? <h2 className="smallerSize">It's your turn</h2> : <h2 className="smallerSize">It's the opponent's turn</h2>)) : <h2 className="standardSize">Waiting for opponent...</h2>}
        </section>
        <section className={!hasOpponent || winner || turnNumber === 9 ? "boardA" : (myTurn ? "boardB" : "boardC")}>
        <div className="row">
          <Box index={0} turn={sendTurn} value={game[0]} wc={winningCombination} player={xo}/>
          <Box index={1} turn={sendTurn} value={game[1]} wc={winningCombination} player={xo}/>
          <Box index={2} turn={sendTurn} value={game[2]} wc={winningCombination} player={xo}/>
        </div>
        <div className="row">
          <Box index={3} turn={sendTurn} value={game[3]} wc={winningCombination} player={xo}/>
          <Box index={4} turn={sendTurn} value={game[4]} wc={winningCombination} player={xo}/>
          <Box index={5} turn={sendTurn} value={game[5]} wc={winningCombination} player={xo}/>
        </div>
        <div className="row">
          <Box index={6} turn={sendTurn} value={game[6]} wc={winningCombination} player={xo}/>
          <Box index={7} turn={sendTurn} value={game[7]} wc={winningCombination} player={xo}/>
          <Box index={8} turn={sendTurn} value={game[8]} wc={winningCombination} player={xo}/>
        </div>
        </section>
        {winner || turnNumber === 9 ? (
          <>
            <button className="restartBtn" onClick={sendRestart}>Play again</button>
          </>
         ) : null}
        <footer>
            <p>jaksza</p>
        </footer>
      </div>
    );
}

const combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default GameScreen