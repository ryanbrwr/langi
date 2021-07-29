import React, { useState, useEffect } from 'react'
import fire from '@utils/fire'
import User from '@utils/state/userContainer'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from '@components/Landing/Home'
import Loading from '@components/common/Loading'
import Room from '@components/Exchange/Rooms/Room'
import Exchange from '@components/Exchange/Exchange'
import Profile from '@components/Exchange/Profile'
import Error from '@components/common/Error'
import svg404 from '@img/404.svg'

import ExchangeState from '@utils/state/exchangeContainer'

const App = () => {
  const [initializing, setInitializing] = useState(true)
  const user = User.useContainer()

  const authListener = () => {
    setTimeout(() => {
      fire.auth().onAuthStateChanged(async (newUser) => {
        if (!newUser) {
          user.setUser(null)
          window.$crisp.push(['set', 'user:email', [null]])
          window.$crisp.push(['set', 'user:nickname', [null]])
          setInitializing(false)
        } else {
          const document = await fire.firestore().collection('users').doc(newUser.uid).get()
          if (!document) {
            user.setUser(null)
            window.$crisp.push(['set', 'user:email', [null]])
            window.$crisp.push(['set', 'user:nickname', [null]])
            setInitializing(false)
            return
          }
          user.setUser(document.data())
          window.$crisp.push(['set', 'user:email', [document.data().email]])
          window.$crisp.push(['set', 'user:nickname', [document.data().name]])
          setInitializing(false)
        }
      })
    }, 500)
  }

  useEffect(() => {
    window.$crisp = []
    window.CRISP_WEBSITE_ID = '47d59959-1645-4829-a5c8-f8ca00b9d8d9';

    (function () {
      const d = document
      const s = d.createElement('script')

      s.src = 'https://client.crisp.chat/l.js'
      s.async = 1
      d.getElementsByTagName('head')[0].appendChild(s)
    }())

    authListener()
  }, [])

  // useEffect(() => {
  //   if (!fire.auth().currentUser) return false
  //   const subscriber = fire.firestore()
  //     .collection('users')
  //     .doc(fire.auth().currentUser.uid)
  //     .onSnapshot((document) => {
  //       user.setUser(document.data())
  //     })
  //   return () => subscriber()
  // }, [])

  if (initializing) {
    return <Loading />
  }
  return (
    <ExchangeState.Provider>
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
          >
            <Home />
          </Route>
          <Route
            path="/exchange"
            exact
          >
            <Exchange />
          </Route>
          <Route
            path="/join"
          >
            <Room />
          </Route>
          <Route
            path="/profile"
          >
            <Profile />
          </Route>
          <Route
            path="*"
          >
            <Error errorMessage="Oops, that page doesn't exist" imgLink={svg404} />
          </Route>
        </Switch>
      </BrowserRouter>
    </ExchangeState.Provider>
  )
}

export default App
