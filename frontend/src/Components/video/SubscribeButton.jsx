import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { FetchSubs, Sub, UnSub } from '../../store/SubscribtionsSlice';
import { userSelector } from '../../store/UserSlice';

const SubscribeButton = (channel) => {
  const dispatch = useDispatch();
  const {uid, username, authenticated } = useSelector(userSelector);
  const subs = useSelector(state => state.subscribtions);
  const {isSubscribed, subId, isFetching, isError, isSuccess} = subs;

  useEffect(() => {
    dispatch(FetchSubs({channelId: channel, user: uid}));
  }, [])

  const handleSubscribe = () => {
    dispatch(Sub({channelId: channel, user: uid}));
    dispatch(FetchSubs({channelId: channel, user: uid}));
  };

  const handleUnsubscribe = () => {
    dispatch(UnSub({subId: subId}));
    dispatch(FetchSubs({channelId: channel, user: uid}));
  };

  return (
    <>
    {isFetching ? (
      <Button variant="outlined ">loading...</Button>
    ) : isError ? (
      <Button variant="outlined">error</Button>
    ) : isSubscribed? (
      <Button variant="outlined" onClick={handleUnsubscribe}>
        Subscribed
      </Button>
    ) : (
      <Button variant="outlined" onClick={handleSubscribe}>
        Subscribe
      </Button>
    )}
  </>
  )
}

export default SubscribeButton
