import React, { useState } from 'react'
import { useNavigate, NavigateFunction } from 'react-router-dom'
import Logo from '../components/Logo';

const MainScreen: React.FC = () => {

  const navigate: NavigateFunction = useNavigate();
  const [roomCode, setRoomCode] = useState<string>("")

  const handleCreate: React.MouseEventHandler<HTMLButtonElement> = () => {
    const newRoomName: string = random();
    navigate({
        pathname: '/room',
        search: `?host=${newRoomName}`
    });
  }

  const handleJoin: React.MouseEventHandler<HTMLButtonElement> = () => {
    roomCode && navigate({
      pathname: '/room',
      search: `?${roomCode}`,
    });
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
     setRoomCode(e.target.value);
  }

  return (
    <div className="mainContainer">
        <section className="joinRoomBox">
          <Logo theme="lobby" width={100} height={100}/>
          <h2>Join a game</h2>
          <div className="mainInline">
              <input type="text" placeholder="Enter room code" onChange={handleChange}></input>
              <button onClick={handleJoin}> &gt; </button><br/>
          </div>
        </section>
        <section className="newRoomBox">
            <h2>Create new room</h2>
            <button onClick={handleCreate}>Create new room</button>
            <footer>
                <p>jaksza</p>
            </footer>
        </section>
    </div>
  )
}

const random: Function = () => {
    return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
};

export default MainScreen