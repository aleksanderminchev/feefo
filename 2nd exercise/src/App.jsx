import styled, { ThemeProvider } from 'styled-components';
import ProductRating from './components/ProductRating/ProductRating';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

const RATINGS = [
  { stars: 5, count: 952 },
  { stars: 4, count: 171 },
  { stars: 3, count: 55 },
  { stars: 2, count: 14 },
  { stars: 1, count: 40 },
];

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: clamp(1rem, 5vw, 3rem);
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Main>
        <ProductRating ratings={RATINGS} />
      </Main>
    </ThemeProvider>
  );
}

export default App;
