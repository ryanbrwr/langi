import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FaBars, FaQuestion, FaSignOutAlt, FaHome, FaUser, FaCalendarAlt, FaChalkboardTeacher,
} from 'react-icons/fa';
import { Popover, Divider, Menu } from 'antd';
import Logo from '../../Img/logo.svg';
import User from '../../Containers/userContainer';
import ExchangeState from '../../Containers/exchangeContainer';

import { signOut } from '../../Helpers/user';

const NavContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    z-index: 4;
    border-bottom: 1px solid #efefef;
    height: 55px;
    position: fixed;
    width: 100%;
`;

const NavWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    padding-left: 18px;
    padding-right: 18px;
`;

const NavContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.p`
    font-size: 2em;
    font-weight: 700;
    margin-right: 20px;
    margin-top: 0px;
    margin-bottom: 0px;
`;

const Avatar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    background-color: #a8a8a8;
    border: 0.5px solid #fff;
    border-radius: 100px;

    :hover {
        border: 0.5px solid #6e6e6e;
        cursor: pointer;
    }
`;

const AvatarImg = styled.img`
    filter: grayscale(100%);
`;

const MenuIcon = styled(FaBars)`
    height: 24px;
    width: 24px;
    color: #454545;
    margin-right: 10px;
    :hover {
        cursor: pointer;
    }
    @media screen and (min-width: 960px) {
        display: none;
    }

`;

const ProfilePopoverContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 12px 0px;
`;

const Username = styled.p`
    font-size: 0.9em;
    margin-bottom: 0px;
    margin: 0px 12px;
    color: #454545;
    opacity: 0.6;
`;

const MenuItem = styled(Menu.Item)`
    display: flex;
    align-items: center;
    color: #454545;
    :hover {
        background: #efefef;
    }
`;

const Header = () => {
  const user = User.useContainer();
  const exchangeState = ExchangeState.useContainer();
  const [ppOpen, setPPOpen] = useState(false);
  const [epOpen, setEPOpen] = useState(false);

  const profilePopover = (
    <ProfilePopoverContainer style={{ minWidth: 200 }}>
      <Username>
        signed in as
        <span style={{ color: '#000' }}>
          @
          {user.user.username}
        </span>
      </Username>
      <Divider style={{ margin: '12px 0px' }} />
      <Menu style={{ width: '100%' }}>
        <MenuItem icon={<FaQuestion />} key="help">Help</MenuItem>
        <MenuItem
          key="sign-out"
          icon={<FaSignOutAlt />}
          onClick={() => {
            signOut(user);
          }}
        >
          Sign out
        </MenuItem>
      </Menu>

    </ProfilePopoverContainer>
  );

  const navigationPopover = (
    <ProfilePopoverContainer style={{ minWidth: 200 }}>
      <Menu style={{ width: '100%' }}>
        <MenuItem
          icon={<FaHome />}
          onClick={() => {
            exchangeState.setPage('home');
            setEPOpen(false);
          }}
        >
          Home
        </MenuItem>
        <MenuItem
          icon={<FaUser />}
          onClick={() => {
            exchangeState.setPage('profile');
            setEPOpen(false);
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          icon={<FaCalendarAlt />}
          onClick={() => {
            exchangeState.setPage('schedule');
            setEPOpen(false);
          }}
        >
          Schedule
        </MenuItem>
        <MenuItem
          icon={<FaChalkboardTeacher />}
          onClick={() => {
            exchangeState.setPage('find');
            setEPOpen(false);
          }}
        >
          Find
        </MenuItem>
      </Menu>
    </ProfilePopoverContainer>
  );

  return (
    <NavContainer>
      <NavWrapper>
        <NavContent>
          <Popover content={navigationPopover} placement="bottomRight" trigger="click" visible={epOpen} onVisibleChange={setEPOpen}>
            <MenuIcon />
          </Popover>
          <img src={Logo} style={{ height: 36, width: 36 }} alt="logo" />
          <Title>dialect</Title>
        </NavContent>
        <NavContent>
          <Popover content={profilePopover} placement="bottomLeft" trigger="click" visible={ppOpen} onVisibleChange={setPPOpen}>
            <Avatar>
              <AvatarImg src={Logo} style={{ height: 22, width: 22 }} />
            </Avatar>
          </Popover>
        </NavContent>
      </NavWrapper>
    </NavContainer>
  );
};

export default Header;
