<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  /* Ultra Modern Button System */
  .btn {
    @apply inline-flex items-center justify-center px-8 py-4 text-sm font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl;
  }

  .btn-primary {
    @apply bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 focus:ring-cyan-500/50;
  }

  .btn-secondary {
    @apply bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200/50 shadow-xl hover:bg-white hover:border-gray-300 focus:ring-gray-500/50 hover:scale-105;
  }

  .btn-danger {
    @apply bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 focus:ring-red-500/50;
  }

  .btn-success {
    @apply bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 focus:ring-green-500/50;
  }

  /* Modern Form System */
  .form-group {
    @apply space-y-1;
  }

  .form-label {
    @apply block text-sm font-semibold text-gray-700 mb-2;
  }

  .form-input {
    @apply block w-full px-4 py-3 text-sm border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400;
  }

  .form-input.error {
    @apply border-red-500 focus:ring-red-500;
  }

  .form-error {
    @apply text-red-600 text-xs font-medium mt-1 flex items-center;
  }

  .form-success {
    @apply text-green-600 text-xs font-medium mt-1 flex items-center;
  }

  /* Modern Modal System */
  .modal-overlay {
    @apply fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4;
  }

  .modal-content {
    @apply bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 mx-4 sm:mx-0;
  }

  .modal-header {
    @apply px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white;
  }

  .modal-body {
    @apply px-6 py-6 max-h-96 overflow-y-auto;
  }

  .modal-footer {
    @apply px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3;
  }

  /* Ultra Modern Sidebar */
  .sidebar-ultra {
    @apply w-80 text-white shadow-2xl z-40 relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  }
  
  /* Sidebar mobile - fixed positioning */
  @media (max-width: 1023px) {
    .sidebar-ultra {
      @apply fixed left-0 top-0 h-full;
    }
  }
  
  /* Sidebar desktop - static positioning dentro do container */
  @media (min-width: 1024px) {
    .sidebar-ultra {
      @apply relative;
    }
  }

  /* Ultra Modern Sidebar Brand */
  .sidebar-brand-ultra {
    @apply px-8 py-8 border-b border-slate-700/50;
  }

  /* Ultra Modern Sidebar Navigation */
  .sidebar-nav-ultra {
    @apply px-6 py-8 space-y-2;
  }

  /* Ultra Modern Nav Items */
  .nav-item-ultra {
    @apply flex items-center px-4 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 hover:bg-white/10 hover:shadow-xl relative;
  }

  .nav-item-ultra:hover {
    transform: translateX(4px);
  }

  .nav-item-active {
    @apply bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-2xl border border-cyan-500/30;
    transform: translateX(4px);
  }

  .nav-item-active .nav-icon-container {
    @apply bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg;
  }

  .nav-item-active .nav-indicator {
    @apply bg-gradient-to-r from-cyan-400 to-blue-400;
  }

  .nav-icon-container {
    @apply w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300;
  }

  .nav-item-ultra:hover .nav-icon-container {
    transform: scale(1.1);
  }

  .nav-icon-ultra {
    @apply w-5 h-5;
  }

  .nav-text {
    @apply flex-1 font-semibold;
  }

  .nav-indicator {
    @apply w-2 h-2 rounded-full bg-gray-500 transition-all duration-300;
  }

  /* Ultra Modern Main Content */
  .main-content-ultra {
    @apply min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex-1 relative w-full;
    background-image: 
      radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
  }
  
  /* Main content mobile - full width */
  @media (max-width: 1023px) {
    .main-content-ultra {
      @apply w-full;
    }
  }

  /* Ultra Modern Content Header */
  .content-header-ultra {
    @apply bg-white/80 backdrop-blur-sm shadow-2xl border-b border-gray-200/50 px-8 py-8 relative;
  }

  .content-header-ultra::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(120, 119, 198, 0.5), transparent);
  }

  /* Ultra Modern Content Body */
  .content-body-ultra {
    @apply p-8 relative;
  }

  /* Ultra Modern Cards */
  .card {
    @apply bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden relative;
    background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%);
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(120, 119, 198, 0.3), transparent);
  }

  .card-header {
    @apply px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm;
  }

  .card-body {
    @apply p-8;
  }

  /* Ultra Modern Table */
  .table {
    @apply min-w-full divide-y divide-gray-200/50 rounded-2xl overflow-hidden shadow-xl;
  }

  .table-header {
    @apply bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50;
  }

  .table-header th {
    @apply px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider;
  }

  .table-body {
    @apply bg-white/90 backdrop-blur-sm divide-y divide-gray-200/50;
  }

  .table-row {
    @apply hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 transition-all duration-300 hover:shadow-lg;
  }

  .table-cell {
    @apply px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900;
  }

  /* Ultra Modern Status Badges */
  .badge {
    @apply inline-flex items-center px-4 py-2 rounded-2xl text-xs font-bold shadow-lg;
  }

  .badge-success {
    @apply bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25;
  }

  .badge-danger {
    @apply bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25;
  }

  .badge-warning {
    @apply bg-yellow-100 text-yellow-800;
  }

  .badge-info {
    @apply bg-blue-100 text-blue-800;
  }

  /* Loading States */
  .loading-spinner {
    @apply animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600;
  }

  /* Animations */
  .fade-in {
    @apply animate-fade-in;
  }

  .slide-up {
    @apply animate-slide-up;
  }

  /* Loading Global - Centralização perfeita */
  .global-loading {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 9999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 100vh !important;
    min-height: 100dvh !important;
    padding: 1rem !important;
  }

  /* Garantir que o loading apareça acima de tudo */
  .global-loading * {
    position: relative !important;
  }

  /* Responsividade para loading */
  @media (max-width: 640px) {
    .global-loading {
      padding: 0.5rem !important;
    }
  }

  @media (max-width: 320px) {
    .global-loading {
      padding: 0.25rem !important;
    }
  }

  /* Garantir funcionamento em dispositivos com viewport muito pequeno */
  @media (max-height: 500px) {
    .global-loading {
      align-items: flex-start !important;
      padding-top: 2rem !important;
    }
  }

  /* Garantir que o loading apareça mesmo com scroll */
  .global-loading {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important;
  }

  /* Container da aplicação - Full Width */
  .app-container {
    @apply w-full min-h-screen;
  }
}
</style>
