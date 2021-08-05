import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Rate, Button } from 'antd'
import { useTimer } from 'react-timer-hook'
import { leaveRoom } from '@utils/apis/RoomAPI'
import UserContainer from '@utils/state/userContainer'
import { FaArrowLeft } from 'react-icons/fa'
import Coin from '@img/token.svg'
import { useHistory } from 'react-router-dom'
import fire from '@utils/fire'
import firebase from 'firebase'

const Container = styled.div`
    height: 48px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background: var(--dark-background);
    border: 1px solid #d4d4d4;
`

const Time = styled.p`
    font-size: 1.1em;
    font-weight: 600;
    color: #1c1c1c;
    letter-spacing: 0.1em;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 30px;
`
const format = (digit) => {
  if (digit.toString().length === 1) {
    return `0${digit}`
  }
  return `${digit}`
}

const TimerModal = styled(Modal)`
  width: 300px !important;
`

const Timer = ({ room, otherParticipant }) => {
  const { user } = UserContainer.useContainer()
  const history = useHistory()
  const [visible, setVisible] = useState(false)
  const [stars, setStars] = useState(5)
  const [loading, setLoading] = useState(false)
  const time = new Date()
  time.setSeconds(time.getSeconds() + 5)
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      setVisible(true)
      // leaveRoom(user, room)
    }
  })

  const rateUser = async (rating) => {
    setLoading(true)
    fire.firestore().collection('audio-rooms').doc(room.name).get()
      .then((document) => {
        const uid = document.data().participants.filter((e) => e !== user.uid)[0]
        fire.firestore().collection('users').doc(uid).get()
          .then((userDocument) => {
            const rooms = userDocument.data().rooms ? userDocument.data().rooms : 0
            const currentRating = userDocument.data().rating ? userDocument.data().rating : 0
            const newRating = (currentRating * rooms + rating) / (rooms + 1)
            fire.firestore().collection('users').doc(uid).update({
              karma: firebase.firestore.FieldValue.increment(1),
              rooms: firebase.firestore.FieldValue.increment(1),
              rating: newRating
            })
              .catch(() => {
                setLoading(false)
              })
          })
          .catch(() => {
            setLoading(false)
          })
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <Container>
      <Time>{`${format(minutes)}:${format(seconds)}`}</Time>
      <TimerModal
        visible={visible}
        footer={null}
        onCancel={null}
        title="How was the conversation?"
        closable={false}
      >
        <Rate
          value={stars}
          onChange={(value) => setStars(value)}
          allowClear={false}
        />
        <ButtonContainer>
          <Button
            block
            style={{ marginRight: 5 }}
            icon={(
              <FaArrowLeft
                style={{ marginRight: 5 }}
              />
            )}
            loading={loading}
            onClick={async () => {
              await rateUser(stars)
              leaveRoom(user, room)
              setVisible(false)
              history.push('/exchange')
            }}
          >
            Return
          </Button>
          <Button
            type="primary"
            block
            style={{ marginLeft: 5 }}
            icon={<img src={Coin} alt="token" style={{ height: 16, marginRight: 5 }} />}
            onClick={async () => {
              await rateUser(stars)
              leaveRoom(user, room)
              setVisible(false)
            }}
            loading={loading}
          >
            Continue
          </Button>
        </ButtonContainer>
      </TimerModal>
    </Container>
  )
}

export default Timer