import React from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import Hamburger from "../components/Hamburger";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const Header = () => {
  return (
    <Wrapper>
      <Logo /> <Hamburger />
    </Wrapper>
  );
};

export default Header;
