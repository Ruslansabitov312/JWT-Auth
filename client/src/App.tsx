import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { Context } from '.'
import LoginForm from './components/LoginForm'
import Spinner from './components/Spinner'
import { IUser } from './models/IUser'
import UserService from './services/UserService'

function App() {
  const { store } = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  if (store.isLoading) {
    return <Spinner />
  }

  if (!store.isAuth) {
    return <LoginForm />
  }

  return (
    <div className='App'>
      <h1>
        {store.isAuth
          ? `Пользователь авторизован ${store.user.email}`
          : `АВТОРИЗУЙТЕСЬ`}
      </h1>
      <h1>
        {store.user.isActivated
          ? `Аккаунт подтвержден по почте`
          : `ПОДТВЕРДИТЕ АККАУНТ!`}
      </h1>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick={getUsers}>Получить ползователей</button>
      </div>
      {users.map((user) => (
        <h4 key={user.email}>{user.email}</h4>
      ))}
    </div>
  )
}

export default observer(App)
