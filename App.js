import Routes from './src/routes';
import { ThemeProvider } from './src/theme';

export default function App() {
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
}