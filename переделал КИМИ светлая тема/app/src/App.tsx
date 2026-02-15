import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { TimelineGrid } from '@/components/TimelineGrid';
import { AppointmentForm } from '@/components/AppointmentForm';
import { AuthDialog } from '@/components/AuthDialog';
import { ClientAnalytics } from '@/components/ClientAnalytics';
import { CashRegister } from '@/components/CashRegister';
import { NotificationsDialog, NewAppointmentPopup } from '@/components/Notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Users, Sparkles, Menu, X, Edit2, Check, Phone, Clock,
  Hand, Palette, Droplets, Heart, Plus, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import './App.css';

// ============================================
// Main App Component - Nails.S. Studio CRM
// ============================================

function App() {
  const { 
    isGuest, 
    isMaster, 
    isAdmin, 
    currentUser,
    masters,
    services,
    addMaster,
    updateMaster,
    deleteMaster,
    addService,
    updateService,
    deleteService,
    studioPhone,
    setStudioPhone,
    notifications,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'calendar' | 'masters' | 'services'>('calendar');
  
  // Appointment form state for grid click
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);
  const [preselectedTime, setPreselectedTime] = useState<string | undefined>();
  const [preselectedMasterId, setPreselectedMasterId] = useState<string | undefined>();
  
  // Notification popup state
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [lastNotification, setLastNotification] = useState<{title: string, message: string} | undefined>();
  
  // Services editing state
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServicePrice, setEditServicePrice] = useState('');
  const [editServiceDuration, setEditServiceDuration] = useState('');
  
  // Masters editing state
  const [editingMaster, setEditingMaster] = useState<string | null>(null);
  const [editMasterName, setEditMasterName] = useState('');
  const [showAddMaster, setShowAddMaster] = useState(false);
  const [newMasterName, setNewMasterName] = useState('');
  const [newMasterColor, setNewMasterColor] = useState('#3B82F6');
  
  // Add service state
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('60');
  const [newServiceCategory, setNewServiceCategory] = useState('Манікюр');
  
  // Phone editing state
  const [editingPhone, setEditingPhone] = useState(false);
  const [editPhoneValue, setEditPhoneValue] = useState(studioPhone);

  // Watch for new notifications
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      const latest = unreadNotifications[0];
      if (latest.type === 'new-appointment') {
        setLastNotification({
          title: latest.title,
          message: latest.message
        });
        setShowNotificationPopup(true);
      }
    }
  }, [notifications]);

  // Format current date
  const todayFormatted = new Date().toLocaleDateString('uk-UA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle add appointment from grid
  const handleAddAppointment = (time?: string, masterId?: string) => {
    setPreselectedTime(time);
    setPreselectedMasterId(masterId);
    setAppointmentFormOpen(true);
  };

  // Handle service update
  const handleUpdateService = (serviceId: string) => {
    const price = parseInt(editServicePrice);
    const duration = parseInt(editServiceDuration);
    if (editServiceName.trim() && !isNaN(price) && price > 0 && !isNaN(duration) && duration > 0) {
      updateService(serviceId, { 
        name: editServiceName.trim(),
        price, 
        duration 
      });
      setEditingService(null);
      setEditServiceName('');
      setEditServicePrice('');
      setEditServiceDuration('');
    }
  };

  // Handle service delete
  const handleDeleteService = (serviceId: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю послугу?')) {
      deleteService(serviceId);
    }
  };

  // Handle add service
  const handleAddService = () => {
    const price = parseInt(newServicePrice);
    const duration = parseInt(newServiceDuration);
    if (newServiceName.trim() && !isNaN(price) && price > 0 && !isNaN(duration) && duration > 0) {
      const colors = ['#3B82F6', '#06B6D4', '#0EA5E9', '#10B981', '#F59E0B'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      addService({
        name: newServiceName.trim(),
        price,
        duration,
        color: randomColor,
        category: newServiceCategory,
        isActive: true,
      });
      setShowAddService(false);
      setNewServiceName('');
      setNewServicePrice('');
      setNewServiceDuration('60');
    }
  };

  // Handle master update
  const handleUpdateMaster = (masterId: string) => {
    if (editMasterName.trim()) {
      updateMaster(masterId, { name: editMasterName.trim() });
      setEditingMaster(null);
      setEditMasterName('');
    }
  };

  // Handle add master
  const handleAddMaster = () => {
    if (newMasterName.trim()) {
      addMaster({
        name: newMasterName.trim(),
        color: newMasterColor,
        isActive: true,
        schedule: {
          monday: { start: '09:00', end: '18:00', isWorking: true },
          tuesday: { start: '09:00', end: '18:00', isWorking: true },
          wednesday: { start: '09:00', end: '18:00', isWorking: true },
          thursday: { start: '09:00', end: '18:00', isWorking: true },
          friday: { start: '09:00', end: '18:00', isWorking: true },
          saturday: { start: '10:00', end: '16:00', isWorking: true },
          sunday: { start: '00:00', end: '00:00', isWorking: false },
        }
      });
      setShowAddMaster(false);
      setNewMasterName('');
      setNewMasterColor('#3B82F6');
    }
  };

  // Handle master delete
  const handleDeleteMaster = (masterId: string) => {
    if (confirm('Ви впевнені, що хочете видалити цього майстра? Всі його записи також будуть видалені.')) {
      deleteMaster(masterId);
    }
  };

  // Handle phone update
  const handleUpdatePhone = () => {
    if (editPhoneValue.trim()) {
      setStudioPhone(editPhoneValue.trim());
      setEditingPhone(false);
    }
  };

  // Get service icon
  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'Нарощування':
        return <Hand className="h-5 w-5" />;
      case 'Дизайн':
        return <Palette className="h-5 w-5" />;
      case 'Догляд':
        return <Heart className="h-5 w-5" />;
      case 'Покриття':
        return <Droplets className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const categoryOptions = ['Манікюр', 'Покриття', 'Нарощування', 'Дизайн', 'Догляд', 'Додатково'];
  const colorOptions = ['#3B82F6', '#06B6D4', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* New Appointment Popup */}
      <NewAppointmentPopup 
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        notification={lastNotification}
      />

      {/* Appointment Form Dialog (from grid click) */}
      <AppointmentForm
        selectedDate={selectedDate}
        preselectedTime={preselectedTime}
        preselectedMasterId={preselectedMasterId}
        open={appointmentFormOpen}
        onOpenChange={setAppointmentFormOpen}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-sky-600 via-blue-600 to-blue-600 border-b border-blue-500/30 sticky top-0 z-40 shadow-lg shadow-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">
                  Nails.S. Studio
                </h1>
                <p className="text-xs text-blue-200">CRM система</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Button 
                variant={activeView === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('calendar')}
                className={cn(
                  activeView === 'calendar' 
                    ? 'bg-white text-blue-700 hover:bg-white/90' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Календар
              </Button>
              
              {isAdmin && (
                <>
                  <Button 
                    variant={activeView === 'masters' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveView('masters')}
                    className={cn(
                      activeView === 'masters' 
                        ? 'bg-white text-blue-700 hover:bg-white/90' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Майстри
                  </Button>
                  <Button 
                    variant={activeView === 'services' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveView('services')}
                    className={cn(
                      activeView === 'services' 
                        ? 'bg-white text-blue-700 hover:bg-white/90' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <Hand className="h-4 w-4 mr-2" />
                    Послуги
                  </Button>
                </>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Role Badge */}
              <Badge 
                variant="outline" 
                className={cn(
                  "hidden sm:inline-flex border-white/30",
                  isAdmin && "bg-white/20 text-white",
                  isMaster && "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
                  isGuest && "bg-gray-500/20 text-gray-300"
                )}
              >
                {isAdmin ? 'Адмін' : isMaster ? 'Майстер' : 'Гість'}
              </Badge>

              {/* Notifications (for masters) */}
              {isMaster && <NotificationsDialog />}

              {/* Analytics Button */}
              <ClientAnalytics />

              {/* Cash Register (Admin only) */}
              <CashRegister />

              {/* Auth */}
              <AuthDialog />

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-blue-800/50 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-2">
              <Button 
                variant={activeView === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setActiveView('calendar');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Календар
              </Button>
              
              {isAdmin && (
                <>
                  <Button 
                    variant={activeView === 'masters' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setActiveView('masters');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Майстри
                  </Button>
                  <Button 
                    variant={activeView === 'services' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setActiveView('services');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Hand className="h-4 w-4 mr-2" />
                    Послуги
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* Date & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {todayFormatted}
            </h2>
            <p className="text-sm text-blue-200">
              {isGuest 
                ? 'Режим перегляду - деякі функції обмежені' 
                : isMaster 
                  ? `Ви працюєте як ${currentUser?.name}` 
                  : 'Повний доступ до системи'}
            </p>
          </div>
          
          {!isGuest && (
            <AppointmentForm selectedDate={selectedDate} />
          )}
        </div>

        {/* Views */}
        {activeView === 'calendar' && (
          <TimelineGrid 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate}
            onAddAppointment={handleAddAppointment}
          />
        )}

        {activeView === 'masters' && isAdmin && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Майстри студії</h3>
              <Button 
                onClick={() => setShowAddMaster(true)}
                className="bg-gradient-to-r from-sky-500 to-blue-500 hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Додати майстра
              </Button>
            </div>

            {/* Add Master Form */}
            {showAddMaster && (
              <div className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20">
                <h4 className="text-white font-medium mb-3">Новий майстер</h4>
                <div className="grid gap-3">
                  <Input
                    value={newMasterName}
                    onChange={(e) => setNewMasterName(e.target.value)}
                    placeholder="Ім'я майстра"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <div className="flex gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewMasterColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          newMasterColor === color ? "border-white scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddMaster(false)}
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      Скасувати
                    </Button>
                    <Button 
                      onClick={handleAddMaster}
                      className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500"
                      disabled={!newMasterName.trim()}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Додати
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {masters.map(master => (
                <div 
                  key={master.id}
                  className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg"
                      style={{ backgroundColor: master.color }}
                    >
                      {master.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      {editingMaster === master.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editMasterName}
                            onChange={(e) => setEditMasterName(e.target.value)}
                            className="h-8 bg-white/10 border-white/20 text-white"
                            autoFocus
                          />
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="h-8 w-8 text-green-400"
                            onClick={() => handleUpdateMaster(master.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <h4 className="font-semibold text-white">{master.name}</h4>
                      )}
                      <Badge 
                        variant={master.isActive ? 'default' : 'secondary'}
                        className={master.isActive ? 'bg-green-500/50' : 'bg-gray-500/50'}
                      >
                        {master.isActive ? 'Активний' : 'Неактивний'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-blue-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Графік роботи:</span>
                    </div>
                    <div className="pl-6 space-y-0.5 text-xs">
                      <div>Пн-Пт: {master.schedule.monday.start} - {master.schedule.monday.end}</div>
                      <div>Сб: {master.schedule.saturday.start} - {master.schedule.saturday.end}</div>
                      <div>Нд: Вихідний</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => {
                        setEditingMaster(master.id);
                        setEditMasterName(master.name);
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Редагувати
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDeleteMaster(master.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'services' && isAdmin && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Послуги студії</h3>
              <Button 
                onClick={() => setShowAddService(true)}
                className="bg-gradient-to-r from-sky-500 to-blue-500 hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Додати послугу
              </Button>
            </div>

            {/* Add Service Form */}
            {showAddService && (
              <div className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20">
                <h4 className="text-white font-medium mb-3">Нова послуга</h4>
                <div className="grid gap-3">
                  <Input
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="Назва послуги"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      placeholder="Ціна (грн)"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Input
                      type="number"
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(e.target.value)}
                      placeholder="Хвилин"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat} className="bg-blue-900">{cat}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddService(false)}
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      Скасувати
                    </Button>
                    <Button 
                      onClick={handleAddService}
                      className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500"
                      disabled={!newServiceName.trim() || !newServicePrice}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Додати
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-3">
              {services.map(service => (
                <div 
                  key={service.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/10 border border-white/20 hover:border-white/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${service.color}30`, color: service.color }}
                    >
                      {getServiceIcon(service.category)}
                    </div>
                    <div>
                      {editingService === service.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editServiceName}
                            onChange={(e) => setEditServiceName(e.target.value)}
                            placeholder="Назва"
                            className="w-40 h-8 bg-white/10 border-white/20 text-white"
                          />
                          <Input
                            type="number"
                            value={editServicePrice}
                            onChange={(e) => setEditServicePrice(e.target.value)}
                            placeholder="Ціна"
                            className="w-24 h-8 bg-white/10 border-white/20 text-white"
                          />
                          <Input
                            type="number"
                            value={editServiceDuration}
                            onChange={(e) => setEditServiceDuration(e.target.value)}
                            placeholder="Хв"
                            className="w-20 h-8 bg-white/10 border-white/20 text-white"
                          />
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="h-8 w-8 text-green-400"
                            onClick={() => handleUpdateService(service.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-medium text-white">{service.name}</h4>
                          <p className="text-sm text-blue-200">{service.category} • {service.duration} хв</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingService !== service.id && (
                      <>
                        <span className="font-semibold text-lg text-white">{service.price} грн</span>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => {
                            setEditingService(service.id);
                            setEditServiceName(service.name);
                            setEditServicePrice(service.price.toString());
                            setEditServiceDuration(service.duration.toString());
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span>Nails.S. Studio CRM</span>
            </div>
            <div className="flex items-center gap-4">
              {editingPhone ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editPhoneValue}
                    onChange={(e) => setEditPhoneValue(e.target.value)}
                    className="w-40 h-7 text-sm bg-white/10 border-white/20 text-white"
                    autoFocus
                  />
                  <Button 
                    size="icon" 
                    variant="ghost"
                    className="h-7 w-7 text-green-400"
                    onClick={handleUpdatePhone}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button 
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  onClick={() => setEditingPhone(true)}
                >
                  <Phone className="h-3 w-3" />
                  {studioPhone}
                  <Edit2 className="h-3 w-3 ml-1 opacity-50" />
                </button>
              )}
              <span className="text-white/30">|</span>
              <span className="text-white/50">© 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
