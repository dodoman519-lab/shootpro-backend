import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LandingPage } from './pages/LandingPage'
import { ProsList } from './pages/ProsList'
import { ProProfileScreen } from './pages/ProProfileScreen'
import { AdminDashboard } from './pages/AdminDashboard'
import { AccountScreen } from './pages/AccountScreen'
import { StagiairesPage } from './pages/StagiairesPage'
import { ProHubPage } from './pages/ProHubPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ContractPage } from './pages/ContractPage'
import { AgendaPage } from './pages/AgendaPage'
import { CguPage } from './pages/CguPage'
import { Navbar } from './components/Navbar'
import './index.css'

const ProfileWrapper = () => {
    const { id } = useParams();
    return <ProProfileScreen proId={id || ''} />;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#000' }}>
                    <Navbar />
                    <div style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/explore" element={<ProsList />} />
                            <Route path="/pro/:id" element={<ProfileWrapper />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/account" element={<AccountScreen />} />
                            <Route path="/stagiaires" element={<StagiairesPage />} />
                            <Route path="/pro-hub" element={<ProHubPage />} />
                            <Route path="/gear" element={<ProHubPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/contracts" element={<ContractPage />} />
                            <Route path="/agenda" element={<AgendaPage />} />
                            <Route path="/cgu" element={<CguPage />} />
                        </Routes>
                    </div>
                    {/* Footer */}
                    <footer style={{ textAlign: 'center', padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 13, color: '#444' }}>
                        <span>© 2025 ShootPro – Trouve ton créateur</span>
                        <span style={{ margin: '0 12px', color: '#333' }}>|</span>
                        <a href="/cgu" style={{ color: '#C1784F', textDecoration: 'none' }}>Conditions Générales d'Utilisation</a>
                    </footer>
                </div>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
