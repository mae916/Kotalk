import styled from 'styled-components';
import banner from '../assets/banner/banner_1.png';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: 1px solid #dfdfdf;
  & img {
    height: 84.38px;
  }
`;

function Banner() {
  return (
    <Container>
      <img src={banner} alt="" />
    </Container>
  );
}
export default Banner;
