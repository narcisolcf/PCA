import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import Spinner from './components/ui/Spinner';

// Lazy loading das páginas para otimizar o bundle inicial
const DashboardPage = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.DashboardPage })));
const DemandasPage = lazy(() => import('./pages/Demandas').then(m => ({ default: m.DemandasPage })));
const UnidadesPage = lazy(() => import('./pages/Unidades').then(m => ({ default: m.UnidadesPage })));
const PCAPage = lazy(() => import('./pages/PCA').then(m => ({ default: m.PCAPage })));
const RelatoriosPage = lazy(() => import('./pages/Relatorios').then(m => ({ default: m.RelatoriosPage })));

// Componente de fallback para o Suspense
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/demandas" element={<DemandasPage />} />
              <Route path="/unidades" element={<UnidadesPage />} />
              <Route path="/pca" element={<PCAPage />} />
              <Route path="/relatorios" element={<RelatoriosPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
