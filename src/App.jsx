import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { DashboardPage } from './pages/Dashboard';
import { DemandasPage } from './pages/Demandas';
import { UnidadesPage } from './pages/Unidades';
import { PCAPage } from './pages/PCA';
import { RelatoriosPage } from './pages/Relatorios';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/demandas" element={<DemandasPage />} />
            <Route path="/unidades" element={<UnidadesPage />} />
            <Route path="/pca" element={<PCAPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
