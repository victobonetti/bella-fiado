import axios from 'axios';
import { useState } from 'react'
import AuthService from './AuthService';
import { Axios } from 'axios';

const LOGIN_URL = 'https://bella-fiado-api-victobonetti.vercel.app/users/login/';

interface LoginResponse {
  _id: string;
  username: string;
}

function App() {
  const [getUsername, setUsername] = useState<string>('');
  const [getPassword, setPassword] = useState<string>('');
  const [userInfo, setUserInfo] = useState([]);


  const sendLoginInfo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const authService = new AuthService({ apiUrl: LOGIN_URL })
    const username = getUsername;
    const password = getPassword;

    if (!username || !password) {
      console.error("Usuário e senha são obrigatórios");
      return;
    }

    authService.login(username, password)
      .then((data) => {
        let urlData = data as unknown as LoginResponse

        if (urlData._id && urlData.username) {
          window.location.href = `/inicio?id=${urlData._id}&username=${urlData.username}`;
        } else {
          throw new Error('Não foi possível obter nome ou _id');
        }
      

      })
      .catch((error: Error) => console.error(`Erro ao autenticar: ${error.message}`));
  }


  return (
    <div className=' h-screen flex flex-col items-center justify-center bg-neutral-800 text-neutral-800'>

      <h1 className=' select-none text-4xl mb-4 text-gray-100'>Fiado Bella Pizzaria</h1>
      <form className=' rounded p-4 bg-gradient-to-b from-orange-400 to-orange-500 w-2/3 lg:w-1/4 h-96 flex flex-col ' action="submit" onSubmit={sendLoginInfo}>
        <label className=' text-2xl' htmlFor="username">Usuário:</label>
        <input onChange={e => setUsername(e.target.value)} placeholder='Digite seu usuário' maxLength={8} className=' border border-orange-600 mb-2 rounded text-3xl px-2 pb-1' type="text" name='username' id='username' />
        <label className=' text-2xl' htmlFor="password">Senha:</label>
        <input onChange={e => setPassword(e.target.value)} placeholder='****' className=' border border-orange-600 shadow-inner rounded  text-3xl px-2 pb-1' type="password" name='password' id='password' maxLength={4} />
        <button autoFocus type='submit' className=' mt-4 py-2 px-6 text-2xl border rounded-lg w-fit self-center border-gray-100 bg-gradient-to-b from-blue-800 to-blue-900 bg-blue-800 text-gray-100 shadow hover:-translate-y-1 hover:shadow-xl transition-all '>Fazer login</button>
        <p className='text-center mt-8 cursor-pointer text-yellow-200 underline'>Painel do administador</p>
      </form>

    </div>
  )
}

export default App
